import { OrbiterRouterV3ABI } from '@/lib/abis/orbiter/OrbiterRouterV3ABI';
import { BaseContract } from './..';
import { wallet } from '@honeypot/shared';
import { makeAutoObservable } from 'mobx';
import { Address, getContract, zeroAddress } from 'viem';

export class OrbiterRouterV3 implements BaseContract {
  address: Address = zeroAddress;
  name: string = 'OrbiterRouterV3';
  abi = OrbiterRouterV3ABI;

  constructor(args: Partial<OrbiterRouterV3>) {
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
}
