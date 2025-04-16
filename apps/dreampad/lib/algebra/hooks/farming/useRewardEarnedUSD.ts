import { useMemo } from "react";
import { formatUnits } from "viem";
import {
  TokenFieldsFragment,
  useNativePriceQuery,
} from "../../graphql/generated/graphql";

export function useRewardEarnedUSD({
  token,
  reward,
}: {
  token: TokenFieldsFragment | null | undefined;
  reward: bigint;
}): number {
  const { data: nativePrice } = useNativePriceQuery();

  return useMemo(() => {
    if (!token || !nativePrice) return 0;

    const formattedRewardEarned = Number(
      formatUnits(reward, Number(token.decimals))
    );

    const rewardUSD =
      token.derivedMatic *
      formattedRewardEarned *
      nativePrice.bundles[0].maticPriceUSD;

    return rewardUSD;
  }, [nativePrice, token, reward]);
}
