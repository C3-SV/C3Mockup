import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/** Botones del DS (ACTUALIZACION-DS §7.5): primario, contorno, blanco y oscuro. */
export type ButtonVariant = "primario" | "contorno" | "blanco" | "dark";

type SharedProps = {
  variant?: ButtonVariant;
  /** Tamano pequeno del DS: mantiene 44 px de area tactil. */
  small?: boolean;
  /** Flecha ↗ para acciones que llevan a otra pantalla o a un sitio externo. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsNative = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = SharedProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export type ButtonProps = ButtonAsNative | ButtonAsLink;

const EXTERNAL = /^https?:\/\//;

function buttonClasses({ variant = "primario", small, className }: SharedProps) {
  return ["c3-btn", `c3-btn--${variant}`, small ? "c3-btn--small" : null, className]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  const { variant, small, arrow, className, children, ...rest } = props;
  const classes = buttonClasses({ variant, small, className, children });
  const content = (
    <>
      {children}
      {arrow ? (
        <span className="c3-arrow" aria-hidden="true">
          ↗
        </span>
      ) : null}
    </>
  );

  if (typeof props.href === "string") {
    const { href, ...anchorRest } = rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };
    if (EXTERNAL.test(href)) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...anchorRest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
