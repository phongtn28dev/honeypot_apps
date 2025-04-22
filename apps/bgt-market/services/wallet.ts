import { Network, networks } from './network';
import BigNumber from 'bignumber.js';
import { Address, PublicClient, WalletClient } from 'viem';
import { RouterV2Contract } from './contract/dex/routerv2-contract';
import { FactoryContract } from './contract/dex/factory-contract';
import { FtoFactoryContract } from './contract/launches/fto/ftofactory-contract';
import { FtoFacadeContract } from './contract/launches/fto/ftofacade-contract';
import { makeAutoObservable, reaction } from 'mobx';
import { createPublicClientByChain } from '@/lib/client';
import { StorageState } from '@honeypot/shared';
import { MemeFactoryContract } from '@/services/contract/launches/pot2pump/memefactory-contract';
import { MEMEFacadeContract } from '@/services/contract/launches/pot2pump/memefacade-contract';

import { ICHIVaultContract } from '@honeypot/shared';
import { BGTMarketContract } from './contract/bgt-market/bgt-market';
import { DEFAULT_CHAIN_ID } from '@/config/algebra/default-chain-id';
import { HeyBgtContract } from './contract/bgt-market/hey-bgt';

export class Wallet {
  account: string = '';
  accountShort = '';
  networks: Network[] = networks;
  balance: BigNumber = new BigNumber(0);
  walletClient!: WalletClient;
  currentChainId: number = DEFAULT_CHAIN_ID;
  contracts: {
    routerV2: RouterV2Contract;
    factory: FactoryContract;
    ftofactory: FtoFactoryContract;
    ftofacade: FtoFacadeContract;
    memeFactory: MemeFactoryContract;
    memeFacade: MEMEFacadeContract;
    vaultFactory: ICHIVaultFactoryContract;
    bgtMarket: BGTMarketContract;
    heyBgt: HeyBgtContract;
  } = {} as any;
  publicClient: PublicClient = createPublicClientByChain(
    this.currentChain.chain
  );
  isInit = false;
  get networksMap() {
    return this.networks.reduce((acc, network) => {
      acc[network.chainId] = network;
      return acc;
    }, {} as Record<number, Network>);
  }

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

  async initWallet(walletClient: WalletClient) {
    this.networks = networks;
    if (
      !walletClient.chain?.id ||
      !this.networksMap[walletClient.chain.id] ||
      !walletClient.account?.address ||
      !this.networksMap[walletClient.chain.id].isActive
    ) {
      return;
    }
    this.currentChainId = walletClient.chain.id;
    const mockAccount = localStorage.getItem('mockAccount');
    this.account = mockAccount || walletClient.account.address;
    this.contracts = {
      routerV2: new RouterV2Contract({
        address: this.currentChain.contracts.routerV2,
      }),
      factory: new FactoryContract({
        address: this.currentChain.contracts.factory,
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
      bgtMarket: new BGTMarketContract({
        address: this.currentChain.contracts.bgtMarket as Address,
      }),
      heyBgt: new HeyBgtContract({
        address: this.currentChain.contracts.heyBgt as Address,
      }),
    };
    this.publicClient = createPublicClientByChain(this.currentChain.chain);
    this.walletClient = walletClient;
    this.currentChain.init();
    await StorageState.sync();
    this.isInit = true;
  }
}

export const wallet = new Wallet({});
