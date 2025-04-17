import {
  createPublicClient,
  getContract,
  http,
  fallback,
  Client,
  Transport,
  HttpTransport,
  FallbackTransport,
  PublicClient,
} from 'viem';
import { Chain } from 'viem/chains';

export const createPublicClientByChain = (chain: Chain): PublicClient =>
  createPublicClient({
    chain,
    batch: {
      multicall: true,
    },
    transport: fallback(
      chain.rpcUrls.default.http.map((url) => http(url)),
      {
        retryCount: 3,
        retryDelay: 1000,
      }
    ),
  });
