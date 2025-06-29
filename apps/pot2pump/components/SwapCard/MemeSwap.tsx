import { observer, useLocalObservable } from 'mobx-react-lite';
import { Button } from '@/components/button/button-next';
import { Token, useSubgraphClient } from '@honeypot/shared';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isEthAddress } from '@/lib/address';
import { wallet } from '@honeypot/shared/lib/wallet';
import { LoadingContainer } from '../LoadingDisplay/LoadingDisplay';
import { SelectState } from '../ItemSelect/v3';
import { cn } from '@nextui-org/react';
import { useInterval } from '@/lib/hooks';
import Link from 'next/link';
import { VaultAmount } from '../VaultAmount/VaultAmount';

import { ICHIVaultContract } from '@honeypot/shared';
import { MemePairContract } from '@/services/contract/launches/pot2pump/memepair-contract';
import { chart } from '@/services/chart';
import { V3SwapCard } from '../algebra/swap/V3SwapCard';
import { HoneyContainer } from '../CardContianer';

import { getSingleVaultDetails } from '@honeypot/shared';
import { DOMAIN_MAP } from 'honeypot-sdk';
import { Tab, Tabs } from '@nextui-org/react';
import { PresetPair } from '../algebra/swap/SwapPair/SwapPairV3';

export const LaunchDetailSwapCard = observer(
  ({
    inputAddress,
    outputAddress,
    extraTokenAction,
    noBoarder,
    memePairContract,
    onSwapSuccess,
    isInputNative,
    isOutputNative,
    disableFromSelection = false,
    disableToSelection = false,
  }: {
    inputAddress?: string;
    outputAddress?: string;
    extraTokenAction?: React.ReactNode;
    noBoarder?: boolean;
    memePairContract: MemePairContract;
    onSwapSuccess?: () => void;
    isInputNative?: boolean;
    isOutputNative?: boolean;
    disableFromSelection?: boolean;
    disableToSelection?: boolean;
  }) => {
    const [values, setValues] = useState<{ amount0: string; amount1: string }>({
      amount0: '0',
      amount1: '0',
    });
    const [presetPairs, setPresetPairs] = useState<PresetPair[]>([]);
    const router = useRouter();
    const isInit = wallet.isInit;
    const [vaultContract, setVaultContract] =
      useState<ICHIVaultContract | null>(null);

    const onAmountChange = (amount0: string, amount1: string) => {
      setValues({ amount0, amount1 });
    };

    const infoClient = useSubgraphClient('algebra_info');

    useEffect(() => {
      const newPresetPairs = [];
      if (inputAddress && outputAddress) {
        if (
          !presetPairs.find(
            (pair) =>
              pair.fromToken.address === inputAddress &&
              pair.toToken.address === outputAddress
          )
        ) {
          const fromToken = Token.getToken({
            address: inputAddress,
            isNative: isInputNative,
            chainId: wallet.currentChain.chainId.toString(),
          });

          const fromTokenWrapped = Token.getToken({
            address: wallet.currentChain.nativeToken.address,
            isNative: inputAddress !== wallet.currentChain.nativeToken.address,
            chainId: wallet.currentChain.chainId.toString(),
          });

          const toToken = Token.getToken({
            address: outputAddress,
            isNative: isOutputNative,
            chainId: wallet.currentChain.chainId.toString(),
          });
          newPresetPairs.push({ fromToken, toToken });
          newPresetPairs.push({ fromToken: fromTokenWrapped, toToken });
        }
      }

      if (
        !memePairContract.launchedToken?.address ||
        !wallet.currentChain.nativeToken.address
      ) {
        return;
      }

      if (
        !newPresetPairs.find(
          (pair) =>
            pair.fromToken.address.toLowerCase() ===
              wallet.currentChain.nativeToken.address.toLowerCase() ||
            pair.toToken.address.toLowerCase() ===
              wallet.currentChain.nativeToken.address.toLowerCase()
        )
      ) {
        const fromToken = Token.getToken({
          address: wallet.currentChain.nativeToken.address,
          isNative: true,
          chainId: wallet.currentChain.chainId.toString(),
        });

        const toToken = Token.getToken({
          address: memePairContract.launchedToken!.address,
          isNative: isOutputNative,
          chainId: wallet.currentChain.chainId.toString(),
        });

        newPresetPairs.push({ fromToken, toToken });
      }

      setPresetPairs(newPresetPairs);
    }, [
      inputAddress,
      outputAddress,
      memePairContract.launchedToken?.address,
      wallet.currentChain?.nativeToken?.address,
    ]);

    useEffect(() => {
      if (!wallet.isInit) {
        return;
      }

      const loadVaultContract = async () => {
        try {
          const lpTokenAddress = await memePairContract.contract.read.lpToken();
          console.log('lpTokenAddress', lpTokenAddress);
          const vaultContract = await getSingleVaultDetails(
            infoClient,
            lpTokenAddress
          );
          console.log('vaultContract', vaultContract);
          setVaultContract(vaultContract);
        } catch (error) {
          console.error('Failed to load vault contract:', error);
        }
      };
      loadVaultContract();
    }, [inputAddress, outputAddress, wallet.isInit]);

    const { inputCurrency, outputCurrency } = router.query as {
      inputCurrency: string;
      outputCurrency: string;
    };

    return (
      <div>
        <Tabs
          aria-label="Swap Options"
          classNames={{
            base: 'relative w-full',
            tabList: cn(
              'flex rounded-2xl border border-[#202020] bg-white shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020]',
              'absolute left-1/2 -translate-x-1/2 z-10 -top-5',
              'overflow-x-auto max-w-[90vw] sm:max-w-none'
            ),
            tab: 'px-5 py-1 rounded-lg whitespace-nowrap text-xs sm:text-sm sm:text-base',
            tabContent: 'group-data-[selected=true]:text-white',
            cursor:
              'bg-[#020202] border border-black shadow-[0.5px_0.5px_0px_0px_#000000] sm:shadow-[2px_2px_0px_0px_#000000]',
            panel: cn(
              'flex flex-col h-full w-full gap-y-4 justify-center items-center',
              '!mt-0 !py-0'
            ),
          }}
        >
          <Tab
            key="swap"
            title="Swap"
            className={cn(
              'relative',
              memePairContract.canClaimLP &&
                "after:absolute after:content-[''] after:w-2 after:h-2 after:bg-red-500 after:rounded-full after:-top-1 after:-right-1"
            )}
          >
            <LoadingContainer isLoading={!isInit}>
              <V3SwapCard
                presetPairs={presetPairs}
                fromTokenAddress={inputAddress}
                toTokenAddress={outputAddress}
                bordered={false}
                isInputNative={isInputNative}
                isOutputNative={isOutputNative}
                showPresetInput={true}
                showPresetOutput={false}
                onSwapSuccess={onSwapSuccess}
                disableFromSelection={disableFromSelection}
                disableToSelection={disableToSelection}
              />
            </LoadingContainer>
          </Tab>
          <Tab
            key="lp"
            title="LP"
            className={cn(
              'relative',
              memePairContract.canClaimLP &&
                "after:absolute after:content-[''] after:w-2 after:h-2 after:bg-red-500 after:rounded-full after:-top-1 after:-right-1"
            )}
          >
            <LoadingContainer isLoading={!isInit}>
              <HoneyContainer>
                {memePairContract.canClaimLP && (
                  <Button
                    className="w-full relative overflow-visible rounded-[8px] border border-black bg-[#FFCD4D] text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    isLoading={memePairContract.claimLP.loading}
                    onClick={() => {
                      memePairContract.claimLP.call();
                    }}
                    isDisabled={!memePairContract.canClaimLP}
                  >
                    Claim LP
                  </Button>
                )}
                <div className="w-full flex gap-x-2 justify-around *:flex-grow-[1]">
                  <Button
                    className="w-full rounded-[8px] border border-black bg-[#FFCD4D] text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={async () => {
                      const lpTokenAddress =
                        await memePairContract.contract.read.lpToken();
                      window.location.href = `${DOMAIN_MAP.WASABEE_DEX}/vault/${lpTokenAddress}`;
                    }}
                  >
                    Visit Vault
                  </Button>
                  <Link
                    className="w-full"
                    href={`${DOMAIN_MAP.WASABEE_DEX}/pool-detail/${vaultContract?.pool?.address}`}
                  >
                    <Button className="w-full rounded-[8px] border border-black bg-[#FFCD4D] text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed">
                      Customize Position
                    </Button>
                  </Link>
                </div>
                <div className="w-full rounded-[32px] bg-white space-y-2 px-4 py-6 custom-dashed">
                  {vaultContract && (
                    <VaultAmount
                      vaultContract={vaultContract}
                      onAmountChange={onAmountChange}
                      values={values}
                    />
                  )}
                </div>

                <Button
                  className="w-full rounded-[8px] border border-black bg-[#FFCD4D] text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                  isDisabled={!vaultContract?.isInitialized}
                  isLoading={vaultContract?.transactionPending}
                  onClick={async () => {
                    await vaultContract?.deposit(
                      BigInt(values.amount0),
                      BigInt(values.amount1),
                      wallet.account
                    );
                  }}
                >
                  {vaultContract?.transactionPending ? 'Pending...' : 'Deposit'}
                </Button>
              </HoneyContainer>
            </LoadingContainer>
          </Tab>
        </Tabs>
        {extraTokenAction}
      </div>
    );
  }
);

