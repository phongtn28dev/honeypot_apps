import { BaseContract } from '../baseContract';
import { wallet } from '@honeypot/shared';
import { makeAutoObservable, runInAction } from 'mobx';
import { Address, getContract, GetContractReturnType, zeroAddress } from 'viem';
import { RewardVaultFactoryABI } from '../../abis/rewardVault/RewardVaultFactoryABI';
import { BGTVault } from './bgt-vault';

export class BGTVaultFactory implements BaseContract {
  address: Address = zeroAddress;
  name: string = 'BGTVaultFactory';
  abi = RewardVaultFactoryABI;
  userBgtInVault = '0';
  bgtVaultApproved = false;
  logoURI: string = '';

  constructor(args: Partial<BGTVault>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  setData({ ...args }: Partial<BGTVault>) {
    runInAction(() => {
      Object.assign(this, args);
    });
  }

  get contract(): GetContractReturnType<
    typeof RewardVaultFactoryABI,
    typeof wallet.walletClient
  > {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  async loadBgtVaultAddressByStakingToken(stakingToken: Address) {
    const vault = await this.contract.read.getVault([stakingToken]);

    if (vault === zeroAddress) {
      return undefined;
    }

    return vault;
  }
}
