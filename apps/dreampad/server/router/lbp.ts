import { authProcedure, publicProcedure, router } from '../trpc';
import z from 'zod';
import PQueue from 'p-queue';
import { ftoService } from '../service/fto';
import { cacheProvider, getCacheKey } from '@/lib/server/cache';
import { chain } from 'lodash';
import { lbpService } from '../service/lbp';

export const lbpRouter = router({
  createLbpTransaction: publicProcedure
    .input(
      z.object({
        tx_hash: z.string(),
        buy_amount: z.string(),
        lbp_address: z.string(),
        chain_id: z.number(),
        wallet_address: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return lbpService.createLbpTransaction({
        ...input,
        created_at: new Date().toISOString(),
      });
    }),
  getLbpTransactions: publicProcedure
    .input(
      z.object({
        tx_hash: z.string(),
      })
    )
    .query(async ({ input }) => {
      return lbpService.getLbpTransactions(input);
    }),
  getLbpTransactionsByLbpAddress: publicProcedure
    .input(
      z.object({
        lbp_address: z.string(),
      })
    )
    .query(async ({ input }) => {
      return lbpService.getLbpTransactionsByLbpAddress(input);
    }),
});
