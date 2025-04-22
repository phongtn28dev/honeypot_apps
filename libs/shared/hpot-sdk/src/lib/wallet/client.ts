import { createPublicClient, http, fallback } from 'viem';
import { Chain } from 'viem/chains';

// No-timeout fetch wrapper
const noTimeoutFetch = (url: string) =>
  http(url, {
    fetchOptions: {
      // Node.js doesn't have fetch timeout by default, but some environments might
      // so this ensures any custom timeout settings are removed
      signal: undefined,
    },
    // optional: increase polling interval for stability
    retryCount: 5,
    retryDelay: 2000,
  });

export const createPublicClientByChain = (chain: Chain) =>
  createPublicClient({
    chain,
    batch: {
      multicall: true,
    },
    transport: fallback(
      chain.rpcUrls.default.http.map((url) => noTimeoutFetch(url)),
      {
        retryCount: 5,
        retryDelay: 2000,
      }
    ),
  });
