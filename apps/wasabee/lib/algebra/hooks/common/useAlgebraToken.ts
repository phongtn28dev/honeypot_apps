import { useMemo } from 'react';
import { useToken } from 'wagmi';
import { Address } from 'viem';
import { Token } from '@cryptoalgebra/sdk';
import { ExtendedNative } from '@cryptoalgebra/sdk';
import { ADDRESS_ZERO } from '@cryptoalgebra/sdk';
import { wallet } from '@honeypot/shared';
import { useObserver } from 'mobx-react-lite';

export function useAlgebraToken(address: Address | undefined) {
  const isETH = address === ADDRESS_ZERO;
  const { currentChainId, currentChain } = useObserver(() => {
    return {
      currentChainId: wallet.currentChainId,
      currentChain: wallet.currentChain,
    };
  });

  const { data: tokenData, isLoading } = useToken({
    address: isETH ? undefined : address,
    chainId: currentChainId,
  });

  return useMemo(() => {
    if (!address) return;

    if (address === ADDRESS_ZERO)
      return ExtendedNative.onChain(
        currentChainId,
        currentChain.nativeToken.symbol,
        currentChain.nativeToken.name
      );

    if (isLoading || !tokenData) return undefined;

    const { symbol, name, decimals } = tokenData;

    return new Token(currentChainId, address, decimals, symbol, name);
  }, [address, tokenData, isLoading]);
}
