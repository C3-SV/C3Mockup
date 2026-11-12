import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// Vitest no activa los globales: sin esto el DOM de una prueba se acumula en la siguiente.
afterEach(() => {
  cleanup();
});
