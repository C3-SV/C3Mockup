declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
  cwd(): string;
};

declare class Buffer {
  length: number;
  toString(encoding?: string): string;

  static from(data: string | ArrayBuffer | ArrayLike<number>, encoding?: string): Buffer;
}
