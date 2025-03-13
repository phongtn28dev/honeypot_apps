import { useQuery } from "@apollo/client";
import { LEADERBOARD_QUERY } from "../algebra/graphql/clients/leaderboard";
import BigNumber from "bignumber.js";
import type { FactoryData } from "../algebra/graphql/clients/leaderboard";
import { wallet } from "@/services/wallet";
import { usePoolsListQuery } from "@/lib/algebra/graphql/generated/graphql";

export function useLeaderboard() {
  const { data, loading, error, refetch } =
    useQuery<FactoryData>(LEADERBOARD_QUERY);

  const { data: poolsData } = usePoolsListQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-and-network",
    initialFetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    pollInterval: 10000, // Refetch every 10 seconds,
    variables: {
      search: "",
    },
  });
  console.log("poolsData", poolsData);

  const poolsTVL = poolsData?.pools.reduce((acc, pool) => {
    console.log("pool", pool);
    return acc.plus(pool.totalValueLockedUSD);
  }, new BigNumber(0));

  console.log("poolsTVL", poolsTVL);

  const formatValue = (value: string) => {
    const bn = new BigNumber(value || "0");
    return {
      usd: `$${bn.toFormat(2)}`,
      matic: `${bn.toFormat(2)} ${wallet.currentChain?.nativeToken?.symbol}`,
    };
  };

  const stats = data?.factories[0]
    ? {
        totalTrades: {
          title: "Total Trades",
          value: data.factories[0].txCount,
        },
        totalVolume: {
          title: "Total Volume",
          value: formatValue(data.factories[0].untrackedVolumeUSD).usd,
        },
        tvl: {
          title: "TVL",
          value: formatValue(poolsTVL?.toString() || "0").usd,
        },
      }
    : null;

  return {
    stats,
    loading,
    error,
  };
}
