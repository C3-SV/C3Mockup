import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/content";
import { getPublishedEventPages } from "@/lib/event-detail";
import { FirebaseNotConfiguredError } from "@/lib/events";
import { absoluteUrl } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import type { EventItem } from "@c3/config";

export const dynamic = "force-dynamic";

const routePriority: Record<(typeof publicRoutes)[number], number> = {
  "/": 1,
  "/que-es-c3": 0.8,
  "/compite": 0.8,
  "/crea": 0.8,
  "/conecta": 0.8,
  "/eventos": 0.9,
  "/faq": 0.6,
  "/empieza-en-c3": 0.7,
  "/contacto": 0.6,
  "/privacidad": 0.4,
  "/terminos": 0.4,
  "/codigo-de-conducta": 0.4,
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
 * Fichas publicadas (documentos reales con reserva activa). Un fallo real de Firestore se propaga: la petición del
 * sitemap falla y se reintenta, en vez de publicar un sitemap sin fichas ni sustituirlas por defaultEvents. Solo
 * cuando la cuenta de servicio no está configurada (entorno sin Firebase) se devuelven cero fichas, con un aviso.
 */
async function readEventPageEntries(): Promise<MetadataRoute.Sitemap> {
  let pages: EventItem[];
  try {
    pages = await getPublishedEventPages();
  } catch (error) {
    if (error instanceof FirebaseNotConfiguredError) {
      console.warn("Sitemap sin fichas de evento: Firebase no está configurado.");
      return [];
    }
    throw error;
  }

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
}

/**
 * Rutas generales sin lastmod: su contenido no cambia al editar una sola edición (H5, auditoría 2026-11-17).
 * Solo las fichas de evento llevan su fecha real.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = publicRoutes.map((path) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: absoluteUrl(path),
      changeFrequency: eventAwareRoutes.has(path) ? "weekly" : "monthly",
      priority: routePriority[path],
      images: [`${siteConfig.domain}${siteConfig.defaultOgImage}`],
    };

    return entry;
  });

  return [...routes, ...(await readEventPageEntries())];
}
