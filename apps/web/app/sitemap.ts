import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/content";
import { getPublishedEventPages } from "@/lib/event-detail";
import { getPublicEvents } from "@/lib/events";
import { siteConfig } from "@/lib/site";
import { getLatestEventLastModified, type EventItem } from "@c3/config";

export const dynamic = "force-dynamic";

const routePriority: Record<(typeof publicRoutes)[number], number> = {
  "/": 1,
  "/que-es-c3": 0.8,
  "/compite": 0.8,
  "/crea": 0.8,
  "/conecta": 0.8,
  "/eventos": 0.9,
  "/faq": 0.6,
  "/contacto": 0.6,
};

const eventAwareRoutes = new Set<(typeof publicRoutes)[number]>([
  "/",
  "/compite",
  "/crea",
  "/conecta",
  "/eventos",
]);

/** Fecha de modificación real del documento (updatedAt, o createdAt si falta); si no hay ninguna válida, ninguna. */
function documentLastModified(event: Pick<EventItem, "updatedAt" | "createdAt">): Date | undefined {
  for (const value of [event.updatedAt, event.createdAt]) {
    if (!value) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return undefined;
}

/**
 * Fichas publicadas (documentos reales con reserva activa). Si Firestore falla, el sitemap sigue con las rutas
 * generales y sin fichas: no se sustituye por defaultEvents ni se inventan direcciones.
 */
async function readEventPageEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const pages = await getPublishedEventPages();
    return pages.map((event) => {
      const entry: MetadataRoute.Sitemap[number] = {
        url: `${siteConfig.domain}/eventos/${event.page?.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
      };
      const lastModified = documentLastModified(event);
      if (lastModified) {
        entry.lastModified = lastModified;
      }
      return entry;
    });
  } catch (error) {
    console.warn("Sitemap sin fichas de evento: no se pudo leer Firestore.", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getPublicEvents();
  const lastModified = getLatestEventLastModified(events) ?? new Date();

  const routes = publicRoutes.map((path) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${siteConfig.domain}${path}`,
      changeFrequency: eventAwareRoutes.has(path) ? "weekly" : "monthly",
      priority: routePriority[path],
      images: [`${siteConfig.domain}${siteConfig.defaultOgImage}`],
    };

    if (eventAwareRoutes.has(path)) {
      entry.lastModified = lastModified;
    }

    return entry;
  });

  return [...routes, ...(await readEventPageEntries())];
}
