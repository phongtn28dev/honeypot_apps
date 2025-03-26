import { Network, networks } from './chain';
import BigNumber from 'bignumber.js';
import { Address, PublicClient, WalletClient, zeroAddress } from 'viem';
import { RouterV2Contract } from './contract/dex/routerv2-contract';
import { FactoryContract } from './contract/dex/factory-contract';
import { FtoFactoryContract } from './contract/launches/fto/ftofactory-contract';
import { FtoFacadeContract } from './contract/launches/fto/ftofacade-contract';
import { makeAutoObservable, reaction } from 'mobx';
import { createPublicClientByChain } from '@/lib/client';
import { StorageState } from './utils';
import { MemeFactoryContract } from '@/services/contract/launches/pot2pump/memefactory-contract';
import { MEMEFacadeContract } from '@/services/contract/launches/pot2pump/memefacade-contract';
import { ICHIVaultFactoryContract } from '@/services/contract/aquabera/ICHIVaultFactory-contract';
import { DEFAULT_CHAIN_ID } from '@/config/algebra/default-chain-id';
import { ICHIVaultVolatilityCheckContract } from './contract/aquabera/ICHIVaultVolatilityCheckContract';

const MOCK_ADDRESS = process.env.NEXT_PUBLIC_MOCK_ADDRESS || undefined;

export class Wallet {
  account: string = '';
  accountShort = '';
  networks: Network[] = [];
  balance: BigNumber = new BigNumber(0);
  walletClient!: WalletClient;
  currentChainId: number = -1;
  contracts: {
    routerV2: RouterV2Contract;
    factory: FactoryContract;
    ftofactory: FtoFactoryContract;
    ftofacade: FtoFacadeContract;
    memeFactory: MemeFactoryContract;
    memeFacade: MEMEFacadeContract;
    vaultFactory: ICHIVaultFactoryContract;
    vaultVolatilityCheck: ICHIVaultVolatilityCheckContract;
  } = {} as any;
  publicClient!: PublicClient;
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

  async initWallet(walletClient?: WalletClient) {
    console.log('initWallet', walletClient);
    console.log('MOCK_ADDRESS', MOCK_ADDRESS);
    this.networks = networks;
    this.currentChainId = walletClient?.chain?.id || DEFAULT_CHAIN_ID;
    this.account =
      // MOCK_ADDRESS ||
      walletClient?.account?.address || zeroAddress;
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
      vaultVolatilityCheck: new ICHIVaultVolatilityCheckContract({
        address: this.currentChain.contracts.vaultVolatilityCheck as Address,
      }),
    };
    this.publicClient = createPublicClientByChain(this.currentChain.chain);
    if (walletClient) {
      this.walletClient = walletClient;
    }
    this.currentChain.init();
    await StorageState.sync();
    this.isInit = true;
  }
}

export const wallet = new Wallet({});
