import { useEffect, useMemo } from "react";
import { Currency } from "@cryptoalgebra/sdk";
import { Button } from "@/components/algebra/ui/button";
import {
  IDerivedMintInfo,
  Presets,
  useMintState,
  useMintActionHandlers,
} from "@/lib/algebra/state/mintStore";
import { PresetProfits, PresetsArgs } from "@/types/algebra/types/presets";
import { maxInt256 } from "viem";
import { cn } from "@/lib/utils";

interface RangeSidebarProps {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  mintInfo: IDerivedMintInfo;
}

const stablecoinsPreset = [
  {
    type: Presets.STABLE,
    title: `Stablecoins`,
    min: 0.984,
    max: 1.01,
    risk: PresetProfits.VERY_LOW,
    profit: PresetProfits.HIGH,
  },
];

const commonPresets = [
  {
    type: Presets.RISK,
    title: `Narrow`,
    min: 0.95,
    max: 1.1,
    risk: PresetProfits.HIGH,
    profit: PresetProfits.HIGH,
  },
  {
    type: Presets.NORMAL,
    title: `Common`,
    min: 0.9,
    max: 1.2,
    risk: PresetProfits.MEDIUM,
    profit: PresetProfits.MEDIUM,
  },
  {
    type: Presets.SAFE,
    title: `Wide`,
    min: 0.8,
    max: 1.4,
    risk: PresetProfits.LOW,
    profit: PresetProfits.LOW,
  },
  {
    type: Presets.FULL,
    title: `Full`,
    min: 0,
    max: Infinity,
    risk: PresetProfits.VERY_LOW,
    profit: PresetProfits.VERY_LOW,
  },
];

const PresetTabs = ({ currencyA, currencyB, mintInfo }: RangeSidebarProps) => {
  const {
    preset,
    actions: { updateSelectedPreset, setFullRange },
  } = useMintState();

  const { onLeftRangeInput, onRightRangeInput } = useMintActionHandlers(
    mintInfo.noLiquidity
  );

  const isStablecoinPair = useMemo(() => {
    if (!currencyA || !currencyB) return false;

    // const stablecoins = [USDC.address, USDT.address, DAI.address];
    const stablecoins = ["", ""];

    return (
      stablecoins.includes(currencyA.wrapped.address.toLowerCase()) &&
      stablecoins.includes(currencyB.wrapped.address.toLowerCase())
    );
  }, [currencyA, currencyB]);

  const price = useMemo(() => {
    if (!mintInfo.price) return;

    return mintInfo.invertPrice
      ? mintInfo.price.invert().toSignificant(5)
      : mintInfo.price.toSignificant(5);
  }, [mintInfo]);

  function handlePresetRangeSelection(preset: any | null) {
    if (!price) return;

    updateSelectedPreset(preset ? preset.type : null);

    if (preset && preset.type === Presets.FULL.toString()) {
      setFullRange();
    } else {
      onLeftRangeInput(preset ? String(+price * preset.min) : "");
      onRightRangeInput(preset ? String(+price * preset.max) : "");
    }
  }

  const presets = isStablecoinPair ? stablecoinsPreset : commonPresets;

  function onPresetSelect(range: PresetsArgs) {
    if (preset == range.type) {
      handlePresetRangeSelection(null);
    } else {
      handlePresetRangeSelection(range);
    }
  }

  useEffect(() => {
    setFullRange();
  }, []);

  return (
    <div className="flex rounded-2xl border border-[#202020] bg-white p-4 shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020] py-2 px-3.5">
      {presets.map((range) => (
        <button
          key={`preset-range-${range.title}`}
          onClick={() => onPresetSelect({ ...range, type: range.type.toString() })}
          className={cn(
            "flex-1 px-3 py-1.5 text-sm font-medium transition-all rounded-lg text-center",
            preset === range.type.toString()
              ? "bg-[#202020] text-white"
              : "text-[#202020] hover:bg-[#20202010]"
          )}
        >
          {range.title}
        </button>
      ))}
    </div>
  );
};

export default PresetTabs;
