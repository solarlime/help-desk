interface ImportMetaEnv {
  readonly DEBOUNCE_TIME: string;
  readonly HOST: string;
  readonly SERVER_DOWN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
