import { expect, it } from "vitest";
import { cn } from "@/lib/utils";

it("une clases y descarta valores falsos", () => {
  expect(cn("a", false && "b", "c")).toBe("a c");
});
