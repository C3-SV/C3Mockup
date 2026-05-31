declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
  cwd(): string;
  exitCode?: number;
};

declare const __dirname: string;

declare class Buffer {
  length: number;
  toString(encoding?: string): string;

  static from(data: string | ArrayBuffer | ArrayLike<number>, encoding?: string): Buffer;
}

declare module "path" {
  export function resolve(...segments: string[]): string;

  const path: {
    resolve(...segments: string[]): string;
  };

  export default path;
}

declare module "fs" {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, encoding: BufferEncoding): string;
}
