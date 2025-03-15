import {
  OrbiterClient,
  ENDPOINT,
  Token as OrbiterToken,
  TradePair,
  Router,
  TransactionParams,
} from '@orbiter-finance/bridge-sdk';
import { Token } from '@/services/contract/token';
import { action, makeAutoObservable, reaction } from 'mobx';
import { wallet } from './wallet';
import BigNumber from 'bignumber.js';
import { clientToProvider } from '@/hooks/useEthersProvider';
import { Client } from 'viem';
import { ContractWrite } from './utils';
import { OrbiterRouterV3 } from './contract/orbiter/OrbiterRouterV3';
import { simulateContract } from 'viem/actions';

const orbiter = await OrbiterClient.create({
  apiEndpoint: ENDPOINT.MAINNET,
  apiKey: 'xxxxxx', //optional
  channelId: 'xxxxxx', //optional
});

export class OrbiterBridge {
  selectedToken: Token | null = null;
  fromChainId: string | null = null;
  toChainId: string | null = null;
  fromAmount: string = '';
  tradePairs: TradePair[] = [];
  router: Router | null = null;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.fromChainId,
      () => {
        this.updateAvailableTradePairs();
        this.updateRouter();
      }
    );
    reaction(
      () => this.selectedToken,
      () => {
        this.updateAvailableTradePairs();
        this.updateRouter();
      }
    );
    reaction(
      () => this.toChainId,
      () => {
        this.updateRouter();
      }
    );
  }

  get toAmount() {
    if (!this.router || !this.fromAmount) {
      return '0';
    }

    try {
      const amount = this.router.simulationAmount(this.fromAmount);
      return amount.receiveAmount;
    } catch (error) {
      console.error(error);
      return '0';
    }
  }

  updateRouter() {
    if (!this.fromChainId || !this.toChainId || !this.selectedToken) {
      console.log('no fromChainId or toChainId or selectedToken');
      return;
    }

    const tradePair = this.tradePairs
      .filter((pair) => pair.srcChainId === this.fromChainId)
      .filter((pair) => pair.dstChainId === this.toChainId)
      .filter((pair) => pair.dstTokenSymbol === this.selectedToken?.symbol)
      .filter((pair) => pair.srcTokenSymbol === this.selectedToken?.symbol)
      .find(
        (pair) =>
          pair.srcChainId === this.fromChainId &&
          pair.dstChainId === this.toChainId
      );

    console.log(tradePair);

    if (!tradePair) {
      return;
    }

    this.router = orbiter.createRouter(tradePair);

    console.log(this.router);
  }

  getAvailableTokens(chainId: string): Token[] {
    const tokens: OrbiterToken[] = orbiter.getAvailableTokens(chainId);

    return tokens.map((token) => {
      return new Token({
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
        isNative: token.isNative,
      });
    });
  }

  async bridge() {
    if (
      !this.router ||
      !this.fromAmount ||
      !this.selectedToken ||
      !this.toChainId ||
      !this.fromChainId ||
      this.toAmount === '0'
    ) {
      return;
    }

    try {
      const routerAddress = this.router.routerConfig.endpointContract;
      const orbiterRouterV3 = new OrbiterRouterV3({
        address: routerAddress as `0x${string}`,
      });

      const transaction = await this.router.createTransaction(
        wallet.account,
        'receiver',
        this.fromAmount
      );

      if (!this.selectedToken.isNative) {
        const fromToken = Token.getToken({
          address: this.selectedToken.address,
        });

        await fromToken.approveIfNoAllowance({
          amount: BigInt(
            BigNumber(this.fromAmount)
              .times(10 ** fromToken.decimals)
              .toString()
          ).toString(),
          spender: orbiterRouterV3.address,
        });

        const sim = await simulateContract(wallet.walletClient, {
          address: orbiterRouterV3.address as `0x${string}`,
          account: wallet.account as `0x${string}`,
          chain: wallet.currentChain.chain,
          abi: orbiterRouterV3.abi,
          functionName: 'transferToken',
          args: [
            fromToken.address as `0x${string}`,
            this.router.makerAddress as `0x${string}`,
            BigInt(transaction.value),
            // @ts-ignore
            transaction.raw.data,
          ],
        });

        await new ContractWrite(
          orbiterRouterV3.contract.write.transferToken
        ).call({
          // @ts-ignore
          value: BigInt(transaction.raw.value),
          account: wallet.account as `0x${string}`,
          chain: wallet.currentChain.chain,
          args: [
            fromToken.address,
            this.router.makerAddress,
            transaction.value,
            // @ts-ignore
            transaction.raw.data,
          ],
        });
      } else {
        await new ContractWrite(orbiterRouterV3.contract.write.transfer).call({
          // @ts-ignore
          value: BigInt(transaction.raw.value),
          account: wallet.account as `0x${string}`,
          chain: wallet.currentChain.chain,
          args: [
            this.router.makerAddress,
            // @ts-ignore
            transaction.raw.data,
          ],
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  updateAvailableTradePairs() {
    if (!this.fromChainId || !this.selectedToken) {
      return;
    }

    this.tradePairs = orbiter
      .getAvailableTradePairs(this.fromChainId, this.selectedToken?.symbol)
      .filter((pair) => pair.srcChainId === this.fromChainId);
  }

  setSelectedToken(token: Token) {
    this.selectedToken = token;
  }

  setFromChainId(chainId: string) {
    this.fromChainId = chainId;
  }

  setToChainId(chainId: string) {
    this.toChainId = chainId;
  }

  setFromAmount(amount: string) {
    this.fromAmount = amount;
  }
}

export const orbiterBridgeService = new OrbiterBridge();
