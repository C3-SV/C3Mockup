declare global {
  namespace React {
    type Key = string | number;

    type ReactText = string | number;

    interface ReactElement<
      P = any,
      T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
    > {
      type: T;
      props: P;
      key: Key | null;
    }

    type ReactNode =
      | ReactElement
      | ReactText
      | boolean
      | null
      | undefined
      | Iterable<ReactNode>;

    type JSXElementConstructor<P> = (props: P) => ReactNode;

    type CSSProperties = Record<string, string | number | undefined>;

    interface SyntheticEvent<T = Element> {
      preventDefault(): void;
      stopPropagation(): void;
      currentTarget: T;
      target: T;
    }

    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {}

    interface FormEvent<T = Element> extends SyntheticEvent<T> {}

    interface HTMLAttributes<T> {
      className?: string;
      children?: ReactNode;
      id?: string;
      style?: CSSProperties;
      [key: string]: any;
    }

    interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
      href?: string;
      rel?: string;
      target?: string;
    }

    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
      disabled?: boolean;
      type?: "button" | "submit" | "reset";
      value?: string;
    }

    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      autoComplete?: string;
      checked?: boolean;
      defaultValue?: string;
      minLength?: number;
      name?: string;
      placeholder?: string;
      required?: boolean;
      type?: string;
      value?: string;
    }

    interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
      name?: string;
      required?: boolean;
      value?: string;
    }

    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      minLength?: number;
      name?: string;
      required?: boolean;
      rows?: number;
      value?: string;
    }
  }

  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}

    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "react" {
  export type Key = React.Key;
  export type ReactText = React.ReactText;
  export type ReactNode = React.ReactNode;
  export type ReactElement<
    P = any,
    T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>,
  > = React.ReactElement<P, T>;
  export type JSXElementConstructor<P> = React.JSXElementConstructor<P>;
  export type CSSProperties = React.CSSProperties;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type AnchorHTMLAttributes<T> = React.AnchorHTMLAttributes<T>;
  export type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>;
  export type InputHTMLAttributes<T> = React.InputHTMLAttributes<T>;
  export type SelectHTMLAttributes<T> = React.SelectHTMLAttributes<T>;
  export type TextareaHTMLAttributes<T> = React.TextareaHTMLAttributes<T>;
}

declare module "react/jsx-runtime" {
  export const Fragment: unique symbol;
  export function jsx(type: any, props: any, key?: string): React.ReactElement<any, any>;
  export function jsxs(type: any, props: any, key?: string): React.ReactElement<any, any>;
}

declare module "react/jsx-dev-runtime" {
  export const Fragment: unique symbol;
  export function jsxDEV(
    type: any,
    props: any,
    key?: string,
    isStaticChildren?: boolean,
    source?: any,
    self?: any,
  ): React.ReactElement<any, any>;
}

export {};
