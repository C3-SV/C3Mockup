export const eventDrivenRevalidationPaths = ["/", "/compite", "/crea", "/conecta", "/eventos"] as const;

export type EventDrivenRevalidationPath = (typeof eventDrivenRevalidationPaths)[number];

export function isEventDrivenRevalidationPath(path: string): path is EventDrivenRevalidationPath {
  return (eventDrivenRevalidationPaths as readonly string[]).includes(path);
}
