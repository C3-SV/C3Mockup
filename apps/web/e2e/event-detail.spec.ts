import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/**
 * Ficha permanente por edición, /eventos/{slug} (plan eventos-memorias, T6; ruling R29).
 *
 * Dos grupos:
 *
 * 1. Slugs mal formados: no tocan Firestore. La ruta devuelve 404 antes de consultar nada (getPublicEventBySlug
 *    descarta en memoria lo que no cumple ^[a-z0-9]+(?:-[a-z0-9]+)*$ y 3–120 caracteres), así que corren siempre.
 *
 * 2. Fichas con datos controlados: necesitan un Firestore de PRUEBA. Solo corren con
 *      E2E_FIRESTORE_TEST_PROJECT=demo-<nombre>   (el prefijo «demo-» lo reserva Firebase para emuladores)
 *      FIRESTORE_EMULATOR_HOST=127.0.0.1:<puerto> (siempre un emulador local)
 *    Sin ambas, se omiten con el motivo visible. Nunca se usan credenciales reales y nunca se escribe en un
 *    proyecto que no sea un emulador local: la siembra comprueba las dos variables antes de conectar.
 *
 *    Cómo correrlas contra el emulador (en otra terminal: `firebase emulators:start --only firestore --project demo-c3-e2e`):
 *      pnpm build:web con FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY vacíos (así el build
 *      tampoco usa el proyecto real de .env.local) y después:
 *      FIREBASE_PROJECT_ID=demo-c3-e2e FIREBASE_CLIENT_EMAIL=e2e@demo-c3-e2e.iam.gserviceaccount.com \
 *      FIREBASE_PRIVATE_KEY=<clave RSA PKCS8 desechable> FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
 *      E2E_FIRESTORE_TEST_PROJECT=demo-c3-e2e pnpm test:e2e
 *    El SDK exige una clave PEM bien formada aunque el emulador no la valide: genera una desechable, por ejemplo
 *      node -e "console.log(require('crypto').generateKeyPairSync('rsa',{modulusLength:2048,privateKeyEncoding:{type:'pkcs8',format:'pem'},publicKeyEncoding:{type:'spki',format:'pem'}}).privateKey.replace(/\n/g,'\\\\n'))"
 *    `next start` hereda esas variables (el servidor de pruebas debe arrancar con ellas: si ya hay uno corriendo con
 *    otro entorno, ciérralo, porque se reutiliza). Los documentos sembrados llevan el prefijo «e2e-»; no se
 *    borran al terminar (los dos proyectos de Playwright comparten la siembra): reinicia el emulador para limpiar.
 *
 * No se cambia getPublicEvents ni nada del sitio para servir fixtures: el sitio lee el emulador como leería el real.
 */

const project = process.env.E2E_FIRESTORE_TEST_PROJECT ?? "";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST ?? "";

const projectOk = /^demo-[a-z0-9-]+$/.test(project);
const emulatorOk = /^(localhost|127\.0\.0\.1|\[::1\]):\d+$/.test(emulatorHost);
const firestoreGate = projectOk && emulatorOk;
const gateReason = !projectOk
  ? "Sin proyecto de prueba: define E2E_FIRESTORE_TEST_PROJECT=demo-<nombre> (emulador de Firestore). No se usan credenciales reales."
  : "Falta FIRESTORE_EMULATOR_HOST apuntando a un emulador local (127.0.0.1:<puerto>); no se escribe en otro Firestore.";

// ---------------------------------------------------------------------------------------------------------
// 1. Sin Firestore
// ---------------------------------------------------------------------------------------------------------

test.describe("slugs mal formados (no consultan Firestore)", () => {
  const MALFORMED = ["AB", "Mayusculas-Invalidas", "con_guion_bajo", "-empieza-con-guion", "termina-con-guion-", "dos--guiones", "x".repeat(121)];

  for (const slug of MALFORMED) {
    test(`/eventos/${slug.length > 20 ? `${slug.slice(0, 12)}…(${slug.length})` : slug} responde 404 dentro del shell`, async ({ page }) => {
      const response = await page.goto(`/eventos/${slug}`);
      expect(response?.status()).toBe(404);
      await expect(page.locator("#contenido h1")).toHaveText("No encontramos esta página");
      await expect(page.locator(".c3-site-header")).toBeVisible();
    });
  }

  test("el 404 de un slug mal formado no tiene scroll horizontal y pasa axe", async ({ page }) => {
    await page.goto("/eventos/Slug-Invalido");
    await expectNoHorizontalScroll(page);
    await expectNoSeriousA11y(page, "#contenido");
  });
});

