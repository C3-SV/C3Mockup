import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/PageShell", () => ({ default: ({ children }: { children: ReactNode }) => <main>{children}</main> }));

import EventError from "./error";

describe("error de la ficha de evento", () => {
  it("muestra un mensaje seguro, sin exponer el error interno, y permite reintentar", () => {
    const retry = vi.fn();
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const error = Object.assign(new Error("PERMISSION_DENIED: projects/c3-secret/databases"), { digest: "abc123" });

    const { container } = render(<EventError error={error} unstable_retry={retry} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/PERMISSION_DENIED|c3-secret|abc123/);
    fireEvent.click(screen.getByRole("button", { name: /intentar de nuevo/i }));
    expect(retry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: /eventos/i })).toHaveAttribute("href", "/eventos");
    log.mockRestore();
  });
});
