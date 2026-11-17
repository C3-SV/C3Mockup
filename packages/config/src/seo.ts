/**
 * Patrón de ruta de las fichas de evento. Se revalida con `revalidatePath(patrón, "page")`: es un patrón de ruta,
 * no una dirección concreta, así que el tipo es obligatorio. No existe ningún comodín /eventos/*.
 */
export const eventPageRevalidationPattern = "/eventos/[slug]" as const;

/** Lista cerrada de rutas que el admin puede pedir revalidar (y que el webhook del sitio acepta). */
export const eventDrivenRevalidationPaths = [
  "/",
  "/compite",
  "/crea",
  "/conecta",
  "/eventos",
  eventPageRevalidationPattern,
  "/sitemap.xml",
] as const;

export type EventDrivenRevalidationPath = (typeof eventDrivenRevalidationPaths)[number];

export function isEventDrivenRevalidationPath(path: string): path is EventDrivenRevalidationPath {
  return (eventDrivenRevalidationPaths as readonly string[]).includes(path);
}

/** Tipo que lleva `revalidatePath`: «page» para el patrón de fichas; las rutas literales no llevan tipo. */
export function getRevalidationPathType(path: EventDrivenRevalidationPath): "page" | undefined {
  return path === eventPageRevalidationPattern ? "page" : undefined;
}
