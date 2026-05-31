import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { cn } from "./utils";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

type ButtonLinkProps = SharedButtonProps & {
  href: string;
  target?: string;
  rel?: string;
};

type ButtonNativeProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href?: never;
  };

const baseStyles =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200";

const variantStyles: Record<NonNullable<SharedButtonProps["variant"]>, string> = {
  primary: "bg-[#33BEAC] text-[#0F203E] hover:-translate-y-0.5 hover:bg-[#46b8a8]",
  secondary: "border border-white/20 bg-white/10 text-white hover:bg-white/18",
  ghost: "text-[#0F203E] hover:bg-[#0F203E]/6",
};

export function Button(props: ButtonLinkProps): ReactElement;
export function Button(props: ButtonNativeProps): ReactElement;
export function Button(props: ButtonLinkProps | ButtonNativeProps) {
  const variant: keyof typeof variantStyles = props.variant ?? "primary";
  const className = cn(baseStyles, variantStyles[variant], props.className);

  if ("href" in props) {
    const href = props.href!;
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      const {
        children,
        className: _className,
        variant: _variant,
        href: _href,
        ...anchorProps
      } = props;
      return (
        <a href={href} className={className} {...anchorProps}>
          {children}
        </a>
      );
    }

    const { children, className: _className, variant: _variant, href: _href, ...linkProps } = props;
    return (
      <Link href={href} className={className} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { children, className: _className, variant: _variant, ...buttonProps } = props;
  return (
    <button type={buttonProps.type ?? "button"} className={className} {...buttonProps}>
      {children}
    </button>
  );
}
