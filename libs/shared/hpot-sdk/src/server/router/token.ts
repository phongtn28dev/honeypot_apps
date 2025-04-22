import { createCache } from '../../lib/kv/kv';
import { publicProcedure, router } from '../trpc';
import { createPublicClientByChain } from '../../lib/wallet';
import { defichainEvm, mainnet } from 'viem/chains';
import { berachainBartioTestnet } from '../../lib/chains';
import { z } from 'zod';

const ipCache = createCache('ip');

export const tokenRouter = router({
  queryNativeFaucet: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { req } = ctx;
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
