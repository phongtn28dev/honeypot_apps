import { Button } from "@/components/button/button-next";
import { SelectState, ItemSelect } from "@/components/ItemSelect";
import TokenLogo from "@/components/TokenLogo/TokenLogo";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { cn, SelectItem } from "@nextui-org/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Input } from "@/components/input";

export const PottingModal = observer(
  ({
    pair,
    onSuccess,
    boarderLess,
  }: {
    pair: MemePairContract | FtoPairContract;
    onSuccess?: () => void;
    boarderLess?: boolean;
  }) => {
    const state = useLocalObservable(() => ({
      depositAmount: "",
      setDepositAmount(val: string) {
        this.depositAmount = val;
      },
    }));

    const selectState = useLocalObservable(
      () =>
        new SelectState({
          onSelectChange: (value) => {
            if (value === "max") {
              state.setDepositAmount(pair.raiseToken?.balance.toFixed() ?? "0");
              pair.raiseToken?.getBalance();
            } else {
              state.setDepositAmount(value.toString());
            }
          },
        })
    );

    return (
      pair.raiseToken && (
        <div
          className={cn(
            "flex flex-col w-full z-[100] items-center gap-2 bg-[#FFCD4D] rounded-2xl px-4 py-3 relative pt-4 md:pt-12 pb-[90px] text-black",
            boarderLess && "border-none"
          )}
        >
          <div className="bg-[url('/images/pumping/outline-border.png')] bg-left-top bg-contain bg-repeat-x h-4 md:h-12 absolute top-0 left-0 w-full rounded-t-2xl"></div>
          <div className="flex flex-col gap-[16px] w-full">
            <div className="bg-white custom-dashed px-[18px] py-6 w-full rounded-[16px]">
              <div className="text-black flex items-center justify-between mb-4">
                <div></div>
                <div className="flex items-center gap-x-2">
                  <div>
                    <span>Balance: </span>
                    <span>{pair.raiseToken.balance.toFormat(5)}</span>
                  </div>
                  <button
                    className="cursor-pointer text-[#63b4ff]"
                    onClick={() => {
                      state.setDepositAmount(
                        pair.raiseToken?.balance.toFixed() ?? "0"
                      );
                      pair.raiseToken?.getBalance();
                    }}
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="w-full rounded-2xl border bg-card-dark shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] flex items-center justify-between px-4 py-2.5 gap-x-2">
                <div className="flex items-center">
                  <TokenLogo token={pair.raiseToken} />
                  <span className="ml-2">{pair.raiseToken.displayName}</span>
                </div>
                <Input
                  className="flex-1 text-right !bg-transparent [&_*]:!bg-transparent data-[invalid=true]:!bg-transparent"
                  classNames={{
                    inputWrapper:
                      "!bg-transparent border-none shadow-none !transition-none data-[invalid=true]:!bg-transparent group-data-[invalid=true]:!bg-transparent",
                    input:
                      "!bg-transparent !text-[#202020] text-right text-xl !pr-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none data-[invalid=true]:!bg-transparent",
                  }}
                  value={state.depositAmount}
                  placeholder="0.0"
                  min={0}
                  type="number"
                  isClearable={false}
                  max={pair.raiseToken.balance.toFixed()}
                  onChange={(e) => {
                    state.setDepositAmount(e.target.value);
                  }}
                  onBlur={() => {
                    state.setDepositAmount(
                      Number(state.depositAmount).toString()
                    );
                  }}
                />
              </div>

              <ItemSelect
                selectState={selectState}
                className="grid grid-cols-[repeat(4,auto)] gap-4 w-full mt-4 justify-content-end"
              >
                {pair.raiseToken?.balance.gte(10) && (
                  <SelectItem key="10" value="10">
                    10 {pair.raiseToken?.symbol}
                  </SelectItem>
                )}
                {pair.raiseToken?.balance.gte(100) && (
                  <SelectItem key="100" value="100">
                    100 {pair.raiseToken?.symbol}
                  </SelectItem>
                )}
                {pair.raiseToken?.balance.gte(1000) && (
                  <SelectItem key="1000" value="1000">
                    1000 {pair.raiseToken?.symbol}
                  </SelectItem>
                )}
                <SelectItem key="max" value="max">
                  Max
                </SelectItem>
              </ItemSelect>
            </div>

            <Button
              className="w-full"
              isDisabled={!Number(state.depositAmount)}
              isLoading={pair.deposit.loading}
              onPress={async () => {
                try {
                  await pair.deposit.call({
                    amount: state.depositAmount,
                  });
                  state.setDepositAmount("");
                  pair.raiseToken?.getBalance();
                  pair.getDepositedRaisedToken().then((res) => {
                    if (
                      pair.depositedLaunchedTokenWithoutDecimals &&
                      (pair as MemePairContract).raisedTokenMinCap &&
                      pair.depositedLaunchedTokenWithoutDecimals >
                        ((pair as MemePairContract).raisedTokenMinCap ?? 0)
                    ) {
                      //refresh page
                      window.location.reload();
                    }
                  });

                  onSuccess?.();
                } catch (error) {
                  console.error("Deposit failed:", error);
                }
              }}
            >
              Deposit
            </Button>
          </div>
          <div className="bg-[url('/images/swap/bottom-border.svg')] bg-[size:100%_150%] bg-no-repeat bg-left-bottom h-[50px] absolute bottom-0 left-0 w-full"></div>
        </div>
      )
    );
  }
);

export default PottingModal;
