import V3SwapCard from '@/components/algebra/swap/V3SwapCard';
import V3SwapCardIndependent from '@/components/algebra/swap/V3SwapCardIndependent';
import XSwapCard from '@/components/algebra/swap/xSwapCard';
import { HoneyContainer } from '@/components/CardContianer';
import { LoadingDisplay } from '@/components/LoadingDisplay/LoadingDisplay';
import { ALGEBRA_ROUTER } from '@/config/algebra/addresses';
import { STABLECOINS } from '@/config/algebra/tokens';
import { algebraRouterABI } from '@/lib/abis/algebra-contracts/ABIs';
import { Multicall3ABI } from '@/lib/abis/Multicall3';
import { SuccessfulCall } from '@/lib/algebra/hooks/swap/useSwapCallback';
import { SwapCallEstimate } from '@/lib/algebra/hooks/swap/useSwapCallback';
import { DynamicFormatAmount } from '@/lib/algebra/utils/common/formatAmount';
import { Token } from '@/services/contract/token';
import { ContractWrite } from '@/services/utils';
import { wallet } from '@/services/wallet';
import { xSwap } from '@/services/xswap';
import { Trade } from '@cryptoalgebra/sdk';
import { Button } from '@nextui-org/react';
import BigNumber from 'bignumber.js';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { zeroAddress } from 'viem';

const XSwapPage = observer(() => {
  const [xSwapTokens, setXSwapTokens] = useState<Token[] | undefined>(
    undefined
  );

  useEffect(() => {
    console.log(xSwapTokens);
  }, [xSwapTokens, ...(xSwapTokens?.map((token) => token.balance) || [])]);

  useEffect(() => {
    if (!wallet.isInit) {
      return;
    }
    setXSwapTokens(wallet.currentChain?.validatedTokens || []);
  }, [wallet.currentChain, wallet.isInit]);

  const sortedTokens = useMemo(() => {
    return xSwapTokens
      ?.filter((token) => token.balance.gt(0))
      ?.sort((a, b) => b.balance.toNumber() - a.balance.toNumber())
      .slice();
  }, [xSwapTokens, ...(xSwapTokens?.map((token) => token.balance) || [])]);

  if (!wallet.isInit) {
    return <LoadingDisplay />;
  }

  return (
    <div className="w-full px-4 py-4 flex gap-4 justify-start items-start ">
      <HoneyContainer className="w-full max-w-[1240px] mx-auto">
        <div className="md:grid hidden w-full  grid-cols-12  bg-white p-2 rounded-lg items-center justify-center text-center">
          <div className="col-span-1">
            <Button onPress={() => xSwap.selectAllTokens()}>Select All</Button>
          </div>
          <div className="col-span-2">Asset</div>

          <div className="col-span-1">Input</div>
          <div className="col-span-3">
            <Button
              className="w-full bg-black text-white"
              onPress={() => xSwap.maxAllTokens()}
            >
              Max All
            </Button>
          </div>

          <div className="col-span-5">OutPut</div>
        </div>
        <div className="w-full flex flex-col gap-4  max-h-[70vh]  overflow-y-auto">
          {sortedTokens?.map((token, idx) => (
            <XSwapCard
              key={token.address}
              disableFromSelection={true}
              staticToTokenList={[
                wallet.currentChain.nativeToken,
                Token.getToken({
                  address: '0x6969696969696969696969696969696969696969',
                }),
                Token.getToken({
                  address: '0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce',
                }),
              ]}
              fromToken={token}
              toToken={
                token.address !== wallet.currentChain.nativeToken.address
                  ? wallet.currentChain.nativeToken
                  : Token.getToken({
                      address: '0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce',
                    })
              }
            />
          ))}
        </div>
        <div className="w-full flex gap-4 justify-end items-center">
          <div className="w-full col-span-1">
            <span className="text-sm">
              Total Amount In:
              {DynamicFormatAmount({
                amount: xSwap.totalAmountIn,
                decimals: 4,
                endWith: '$',
              })}
            </span>
          </div>
          <div className="w-full col-span-1">
            <span className="text-sm">Total Amount Out:</span>
            {DynamicFormatAmount({
              amount: xSwap.totalAmountOut,
              decimals: 4,
              endWith: '$',
            })}
          </div>{' '}
          {xSwap.needsApproval ? (
            <Button
              onPress={() => {
                xSwap.approveAllTokens();
              }}
              className="w-full"
            >
              Approve All
            </Button>
          ) : (
            <Button
              isDisabled={Number(xSwap.totalAmountIn) === 0}
              onPress={() => {
                xSwap.handleSwap();
              }}
              className="w-full"
            >
              Swap
            </Button>
          )}
        </div>
      </HoneyContainer>
    </div>
  );
});

export default XSwapPage;
