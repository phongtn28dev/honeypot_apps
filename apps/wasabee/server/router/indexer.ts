import { publicProcedure, router } from '../trpc';
import z from 'zod';
import { indexer } from '@/services/indexer/indexer';
import {
  GhostPoolPairResponse,
  GhostParticipatedProjectsResponse,
  PageRequest,
  TrendingMEMEs,
  GhostBundleResponse,
  GhostToken,
  LaunchTokenData,
  GhostAlgebraPairResponse,
} from '@/services/indexer/indexerTypes';
import { cacheProvider, getCacheKey } from '@/lib/server/cache';

export const indexerFeedRouter = router({
  getMostSuccessfulFtos: publicProcedure
    .input(
      z.object({
        chainId: z.string(),
        limit: z.number(),
      })
    )
    .query(async ({ input }) => {
      return cacheProvider.getOrSet(
        getCacheKey('getMostSuccessfulFtos', input),
        async () => {
          const res = await indexer.getMostSuccessfulFtos(
            input.chainId,
            input.limit
          );

          return res;
        }
      );
    }),
  getAllFtoTokens: publicProcedure
    .output(
      z.object({
        status: z.literal('success'),
        data: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            symbol: z.string(),
            decimals: z.number(),
          })
        ),
        message: z.string(),
      })
    )
    .query(async (): Promise<any> => {
      return cacheProvider.getOrSet(
        getCacheKey('getAllFtoTokens'),
        async () => {
          const res = await indexer.getAllFtoTokens();

          return res;
        }
      );
    }),
  getAllPairs: publicProcedure.query(
    async (): Promise<ApiResponseType<GhostPoolPairResponse>> => {
      return cacheProvider.getOrSet(getCacheKey('getAllPairs'), async () => {
        const res = await indexer.dataProvider.getAllPairs();
        return res;
      });
    }
  ),
  getValidatedTokenPairs: publicProcedure
    .input(
      z.object({
        chainId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return cacheProvider.getOrSet(
        getCacheKey('getValidatedTokenPairs', input),
        async () => {
          const res = await indexer.getValidatedTokenPairs(input.chainId);
          return res;
        },
        {
          ttl: 60 * 1000,
        }
      );
    }),
  getTrendingMEMEPairs: publicProcedure.query(
    async (): Promise<ApiResponseType<TrendingMEMEs>> => {
      return cacheProvider.getOrSet(
        getCacheKey('getTrendingMEMEPairs'),
        async () => {
          const res = await indexer.getTrendingMEMEPairs();
          return res;
        }
      );
    }
  ),
  getBundle: publicProcedure
    .input(
      z.object({
        chainId: z.string(),
      })
    )
    .query(async ({ input }): Promise<ApiResponseType<GhostBundleResponse>> => {
      return cacheProvider.getOrSet(
        getCacheKey('getBundle', input),
        async () => {
          const res = await indexer.getBundle(input.chainId);
          return res;
        }
      );
    }),

  getPairTokenData: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
        chainId: z.string(),
      })
    )
    .query(async ({ input }): Promise<ApiResponseType<GhostToken>> => {
      return cacheProvider.getOrSet(
        getCacheKey('getPairTokenData', input),
        async () => {
          const res = await indexer.getPairTokenData(
            input.tokenAddress,
            input.chainId
          );
          return res;
        }
      );
    }),

  getMemeGraphData: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
      })
    )
    .query(async ({ input }): Promise<ApiResponseType<LaunchTokenData[]>> => {
      return cacheProvider.getOrSet(
        getCacheKey('getMemeGraphData', input),
        async () => {
          return await indexer.getMemeGraphData(input.tokenAddress);
        }
      );
    }),
});
