export const ensureEnv = (varName: string): string =>
  process.env[varName] ||
  (() => {
    throw new Error(`Cannot find environment variable ${varName}`);
  })();
