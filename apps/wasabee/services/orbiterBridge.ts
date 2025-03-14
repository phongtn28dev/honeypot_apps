import {
  OrbiterClient,
  ENDPOINT,
  Token,
  TradePair,
} from '@orbiter-finance/bridge-sdk';

const orbiter = await OrbiterClient.create({
  apiEndpoint: ENDPOINT.MAINNET,
  apiKey: 'xxxxxx', //optional
  channelId: 'xxxxxx', //optional
});

export class OrbiterBridge {
  constructor() {}

  getAvailableTokens(chainId: string) {
    const tradePair: TradePair[] = orbiter.getAvailableTradePairs(chainId);
    return tradePair;
  }
}
