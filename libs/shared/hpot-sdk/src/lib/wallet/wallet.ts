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
import { UniversalAccount } from './universalAccount';
import { BGTVaultFactory } from '../contract/rewardVault/bgt-vault-factory';
import { VaultStakerFactory } from '../contract/aquabera/VaultStaker/VaultStakerFactory';

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
    rewardVaultFactory: BGTVaultFactory;
    vaultStakerFactory: VaultStakerFactory;
  } = {} as any;
  publicClient!: PublicClient;
  isInit = false;
  get networksMap() {
    return this.networks.reduce((acc, network) => {
      acc[network.chainId] = network;
      return acc;
    }, {} as Record<number, Network>);
  }
  universalAccount: UniversalAccount | undefined = undefined;

  get currentChain() {
    return this.networksMap[this.currentChainId];
  }

  constructor(args: Partial<Wallet>) {
    makeAutoObservable(this, {
      networksMap: false,
      currentChain: false,
    });
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
    this.networks = networks;
    this.currentChainId = walletClient?.chain?.id || DEFAULT_CHAIN_ID;
    const mockAccount = localStorage.getItem('mockAccount');
    this.account = mockAccount || walletClient?.account?.address || zeroAddress;

    // Ensure networks are initialized before accessing currentChain
    if (!this.networks.length) {
      console.error('Networks not initialized');
      return;
    }

    const currentChain = this.networksMap[this.currentChainId];
    if (!currentChain) {
      console.error('Current chain not found');
      return;
    }

    this.contracts = {
      rewardVaultFactory: new BGTVaultFactory({
        address: currentChain.contracts.rewardVaultFactory as Address,
      }),
      algebraSwapRouter: new AlgebraSwapRouterContract({
        address: currentChain.contracts.algebraSwapRouter as `0x${string}`,
      }),
      ftofactory: new FtoFactoryContract({
        address: currentChain.contracts.ftoFactory,
      }),
      ftofacade: new FtoFacadeContract({
        address: currentChain.contracts.ftoFacade,
      }),
      memeFactory: new MemeFactoryContract({
        address: currentChain.contracts.memeFactory,
      }),
      memeFacade: new MEMEFacadeContract({
        address: currentChain.contracts.memeFacade,
      }),
      vaultFactory: new ICHIVaultFactoryContract({
        address: currentChain.contracts.vaultFactory as Address,
      }),
      vaultVolatilityCheck: new ICHIVaultVolatilityCheckContract({
        address: currentChain.contracts.vaultVolatilityCheck as Address,
      }),
      vaultStakerFactory: new VaultStakerFactory({
        address: currentChain.contracts.vaultStakerFactory as Address,
      }),
    };
    this.publicClient = createPublicClientByChain(currentChain.chain) as any;
    if (walletClient) {
      this.walletClient = walletClient;
      walletClient.switchChain({
        id: this.currentChainId,
      });
    }
    currentChain.init();
    await StorageState.sync();

    if (this.account && this.account !== zeroAddress) {
      runInAction(() => {
        this.universalAccount = new UniversalAccount(this.account);
      });
      await this.universalAccount?.loadUniversalAccountInfo();
    } else {
      runInAction(() => {
        this.universalAccount = undefined;
      });
    }

    runInAction(() => {
      this.isInit = true;
    });
  }
}

export const wallet = new Wallet({});
