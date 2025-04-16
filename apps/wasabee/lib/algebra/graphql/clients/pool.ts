import {
  PoolsByTokenPairQuery,
  PoolsByTokenPairDocument,
  PoolsByTokenPairQueryVariables,
  UserActivePositionsDocument,
  UserActivePositionsQuery,
  UserActivePositionsQueryVariables,
  useUserActivePositionsQuery,
  Pool,
  UserActivePositionsQueryResult,
  useNativePriceQuery,
  SinglePoolQuery,
  SinglePoolQueryVariables,
  SinglePoolDocument,
} from '../generated/graphql';
import { Address, getContract } from 'viem';
import { algebraPositionManagerAddress } from '@/wagmi-generated';
import { algebraPositionManagerAbi } from '@/wagmi-generated';
import { useEffect, useState } from 'react';
import { MAX_UINT128 } from '@/config/algebra/max-uint128';
import { wallet } from '@honeypot/shared';
import { CurrencyAmount, Token as AlgebranToken } from '@cryptoalgebra/sdk';
import { unwrappedToken } from '@cryptoalgebra/sdk';
import BigNumber from 'bignumber.js';
import { object } from 'zod';
import { PairContract } from '@/services/contract/dex/liquidity/pair-contract';
import { Token } from '@/services/contract/token';
import { useInfoClient } from '@/lib/hooks/useSubgraphClients';
import { ApolloClient } from '@apollo/client';
import { createClientHook } from '../clientUtils';
import { useObserver } from 'mobx-react-lite';
import { calculatePercentageChange } from '@/lib/utils';

export const poolQueryToContract = (pool: Pool): PairContract => {
  const pairContract = new PairContract({
    address: pool.id as Address,
    TVL_USD: pool.totalValueLockedUSD,
  });

  pairContract.token0 = Token.getToken({
    address: pool.token0.id,
    decimals: pool.token0.decimals,
    name: pool.token0.name,
    symbol: pool.token0.symbol,
    chainId: wallet.currentChainId.toString(),
  });

  pairContract.token1 = Token.getToken({
    address: pool.token1.id,
    decimals: pool.token1.decimals,
    name: pool.token1.name,
    symbol: pool.token1.symbol,
    chainId: wallet.currentChainId.toString(),
  });

  const currentDate = new Date().getTime();
  const msIn24Hours = 24 * 60 * 60 * 1000;
  const msIn48Hours = 48 * 60 * 60 * 1000;
  let total24hFees = 0;
  let total24hDataCount = 0;
  let total24hVolume = 0;
  let total24to48hVolume = 0;
  let total24to48hDataCount = 0;

  pool.poolHourData
    .filter((hour) => {
      return hour.periodStartUnix > currentDate / 1000 - msIn24Hours / 1000;
    })
    .map((hour) => {
      total24hFees += Number(hour.feesUSD);
      total24hDataCount++;
      total24hVolume += Number(hour.volumeUSD);
    });

  pool.poolHourData
    .filter((hour) => {
      return (
        hour.periodStartUnix > currentDate / 1000 - msIn48Hours / 1000 &&
        hour.periodStartUnix < currentDate / 1000 - msIn24Hours / 1000
      );
    })
    .map((hour) => {
      total24to48hVolume += Number(hour.volumeUSD);
      total24to48hDataCount++;
    });

  const avgFees24h =
    (total24hDataCount > 0 ? total24hFees / total24hDataCount : 0) * 24;
  const avgVolume24h =
    (total24hDataCount > 0 ? total24hVolume / total24hDataCount : 0) * 24;
  const avgVolume24to48h =
    total24to48hDataCount > 0 ? total24to48hVolume / total24to48hDataCount : 0;

  const avgAPR24h = (avgFees24h / Number(pool.totalValueLockedUSD)) * 365 * 100;
  const avgApr = avgAPR24h * 24;
  const volumeChange24to48h = calculatePercentageChange(
    avgVolume24h,
    avgVolume24to48h
  );

  pairContract.volume_24h_USD = avgVolume24h;
  pairContract.fees_24h_USD = avgFees24h;
  pairContract.apr_24h = avgApr;
  pairContract.volumeChange24h = volumeChange24to48h;

  return pairContract;
};

export const poolsByTokenPair = async (
  client: ApolloClient<any>,
  token0: string,
  token1: string
) => {
  const { data } = await client.query<
    PoolsByTokenPairQuery,
    PoolsByTokenPairQueryVariables
  >({
    query: PoolsByTokenPairDocument,
    variables: { token0, token1 },
  });

  return data?.pools;
};

