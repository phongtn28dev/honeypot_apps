import { useQuery } from '@apollo/client';
import { LEADERBOARD_QUERY } from '../lib/graphql/clients/leaderboard';
import BigNumber from 'bignumber.js';
import type { FactoryData } from '../lib/graphql/clients/leaderboard';
import { wallet } from '../lib/wallet/wallet';
import { usePoolsListQuery } from '../lib/graphql/generated/graphql';

export function useLeaderboard() {
  const { data, loading, error, refetch } =
    useQuery<FactoryData>(LEADERBOARD_QUERY);

  const { data: poolsData } = usePoolsListQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
    initialFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    pollInterval: 10000, // Refetch every 10 seconds,
    variables: {
      search: '',
    },
  });

  const poolsTVL = poolsData?.pools.reduce((acc, pool) => {
    return acc.plus(pool.totalValueLockedUSD);
  }, new BigNumber(0));

  const formatValue = (value: string) => {
    const bn = new BigNumber(value || '0');
    return {
      usd: `$${bn.toFormat(2)}`,
      matic: `${bn.toFormat(2)} ${wallet.currentChain?.nativeToken?.symbol}`,
    };
  };

  const stats = data?.factories[0]
    ? {
        totalTrades: {
          title: 'Total Trades',
          value: data.factories[0].txCount,
        },
        totalVolume: {
          title: 'Total Volume',
          value: formatValue(data.factories[0].untrackedVolumeUSD).usd,
        },
        tvl: {
          title: 'TVL',
          value: formatValue(poolsTVL?.toString() || '0').usd,
        },
        totalFees: {
          title: 'Total Fees',
          value: formatValue(data.factories[0].totalFeesUSD).usd,
        },
      }
    : null;

  return {
    stats,
    loading,
    error,
  };
}
