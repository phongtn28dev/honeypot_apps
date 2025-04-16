import { Token } from '@honeypot/shared';
import { networksMap } from '@/services/network';
import { PairContract } from '@/services/contract/dex/liquidity/pair-contract';

export const tokenToSymbol = (token: Token) => {
  return token.symbol;
};

export const tokenToAddress = (token: Token) => {
  return token.address;
};

export const tokenToTicker = (token: Token, chainId: number) => {
  return (
    token.name +
    ':' +
    networksMap[chainId as number].chain.id +
    ':' +
    token.address
  );
};

export const strParams = (
  token: Token,
  chainId: number,
  tokenNumber: number,
  currencyCode: string,
  totalSupply = '1',
  quoteMetric?: 'PRICE' | 'MCAP'
) => {
  return (
    token.name +
    ':' +
    networksMap[chainId as number].chain.id +
    ':' +
    token.address +
    ':' +
    tokenNumber +
    ':' +
    currencyCode +
    ':' +
    totalSupply +
    ':' +
    (quoteMetric || 'PRICE')
  );
};

export const pairToTicker = (pair: PairContract, chainId: number) => {
  return (
    pair.token0.name +
    '/' +
    pair.token1.name +
    ':' +
    networksMap[chainId].chain.id +
    ':' +
    pair.address
  );
};

export const tickerToToken = (ticker: string) => {
  const [name, chainId, address] = ticker.split(':');
  return new Token({
    name,
    address,
  });
};

export const ParseTicker = (
  ticker: Token | PairContract | null,
  chainId: number
) => {
  if (ticker instanceof Token) {
    return tokenToTicker(ticker, chainId);
  } else if (ticker instanceof PairContract) {
    return pairToTicker(ticker, chainId);
  } else {
    return 'None';
  }
};
