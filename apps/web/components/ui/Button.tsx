import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { c3ContextTokens, c3Palette, type C3ButtonVariant, type C3Context, type C3Surface } from "@/lib/c3-theme";
import { cn } from "./utils";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: C3ButtonVariant | "ghost";
  context?: C3Context;
  surface?: C3Surface;
  loading?: boolean;
};

type ButtonLinkProps = SharedButtonProps & {
  href: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
};

type ButtonNativeProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

const baseClasses =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-0 motion-reduce:transition-none";

const compactTextClasses =
  "inline-flex items-center gap-1.5 rounded-full px-0 py-0 text-sm font-semibold tracking-wide underline-offset-4 transition duration-200";

const loadingSpinner =
  "h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent";

const textOnPrimary: Record<C3Context, string> = {
  general: c3Palette.ink,
  compite: c3Palette.white,
  crea: c3Palette.ink,
  conecta: c3Palette.white,
};

const surfaceRings: Record<C3Surface, string> = {
  dark: "focus-visible:ring-white/40 focus-visible:ring-offset-[#0F203E]",
  light: "focus-visible:ring-[#205298]/28 focus-visible:ring-offset-white",
};

function getSharedClasses(surface: C3Surface, disabled?: boolean, loading?: boolean) {
  return cn(
    baseClasses,
    surfaceRings[surface],
    disabled || loading ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5 active:scale-[0.99]",
  );
}

function getVariantClasses(
  variant: C3ButtonVariant | "ghost",
  context: C3Context,
  surface: C3Surface,
  disabled?: boolean,
) {
  const tokens = c3ContextTokens[context];

  if (variant === "featured") {
    return {
      className: cn(
        "border-white/12 text-white shadow-[0_16px_34px_rgba(2,8,22,0.28)]",
        surface === "dark"
          ? "bg-[length:220%_100%] bg-no-repeat"
          : "bg-[length:220%_100%] bg-no-repeat shadow-[0_14px_28px_rgba(2,8,22,0.14)]",
        disabled ? "shadow-none" : "group-hover:shadow-[0_20px_42px_rgba(2,8,22,0.32)]",
      ),
      style: {
        backgroundImage: tokens.gradient,
        backgroundPosition: "0% 50%",
        color: c3Palette.white,
      } as const,
    };
  }

  if (variant === "primary") {
    return {
      className: cn(
        "border-transparent shadow-[0_14px_28px_rgba(2,8,22,0.14)]",
        surface === "dark" ? "hover:shadow-[0_18px_32px_rgba(2,8,22,0.18)]" : "shadow-[0_12px_24px_rgba(15,32,62,0.10)]",
      ),
      style: {
        backgroundColor: tokens.main,
        color: textOnPrimary[context],
      } as const,
    };
  }

  if (variant === "secondary" || variant === "ghost") {
    return {
      className: cn(
        surface === "dark"
          ? "border-white/18 bg-white/8 text-white hover:border-white/26 hover:bg-white/12"
          : "border-[#D5DFEA] bg-white text-[#0F203E] hover:border-[#B9C7D8] hover:bg-[#F8FAFD]",
      ),
      style: {
        borderColor: tokens.main,
        color: surface === "dark" ? c3Palette.white : c3Palette.ink,
      } as const,
    };
  }

  return {
    className: cn(compactTextClasses, "hover:underline"),
    style: {
      color: tokens.main,
    } as const,
  };
}

function ButtonContent({ children, loading }: { children: ReactNode; loading?: boolean }) {
  return (
    <>
      {loading ? <span aria-hidden="true" className={loadingSpinner} /> : null}
      <span className="relative z-10">{children}</span>
    </>
  );
}

export function Button(props: ButtonLinkProps): JSX.Element;
export function Button(props: ButtonNativeProps): JSX.Element;
export function Button(props: ButtonLinkProps | ButtonNativeProps) {
  const variant = props.variant ?? "primary";
  const context = props.context ?? "general";
  const surface = props.surface ?? "dark";
  const disabled = "disabled" in props ? props.disabled : false;
  const loading = props.loading ?? false;
  const sharedClasses = getSharedClasses(surface, disabled, loading);
  const variantConfig = getVariantClasses(variant, context, surface, disabled);
  const className = cn(sharedClasses, variantConfig.className, props.className);
  const style = variantConfig.style ?? undefined;
  const isInteractive = !disabled && !loading;
  const showShimmer = variant === "featured" && isInteractive;

  if ("href" in props) {
    const {
      children,
      className: _className,
      variant: _variant,
      context: _context,
      surface: _surface,
      loading: _loading,
      disabled: _disabled,
      href,
      target,
      rel,
    } = props;
    if (!href) {
      return null;
    }
    const external = /^https?:\/\//.test(href);
    const computedRel = external ? rel ?? (target === "_blank" ? "noreferrer noopener" : undefined) : rel;

    if (!isInteractive) {
      return (
        <span aria-disabled="true" aria-busy={loading || undefined} className={className} style={style}>
          {showShimmer ? (
            <span
              aria-hidden="true"
              className="c3-button-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_8%,rgba(255,255,255,0.38)_44%,transparent_62%)] bg-[length:220%_100%] mix-blend-soft-light"
            />
          ) : null}
          <ButtonContent loading={loading}>{children}</ButtonContent>
        </span>
      );
    }

    if (external) {
      return (
        <a
          href={href}
          target={target}
          rel={computedRel}
          aria-disabled={undefined}
          aria-busy={loading || undefined}
          className={className}
          style={style}
        >
          {showShimmer ? (
            <span
              aria-hidden="true"
              className="c3-button-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_8%,rgba(255,255,255,0.38)_44%,transparent_62%)] bg-[length:220%_100%] mix-blend-soft-light"
            />
          ) : null}
          <ButtonContent loading={loading}>{children}</ButtonContent>
        </a>
      );
    }

    return (
      <Link
        href={href}
        aria-disabled={undefined}
        aria-busy={loading || undefined}
        className={className}
        style={style}
      >
        {showShimmer ? (
          <span
            aria-hidden="true"
            className="c3-button-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_8%,rgba(255,255,255,0.38)_44%,transparent_62%)] bg-[length:220%_100%] mix-blend-soft-light"
          />
        ) : null}
        <ButtonContent loading={loading}>{children}</ButtonContent>
      </Link>
    );
  }

  const {
    children,
    className: _className,
    variant: _variant,
    context: _context,
    surface: _surface,
    loading: _loading,
    disabled: nativeDisabled,
    type,
    ...buttonProps
  } = props;

  const buttonDisabled = Boolean(nativeDisabled || loading);

  return (
    <button
      type={type ?? "button"}
      disabled={buttonDisabled}
      aria-busy={loading || undefined}
      className={className}
      style={style}
      {...buttonProps}
    >
      {showShimmer ? (
        <span
          aria-hidden="true"
          className="c3-button-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_8%,rgba(255,255,255,0.38)_44%,transparent_62%)] bg-[length:220%_100%] mix-blend-soft-light"
        />
      ) : null}
      <ButtonContent loading={loading}>{children}</ButtonContent>
    </button>
  );
}

export default Button;
