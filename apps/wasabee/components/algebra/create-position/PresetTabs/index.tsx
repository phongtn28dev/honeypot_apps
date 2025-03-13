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
    <div className="flex rounded-2xl border border-[#202020] bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] py-2 px-3.5 gap-x-1">
      {presets.map((range) => (
        <button
          key={`preset-range-${range.title}`}
          onClick={() =>
            onPresetSelect({ ...range, type: range.type.toString() })
          }
          className={cn(
            "flex-1 px-4 py-1.5 transition-all rounded-lg text-center text-sm font-gliker w-[90px]",
            preset === range.type.toString()
              ? "bg-[rgba(255,205,77,1)] text-[rgba(32,32,32,1)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              : "text-[rgba(77,77,77,1)] hover:bg-[rgba(255,205,77,0.5)]"
          )}
        >
          {range.title}
        </button>
      ))}
    </div>
  );
};

export default PresetTabs;