// ---------------------------------------------------------------------------------------------------------
// 2. Con un Firestore de prueba (emulador)
// ---------------------------------------------------------------------------------------------------------

const SLUGS = {
  published: "e2e-edicion-publicada",
  draftPage: "e2e-edicion-borrador",
  draftMemory: "e2e-memoria-borrador",
  retired: "e2e-edicion-retirada",
  unknown: "e2e-edicion-inexistente",
} as const;

const DRAFT_MARKER = "TEXTO-DE-BORRADOR-E2E";
const MEMORY_MARKER = "TEXTO-DE-MEMORIA-EN-BORRADOR-E2E";
const SITE_CTA = "Ver sitio de la edición";
const SITE_HREF = "https://hackathon.c3.com.sv";

const SEED_TIME = "2026-01-01T00:00:00.000Z";

type Doc = Record<string, unknown>;

function baseEvent(title: string, page: Doc): Doc {
  return {
    title,
    description: `Descripción de prueba de «${title}».`,
    lines: ["crea"],
    status: "Histórico",
    cta: SITE_CTA,
    href: SITE_HREF,
    external: true,
    featured: false,
    eventDate: "2025-05-10",
    eventDateEnd: "2025-05-11",
    page,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
  };
}

function publishedPage(slug: string, memory: Doc | undefined): Doc {
  return {
    slug,
    publication: "published",
    overview: ["Primer párrafo de prueba de la ficha.", "Segundo párrafo de prueba de la ficha."],
    audience: "Estudiantes de prueba",
    requirements: ["Traer una laptop de prueba"],
    modality: "presencial",
    location: "Sede de prueba",
    resources: [{ title: "Bases de prueba", url: "/bases" }],
    ...(memory ? { memory } : {}),
  };
}

const publishedMemory: Doc = {
  publication: "published",
  summary: ["Resumen de prueba de la memoria."],
  learnings: ["Aprendizaje de prueba."],
  results: [
    { label: "Equipos", value: "12", context: "Contexto de prueba del resultado.", evidenceUrl: "https://c3.com.sv/evidencia" },
  ],
  outputs: [{ title: "Proyecto de prueba", description: "Descripción de prueba del proyecto.", url: "https://c3.com.sv/proyecto" }],
  gallery: [
    { url: "https://c3.com.sv/img/e2e.png", alt: "Imagen de prueba de la galería", caption: "Pie de prueba", rightsConfirmed: true },
  ],
};

/** Siembra el emulador. Idempotente: los dos proyectos de Playwright la ejecutan y escriben lo mismo. */
async function seedEmulator() {
  // Defensa en profundidad: aunque la puerta ya lo comprobó, nunca se conecta fuera de un emulador local.
  if (!firestoreGate) {
    throw new Error(gateReason);
  }
  const { deleteApp, initializeApp } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  const app = initializeApp({ projectId: project }, `e2e-seed-${process.pid}-${Date.now()}`);

  try {
    const db = getFirestore(app);
    const events = (id: string, doc: Doc) => db.collection("events").doc(id).set(doc);
    const reserve = (slug: string, eventId: string, retired: boolean) =>
      db.collection("eventPageSlugs").doc(slug).set({ eventId, retired });

    await Promise.all([
      events("e2e-publicada", baseEvent("Hackathon E2E publicado", publishedPage(SLUGS.published, publishedMemory))),
      reserve(SLUGS.published, "e2e-publicada", false),

      events("e2e-borrador", baseEvent("Evento E2E en borrador", { ...publishedPage(SLUGS.draftPage, undefined), publication: "draft", overview: [DRAFT_MARKER] })),
      reserve(SLUGS.draftPage, "e2e-borrador", false),

      events(
        "e2e-memoria-borrador",
        baseEvent("Evento E2E con memoria en borrador", publishedPage(SLUGS.draftMemory, { ...publishedMemory, publication: "draft", summary: [MEMORY_MARKER] })),
      ),
      reserve(SLUGS.draftMemory, "e2e-memoria-borrador", false),

      events("e2e-retirada", baseEvent("Evento E2E retirado", publishedPage(SLUGS.retired, undefined))),
      reserve(SLUGS.retired, "e2e-retirada", true),
    ]);
  } finally {
    await deleteApp(app);
  }
}

