import { Network, networks } from '../chains/chain';
import BigNumber from 'bignumber.js';
import { Address, PublicClient, WalletClient, zeroAddress } from 'viem';
import { FtoFactoryContract } from '../contract/launches/fto/ftofactory-contract';
import { FtoFacadeContract } from '../contract/launches/fto/ftofacade-contract';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { createPublicClientByChain } from './client';
import { StorageState } from '../utils/utils';
import { MemeFactoryContract } from '../contract/launches/pot2pump/memefactory-contract';
import { MEMEFacadeContract } from '../contract/launches/pot2pump/memefacade-contract';
import { ICHIVaultFactoryContract } from '../contract/aquabera/ICHIVaultFactory-contract';
import { DEFAULT_CHAIN_ID } from '../../config/algebra/default-chain-id';
import { ICHIVaultVolatilityCheckContract } from '../contract/aquabera/ICHIVaultVolatilityCheckContract';
import { AlgebraSwapRouterContract } from '../contract/algebra/algebra-swap-router';
import {
  UniversalAccount,
  IAssetsResponse,
  ISmartAccountOptions,
} from '@GDdark/universal-account';

export class Wallet {
  account: string = '';
  accountShort = '';
  networks: Network[] = [];
  balance: BigNumber = new BigNumber(0);
  walletClient!: WalletClient;
  currentChainId: number = DEFAULT_CHAIN_ID;
  contracts: {
    ftofactory: FtoFactoryContract;
    ftofacade: FtoFacadeContract;
    memeFactory: MemeFactoryContract;
    memeFacade: MEMEFacadeContract;
    vaultFactory: ICHIVaultFactoryContract;
    vaultVolatilityCheck: ICHIVaultVolatilityCheckContract;
    algebraSwapRouter: AlgebraSwapRouterContract;
  } = {} as any;
  publicClient!: PublicClient;
  isInit = false;
  get networksMap() {
    return this.networks.reduce((acc, network) => {
      acc[network.chainId] = network;
      return acc;
    }, {} as Record<number, Network>);
  }
  //universal account
  universalAccount: undefined | UniversalAccount;
  universalAccountAssetValueUSD: IAssetsResponse | undefined;
  universalAccountInfo: ISmartAccountOptions | undefined;

  get currentChain() {
    return this.networksMap[this.currentChainId];
  }

  constructor(args: Partial<Wallet>) {
    makeAutoObservable(this);
    reaction(
      () => this.walletClient?.account,
      () => {
        this.initWallet(this.walletClient);
      }
    );
    reaction(
      () => this.walletClient?.chain,
      () => {
        this.initWallet(this.walletClient);
      }
    );
  }

  changeChain(chainId: number) {
    this.currentChainId = chainId;
    this.walletClient.switchChain({
      id: chainId,
    });
    this.initWallet(this.walletClient);
  }

  async initWallet(walletClient?: WalletClient) {
    console.log('initWallet');
    this.networks = networks;
    this.currentChainId = walletClient?.chain?.id || DEFAULT_CHAIN_ID;
    const mockAccount = localStorage.getItem('mockAccount');
    this.account = mockAccount || walletClient?.account?.address || zeroAddress;
    this.contracts = {
      algebraSwapRouter: new AlgebraSwapRouterContract({
        address: this.currentChain.contracts.algebraSwapRouter as `0x${string}`,
      }),
      ftofactory: new FtoFactoryContract({
        address: this.currentChain.contracts.ftoFactory,
      }),
      ftofacade: new FtoFacadeContract({
        address: this.currentChain.contracts.ftoFacade,
      }),
      memeFactory: new MemeFactoryContract({
        address: this.currentChain.contracts.memeFactory,
      }),
      memeFacade: new MEMEFacadeContract({
        address: this.currentChain.contracts.memeFacade,
      }),
      vaultFactory: new ICHIVaultFactoryContract({
        address: this.currentChain.contracts.vaultFactory as Address,
      }),
      vaultVolatilityCheck: new ICHIVaultVolatilityCheckContract({
        address: this.currentChain.contracts.vaultVolatilityCheck as Address,
      }),
    };
    this.publicClient = createPublicClientByChain(
      this.currentChain.chain
    ) as any;
    if (walletClient) {
      this.walletClient = walletClient;
      walletClient.switchChain({
        id: this.currentChainId,
      });
    }
    this.currentChain.init();
    await StorageState.sync();

    if (this.account && this.account !== zeroAddress) {
      this.universalAccount = new UniversalAccount({
        projectId: 'bc651b6d-e34f-44f5-b661-32369a8494bd',
        ownerAddress: this.account,
        tradeConfig: {
          // If this is not set, it will use auto slippage
          slippageBps: 100, // 100 means 1%, max is 10000
          // Use $PARTI to pay for fees
          // Otherwise, the SDK will use the primary tokens (e.g. USDC, ETH)
          // universalGas: true,
        },
      });
      await this.loadUniversalAccountInfo();
    } else {
      this.universalAccount = undefined;
      this.universalAccountInfo = undefined;
      this.universalAccountAssetValueUSD = undefined;
    }

    console.log('universalAccount', this.universalAccount);

    runInAction(() => {
      this.isInit = true;
    });
  }

  async loadUniversalAccountInfo() {
    if (this.universalAccount) {
      this.universalAccountAssetValueUSD =
        await this.universalAccount.getPrimaryAssets();
      this.universalAccountInfo =
        await this.universalAccount.getSmartAccountOptions();
    }
  }
}

export const wallet = new Wallet({});
