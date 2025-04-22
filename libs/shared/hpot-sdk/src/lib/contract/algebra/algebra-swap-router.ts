import { BaseContract } from './../baseContract';
import { wallet } from './../../wallet';
import { makeAutoObservable } from 'mobx';
import { getContract, GetContractReturnType } from 'viem';
import { algebraRouterABI } from '../../abis/algebra-contracts/ABIs';

export class AlgebraSwapRouterContract implements BaseContract {
  address = wallet.currentChain.contracts.algebraSwapRouter;
  name: string = 'AlgebraSwapRouter';
  abi = algebraRouterABI;

  constructor(args: Partial<AlgebraSwapRouterContract>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  get contract(): GetContractReturnType<
    typeof algebraRouterABI,
    typeof wallet.walletClient
  > {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }
}
