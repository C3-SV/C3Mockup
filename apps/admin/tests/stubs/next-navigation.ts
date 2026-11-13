import { vi } from "vitest";

/**
 * Sustituto de next/navigation para las pruebas de componentes: un enrutador simulado y compartido, para comprobar
 * a dónde navega la pantalla sin depender del enrutador de Next.
 */
export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
};

export function useRouter() {
  return routerMock;
}

export function usePathname() {
  return "/admin/events";
}
