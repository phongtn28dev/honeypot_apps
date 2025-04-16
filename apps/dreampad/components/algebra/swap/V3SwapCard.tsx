import SwapPairV3 from "./SwapPair/SwapPairV3";
import SwapButtonV3 from "./SwapButton/SwapButotnV3";
import SwapParamsV3 from "./SwapParams/SwapParamsV3";
import CardContainer from "../../CardContianer/v3";
import PoweredByAlgebra from "../common/PoweredByAlgebra";

interface V3SwapCardProps {
  fromTokenAddress?: string;
  toTokenAddress?: string;
  disableSelection?: boolean;
  bordered?: boolean;
  borderHeight?: string;
  onSwapSuccess?: () => void;
  isUpdatingPriceChart?: boolean;
}

export function V3SwapCard({
  fromTokenAddress,
  toTokenAddress,
  disableSelection,
  bordered = true,
  isUpdatingPriceChart = false,
}: V3SwapCardProps) {
  return (
    <CardContainer>
      <SwapPairV3
        fromTokenAddress={fromTokenAddress}
        toTokenAddress={toTokenAddress}
        disableSelection={disableSelection}
        isUpdatingPriceChart={isUpdatingPriceChart}
      />
      <SwapParamsV3 />
      <SwapButtonV3 />
      <PoweredByAlgebra />
    </CardContainer>
  );
}

export default V3SwapCard;