export const userPools = async (
  client: ApolloClient<any>,
  userAddress: string
) => {
  const { data } = await client.query<
    UserActivePositionsQuery,
    UserActivePositionsQueryVariables
  >({
    query: UserActivePositionsDocument,
    variables: { account: userAddress.toLowerCase() },
  });

  const pools = data?.positions.map((position) => position.pool);

  return pools;
};

export const usePoolsClient = createClientHook(useInfoClient, {
  poolsByTokenPair,
  userPools,
});

export const useUserPools = (userAddress: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fetchedPositions, setFetchedPositions] = useState<string[]>([]);
  const { currentChainId } = useObserver(() => ({
    currentChainId: wallet.currentChainId,
  }));
  const { data, loading, refetch } = useUserActivePositionsQuery({
    variables: { account: userAddress.toLowerCase() },
    //fetchPolicy: "cache-and-network",
    //notifyOnNetworkStatusChange: true,
    // pollInterval: 10000,
    onError: (error) => {
      setTimeout(() => {
        refetch();
      }, 1000);
    },
  });

  const [pools, setPools] = useState<
    Record<string, Pool & { fees: BigNumber; userTVLUSD: BigNumber }>
  >({});

  const algebraPositionManager = getContract({
    address:
      algebraPositionManagerAddress[
        currentChainId as keyof typeof algebraPositionManagerAddress
      ],
    abi: algebraPositionManagerAbi,
    client: { public: wallet.publicClient, wallet: wallet.walletClient },
  });

  useEffect(() => {
    if (!data || !wallet.isInit || !algebraPositionManager.simulate) return;
    data.positions.forEach(async (position) => {
      if (fetchedPositions.includes(position.pool.id.concat('-', position.id)))
        return;
      try {
        const pool = position.pool;
        const {
          result: [fees0, fees1],
        } = await algebraPositionManager.simulate.collect([
          {
            tokenId: BigInt(position.id),
            recipient: wallet.account as `0x${string}`,
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
          },
        ]);

        const userTVLUSD =
          Number(position.depositedToken0 - position.withdrawnToken0) *
            Number(pool.token0.derivedUSD) +
          Number(position.depositedToken1 - position.withdrawnToken1) *
            Number(pool.token1.derivedUSD);

        const fees0USD = CurrencyAmount.fromRawAmount(
          unwrappedToken(
            new AlgebranToken(
              wallet.currentChainId,
              pool.token0.id,
              Number(pool.token0.decimals),
              pool.token0.symbol,
              pool.token0.name
            )
          ),
          fees0.toString()
        );

        const fees1USD = CurrencyAmount.fromRawAmount(
          unwrappedToken(
            new AlgebranToken(
              wallet.currentChainId,
              pool.token1.id,
              Number(pool.token1.decimals),
              pool.token1.symbol,
              pool.token1.name
            )
          ),
          fees1.toString()
        );

        const fees0USDformatted = fees0USD
          ? Number(fees0USD.toSignificant()) * Number(pool.token0.derivedUSD)
          : 0;
        const fees1USDformatted = fees1USD
          ? Number(fees1USD.toSignificant()) * Number(pool.token1.derivedUSD)
          : 0;

        if (
          fetchedPositions.includes(position.pool.id.concat('-', position.id))
        )
          return;

        setPools((prev) => {
          if (prev[pool.id]) {
            return {
              ...prev,
              [pool.id]: {
                ...prev[pool.id],
                fees: prev[pool.id].fees.plus(
                  BigNumber(fees0USDformatted + fees1USDformatted)
                ),
                userTVLUSD: prev[pool.id].userTVLUSD.plus(
                  BigNumber(userTVLUSD)
                ),
              },
            };
          } else {
            return {
              ...prev,
              [pool.id]: {
                ...(pool as Pool),
                fees: BigNumber(fees0USDformatted + fees1USDformatted),
                userTVLUSD: BigNumber(userTVLUSD),
              },
            };
          }
        });

        fetchedPositions.push(pool.id.concat('-', position.id));
      } catch (error) {
        console.error(error);
      }
    });

    setIsLoading(false);
  }, [algebraPositionManager.simulate, data, wallet.isInit]);

  return {
    data: { pools: Object.values(pools) ?? [] },
    loading: isLoading,
    refetch: refetch,
  };
};

export const poolExists = async (poolAddress: string) => {
  const infoClient = useInfoClient();
  const { data } = await infoClient.query<
    SinglePoolQuery,
    SinglePoolQueryVariables
  >({
    query: SinglePoolDocument,
    variables: { poolId: poolAddress },
  });

  return data?.pool !== null;
};
