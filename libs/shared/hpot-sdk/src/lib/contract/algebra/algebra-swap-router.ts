import { BaseContract } from './../baseContract';
import { wallet } from './../../wallet';
import { Signer, ethers } from 'ethers';
import { Contract } from 'ethcall';
import BigNumber from 'bignumber.js';
import { makeAutoObservable } from 'mobx';
import { getContract } from 'viem';
import { algebraRouterABI } from '../../abis/algebra-contracts/ABIs';

export class AlgebraSwapRouterContract implements BaseContract {
  address = wallet.currentChain.contracts.algebraSwapRouter;
  name: string = 'AlgebraSwapRouter';
  abi = algebraRouterABI;

  constructor(args: Partial<AlgebraSwapRouterContract>) {
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
