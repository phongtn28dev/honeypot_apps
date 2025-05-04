import { createCache, kv } from '@/lib/kv';
import { publicProcedure, router } from '../trpc';
import requestIp from 'request-ip';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import { LRUCache } from 'lru-cache';
import { createPublicClientByChain } from '@/lib/client';
import BigNumber from 'bignumber.js';
import { defichainEvm, mainnet } from 'viem/chains';
import { berachainBartioTestnet } from '@/lib/chain';
import { z } from 'zod';

const ethPublicClient = createPublicClientByChain({
  ...mainnet,
  rpcUrls: {
    default: {
      http: [
        'https://cloudflare-eth.com',
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://eth-pokt.nodies.app',
        'ttps://eth-mainnet.public.blastapi.io',
      ],
    },
  },
});
const beraPublicClient = createPublicClientByChain(berachainBartioTestnet);

const ipCache = createCache('ip');
const requestStatus = {} as Record<string, boolean>;
const interval = 1000 * 60 * 60 * 24;
const faucetAmount = 0.05;

export const tokenRouter = router({
  queryNativeFaucet: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { req } = ctx;
      // const ip = requestIp.getClientIp(req);
      const cachedValue = await ipCache.get<{
        claimableUntil: number;
      }>(input.address);
      if (!cachedValue) {
        return {
          claimable: true,
        };
      } else {
        return {
          claimable: false,
          claimableUntil: cachedValue.claimableUntil,
        };
      }
    }),
});
