import { kv as vercelKv } from '@vercel/kv';

export const kv = process.env['KV_URL'] ? vercelKv : new Map();

export const createCache = (
  namespace: string
): {
  set: (...args: Parameters<typeof vercelKv.set>) => Promise<void>;
  get: <T>(...args: Parameters<typeof vercelKv.get>) => Promise<T | null>;
} => {
  return {
    set: async (...args: Parameters<typeof vercelKv.set>) => {
      const [key, ...restArgs] = args;
      await vercelKv.set(`${namespace}-${key}`, ...restArgs);
    },
    get<T>(...args: Parameters<typeof vercelKv.get>) {
      const [key, ...restArgs] = args;
      return vercelKv.get<T>(`${namespace}-${key}`, ...restArgs);
    },
  };
};
