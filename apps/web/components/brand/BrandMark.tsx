import Image from "next/image";

/**
 * Logo de C3. Se usan los archivos del sitio tal cual (ACTUALIZACION-DS §7.4): el logo completo
 * a color en fondo claro y el monocromatico blanco en navy. No se recrean ni se deforman.
 */
export type BrandMarkVariant = "header" | "footer";

const SOURCES: Record<BrandMarkVariant, { src: string; width: number; height: number }> = {
  header: { src: "/brand/logo-c3-claro-con-color.png", width: 2048, height: 2048 },
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