/** PNG de 1×1 para que las imágenes de prueba (host de C3) no salgan a la red. */
const PIXEL = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==", "base64");

async function blockImageNetwork(page: Page) {
  await page.route(/^https:\/\/c3\.com\.sv\//, (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: PIXEL }),
  );
}

test.describe("fichas con datos controlados (Firestore de prueba)", () => {
  test.skip(!firestoreGate, gateReason);

  test.beforeAll(async () => {
    if (firestoreGate) {
      await seedEmulator();
    }
  });

  test.beforeEach(async ({ page }) => {
    await blockImageNetwork(page);
  });

  test("ficha publicada: 200, una h1, migas, secciones, memoria y enlace original", async ({ page }) => {
    const response = await page.goto(`/eventos/${SLUGS.published}`);
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Hackathon E2E publicado");

    const crumbs = page.getByRole("navigation", { name: "Ruta de navegación" });
    await expect(crumbs.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    await expect(crumbs.getByRole("link", { name: "Eventos" })).toHaveAttribute("href", "/eventos");
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText("Hackathon E2E publicado");

    await expect(page.getByRole("heading", { level: 2, name: "Acerca de este evento" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Información práctica" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Memoria de la edición" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Resultados" })).toBeVisible();
    await expect(page.getByText("Resumen de prueba de la memoria.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Proyecto de prueba" })).toHaveAttribute("href", "https://c3.com.sv/proyecto");

    // El micrositio original se conserva como enlace informativo dentro de la ficha (spec §6 y §11).
    const original = page.getByRole("link", { name: SITE_CTA });
    await expect(original).toHaveAttribute("href", SITE_HREF);
    await expect(original).toHaveAttribute("rel", /noopener/);

    // Edición terminada: no se invita a inscribirse.
    await expect(page.getByRole("heading", { level: 2, name: "Participa" })).toHaveCount(0);
  });

  test("ficha publicada: canonical propio y JSON-LD WebPage y BreadcrumbList", async ({ page }) => {
    await page.goto(`/eventos/${SLUGS.published}`);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/eventos/${SLUGS.published}$`));

    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = scripts.map((text) => (JSON.parse(text) as { "@type": string })["@type"]);
    expect(types).toEqual(expect.arrayContaining(["WebPage", "BreadcrumbList"]));
    expect(types).not.toContain("Event");
  });

  test("ficha publicada: ausencia de fuga (derechos de la galería no llegan al navegador)", async ({ page }) => {
    const response = await page.goto(`/eventos/${SLUGS.published}`);
    const html = (await response?.text()) ?? "";
    expect(html).not.toContain("rightsConfirmed");
    expect(html).not.toContain(DRAFT_MARKER);
    expect(html).not.toContain(MEMORY_MARKER);
  });

  test("ficha publicada: sin scroll horizontal y accesible", async ({ page }) => {
    await page.goto(`/eventos/${SLUGS.published}`);
    await expectNoHorizontalScroll(page);
    await expectNoSeriousA11y(page, "#contenido");
  });

  test("ficha en borrador: 404 y su texto no se filtra", async ({ page }) => {
    const response = await page.goto(`/eventos/${SLUGS.draftPage}`);
    expect(response?.status()).toBe(404);
    expect((await response?.text()) ?? "").not.toContain(DRAFT_MARKER);
    await expect(page.locator("#contenido h1")).toHaveText("No encontramos esta página");
  });

  test("ficha publicada con memoria en borrador: 200 sin memoria y sin filtrar su texto", async ({ page }) => {
    const response = await page.goto(`/eventos/${SLUGS.draftMemory}`);
    expect(response?.status()).toBe(200);
    expect((await response?.text()) ?? "").not.toContain(MEMORY_MARKER);
    await expect(page.getByRole("heading", { level: 2, name: "Memoria de la edición" })).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 2, name: "Acerca de este evento" })).toBeVisible();
  });

  test("slug retirado y slug desconocido: 404", async ({ page }) => {
    for (const slug of [SLUGS.retired, SLUGS.unknown]) {
      const response = await page.goto(`/eventos/${slug}`);
      expect(response?.status(), slug).toBe(404);
    }
  });

  test("el sitemap lista la ficha publicada y no borradores ni reservas retiradas", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    expect(xml).toContain(`/eventos/${SLUGS.published}`);
    for (const slug of [SLUGS.draftPage, SLUGS.retired, SLUGS.unknown]) {
      expect(xml, slug).not.toContain(`/eventos/${slug}`);
    }
  });
});
