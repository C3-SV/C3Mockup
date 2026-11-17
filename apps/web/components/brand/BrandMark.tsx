import Image from "next/image";

/**
 * Logo de C3. Se usan los archivos oficiales tal cual, sin recrearlos ni deformarlos (DS §7.4).
 * Cabecera (fondo claro): c3-sim-azul, el logo completo oscuro del paquete (decision 2026-11-11,
 * tras revisar el navbar: la C del logo anterior es casi blanca y no se ve sobre blanco).
 * Pie (fondo navy): monocromatico blanco.
 */
export type BrandMarkVariant = "header" | "footer";

const SOURCES: Record<BrandMarkVariant, { src: string; width: number; height: number }> = {
  header: { src: "/brand/c3/c3-sim-azul.png", width: 2920, height: 1234 },
  footer: { src: "/brand/logo-c3-blanco-monocromatico.png", width: 2652, height: 2744 },
};

type BrandMarkProps = {
  variant: BrandMarkVariant;
  /** Texto alternativo. Vacio si el enlace que contiene ya tiene nombre accesible. */
  alt: string;
  /** Clases de utilidad para la imagen (la altura del pie la fija el DS con .c3-footer). */
  imageClassName?: string;
  priority?: boolean;
};

export function BrandMark({ variant, alt, imageClassName, priority }: BrandMarkProps) {
  const { src, width, height } = SOURCES[variant];
  return (
    <span className="c3-brand-mark">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={imageClassName}
        priority={priority}
      />
    </span>
  );
}
