import { Address } from 'viem';
import { Currency, ExtendedNative, Token } from '@cryptoalgebra/sdk';
import { ADDRESS_ZERO } from '@cryptoalgebra/sdk';
import { useAlgebraToken } from './useAlgebraToken';
import { wallet } from '@honeypot/shared';
import { useObserver } from 'mobx-react-lite';

export function useCurrency(
  address: Address | undefined,
  withNative?: boolean
): Currency | ExtendedNative | undefined {
  const { currentChainId, currentChain } = useObserver(() => {
    return {
      currentChainId: wallet.currentChainId,
      currentChain: wallet.currentChain,
    };
  });
  const isWNative =
    address?.toLowerCase() === currentChain.nativeToken.address.toLowerCase();

  const isNative = address === ADDRESS_ZERO;

  const token = useAlgebraToken(isNative || isWNative ? ADDRESS_ZERO : address);

  const extendedEther = ExtendedNative.onChain(
    currentChainId,
    currentChain.nativeToken.symbol,
    currentChain.nativeToken.name
  );

  if (withNative) return isNative || isWNative ? extendedEther : token;
  if (isWNative) return extendedEther.wrapped;
  return isNative ? extendedEther : token;
}
