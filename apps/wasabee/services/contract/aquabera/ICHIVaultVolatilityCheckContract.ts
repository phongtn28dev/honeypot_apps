import { BaseContract } from './..';
import { wallet } from '@honeypot/shared';
import { makeAutoObservable } from 'mobx';
import { Address, getContract, zeroAddress } from 'viem';
import ICHIVaultVolatilityCheckABI from '@/lib/abis/aquabera/ICHIVaultVolatilityCheck';

export class ICHIVaultVolatilityCheckContract implements BaseContract {
  address: Address = zeroAddress;
  name: string = 'ICHIVaultVolatilityCheck';
  abi = ICHIVaultVolatilityCheckABI;

  constructor(args: Partial<ICHIVaultVolatilityCheckContract>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  get contract() {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  async currentVolatility(vault: string) {
    if (!wallet.walletClient?.account || !wallet.walletClient) {
      return;
    }
    return this.contract.read.currentVolatility([vault as `0x${string}`]);
  }
}
