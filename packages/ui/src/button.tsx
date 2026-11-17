import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "sm";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonLinkProps = SharedButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type ButtonNativeProps = SharedButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  ref?: Ref<HTMLButtonElement>;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50";

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "border border-line bg-surface text-ink hover:bg-subtle",
  ghost: "text-ink hover:bg-subtle",
  danger: "border border-danger/25 bg-surface text-danger hover:bg-danger-soft",
};

export function Button(props: ButtonLinkProps): ReactElement;
export function Button(props: ButtonNativeProps): ReactElement;
export function Button(props: ButtonLinkProps | ButtonNativeProps) {
  const { children, className, variant = "primary", size = "md", ...rest } = props;
  const classes = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

  if (typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as Omit<ButtonLinkProps, keyof SharedButtonProps>;
    if (/^https?:\/\//.test(href)) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