export const DedicatedSwapCard = observer(
  ({
    inputAddress,
    outputAddress,
    extraTokenAction,
    noBoarder,
    onSwapSuccess,
    isInputNative,
    isOutputNative,
    disableFromSelection = false,
    disableToSelection = false,
  }: {
    inputAddress?: string;
    outputAddress?: string;
    extraTokenAction?: React.ReactNode;
    noBoarder?: boolean;
    onSwapSuccess?: () => void;
    isInputNative?: boolean;
    isOutputNative?: boolean;
    disableFromSelection?: boolean;
    disableToSelection?: boolean;
  }) => {
    const [values, setValues] = useState<{ amount0: string; amount1: string }>({
      amount0: '0',
      amount1: '0',
    });
    const [presetPairs, setPresetPairs] = useState<PresetPair[]>([]);
    const router = useRouter();
    const isInit = wallet.isInit;
    // const state = useLocalObservable(() => ({
    //   selectState: new SelectState({
    //     value: 0,
    //     onSelectChange: (value) => {
    //       swap.setFromAmount(
    //         (swap.fromToken as Token).balance.times(value).toFixe`d()
    //       );
    //     },
    //   }),
    // }));
    // const [vaultContract, setVaultContract] =
    //   useState<ICHIVaultContract | null>(null);

    const onAmountChange = (amount0: string, amount1: string) => {
      setValues({ amount0, amount1 });
    };

    useEffect(() => {
      const newPresetPairs = [];
      if (inputAddress && outputAddress) {
        if (
          !presetPairs.find(
            (pair) =>
              pair.fromToken.address === inputAddress &&
              pair.toToken.address === outputAddress
          )
        ) {
          const fromToken = Token.getToken({
            address: inputAddress,
            isNative: true,
            chainId: wallet.currentChain.chainId.toString(),
          });

          const fromTokenWrapped = Token.getToken({
            address: inputAddress,
            isNative: false,
            chainId: wallet.currentChain.chainId.toString(),
          });

          const toToken = Token.getToken({
            address: outputAddress,
            isNative: isOutputNative,
            chainId: wallet.currentChain.chainId.toString(),
          });
          newPresetPairs.push({ fromToken, toToken });
          newPresetPairs.push({ fromToken: fromTokenWrapped, toToken });
        }
      }

      if (
        !newPresetPairs.find(
          (pair) =>
            pair.fromToken.address.toLowerCase() ===
              wallet.currentChain.nativeToken.address.toLowerCase() ||
            pair.toToken.address.toLowerCase() ===
              wallet.currentChain.nativeToken.address.toLowerCase()
        )
      ) {
        const fromToken = Token.getToken({
          address: wallet.currentChain.nativeToken.address,
          isNative: true,
          chainId: wallet.currentChain.chainId.toString(),
        });

        const toToken = Token.getToken({
          address: outputAddress!,
          isNative: isOutputNative,
          chainId: wallet.currentChain.chainId.toString(),
        });

        newPresetPairs.push({ fromToken, toToken });
      }

      setPresetPairs(newPresetPairs);
    }, [
      inputAddress,
      outputAddress,
      wallet.currentChain?.nativeToken?.address,
    ]);

    const { inputCurrency, outputCurrency } = router.query as {
      inputCurrency: string;
      outputCurrency: string;
    };

    return (
      <div>
        <Tabs
          aria-label="Swap Options"
          classNames={{
            base: 'relative w-full',
            tabList: cn(
              'flex rounded-2xl border border-[#202020] bg-white shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020]',
              'absolute left-1/2 -translate-x-1/2 z-10 -top-5',
              'overflow-x-auto max-w-[90vw] sm:max-w-none'
            ),
            tab: 'px-5 py-1 rounded-lg whitespace-nowrap text-xs sm:text-sm sm:text-base',
            tabContent: 'group-data-[selected=true]:text-white',
            cursor:
              'bg-[#020202] border border-black shadow-[0.5px_0.5px_0px_0px_#000000] sm:shadow-[2px_2px_0px_0px_#000000]',
            panel: cn(
              'flex flex-col h-full w-full gap-y-4 justify-center items-center',
              '!mt-0 !py-0'
            ),
          }}
        >
          <Tab key="swap" title="Swap" className={cn('relative')}>
            <LoadingContainer isLoading={!isInit}>
              <V3SwapCard
                presetPairs={presetPairs}
                fromTokenAddress={inputAddress}
                toTokenAddress={outputAddress}
                bordered={false}
                isInputNative={isInputNative}
                isOutputNative={isOutputNative}
                showPresetInput={true}
                showPresetOutput={false}
                onSwapSuccess={onSwapSuccess}
                disableFromSelection={disableFromSelection}
                disableToSelection={disableToSelection}
              />
            </LoadingContainer>
          </Tab>
          {/* <Tab
            key="lp"
            title="LP"
            className={cn(
              "relative",
              memePairContract.canClaimLP &&
                "after:absolute after:content-[''] after:w-2 after:h-2 after:bg-red-500 after:rounded-full after:-top-1 after:-right-1"
            )}
          >
            <LoadingContainer isLoading={!isInit}>
              <HoneyContainer>
                {memePairContract.canClaimLP && (
                  <Button
                    className="w-full relative overflow-visible rounded-[8px] border border-black bg-[#FFCD4D] text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    isLoading={memePairContract.claimLP.loading}
                    onClick={() => {
                      memePairContract.claimLP.call();
                    }}
                    isDisabled={!memePairContract.canClaimLP}
                  >
                    Claim LP
                  </Button>
                )}
                <div className="w-full flex gap-x-2 justify-around *:flex-grow-[1]">
                  <Button
                    className="w-full rounded-[8px] border border-black bg-[#FFCD4D] text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={async () => {
                      const lpTokenAddress =
                        await memePairContract.contract.read.lpToken();
                      window.location.href = `${DOMAIN_MAP.WASABEE_DEX}/vault/${lpTokenAddress}`;
                    }}
                  >
                    Visit Vault
                  </Button>
                  <Link
                    className="w-full"
                    href={`${DOMAIN_MAP.WASABEE_DEX}/pool-detail/${vaultContract?.pool?.address}`}
                  >
                    <Button className="w-full rounded-[8px] border border-black bg-[#FFCD4D] text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed">
                      Customize Position
                    </Button>
                  </Link>
                </div>
                <div className="w-full rounded-[32px] bg-white space-y-2 px-4 py-6 custom-dashed">
                  {vaultContract && (
                    <VaultAmount
                      vaultContract={vaultContract}
                      onAmountChange={onAmountChange}
                      values={values}
                    />
                  )}
                </div>

                <Button
                  className="w-full rounded-[8px] border border-black bg-[#FFCD4D] text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                  isDisabled={!vaultContract?.isInitialized}
                  isLoading={vaultContract?.transactionPending}
                  onClick={async () => {
                    await vaultContract?.deposit(
                      BigInt(values.amount0),
                      BigInt(values.amount1),
                      wallet.account
                    );
                  }}
                >
                  {vaultContract?.transactionPending ? "Pending..." : "Deposit"}
                </Button>
              </HoneyContainer>
            </LoadingContainer>
          </Tab> */}
        </Tabs>
        {extraTokenAction}
      </div>
    );
  }
);
