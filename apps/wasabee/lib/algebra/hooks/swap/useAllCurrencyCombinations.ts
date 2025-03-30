import { wallet } from '@/services/wallet';
import { Currency, Token } from '@cryptoalgebra/sdk';
import { useObserver } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useChainId } from 'wagmi';

export function useAllCurrencyCombinations(
  currencyA?: Currency,
  currencyB?: Currency
): [Token, Token][] {
  const chainId = useChainId();
  const { currentChain } = useObserver(() => {
    return {
      currentChain: wallet.currentChain,
    };
  });

  const [tokenA, tokenB] = chainId
    ? [currencyA?.wrapped, currencyB?.wrapped]
    : [undefined, undefined];

  const bases: Token[] = useMemo(() => {
    if (!chainId) return [];

    return (
      currentChain.validatedTokens.map(
        (token) =>
          new Token(
            chainId,
            token.address,
            token.decimals,
            token.symbol,
            token.name
          ).wrapped
      ) ?? []
    );
  }, [chainId, currentChain]);

  const basePairs: [Token, Token][] = useMemo(
    () =>
      bases
        .flatMap((base): [Token, Token][] =>
          bases.map((otherBase) => [base, otherBase])
        )
        .filter(([t0, t1]) => !t0.equals(t1)),
    [bases]
  );

  return useMemo(
    () =>
      tokenA && tokenB
        ? [
            [tokenA, tokenB] as [Token, Token],
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            ...basePairs,
          ]
            .filter(([t0, t1]) => !t0.equals(t1))
            .filter(([t0, t1], i, otherPairs) => {
              const firstIndexInOtherPairs = otherPairs.findIndex(
                ([t0Other, t1Other]) => {
                  return (
                    (t0.equals(t0Other) && t1.equals(t1Other)) ||
                    (t0.equals(t1Other) && t1.equals(t0Other))
                  );
                }
              );
              return firstIndexInOtherPairs === i;
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  );
}
