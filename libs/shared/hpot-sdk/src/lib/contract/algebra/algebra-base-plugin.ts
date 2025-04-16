import { BaseContract } from './../baseContract';
import { wallet } from '../../wallet';
import { Signer, ethers } from 'ethers';
import { Contract } from 'ethcall';
import BigNumber from 'bignumber.js';
import { makeAutoObservable } from 'mobx';
import { getContract } from 'viem';
import { algebraBasePluginABI } from '../../abis/algebra-contracts/ABIs';
import { ContractWrite } from '../../utils/utils';

export class AlgebraBasePluginContract implements BaseContract {
  address = '';
  name: string = '';
  abi = algebraBasePluginABI;

  constructor(args: Partial<AlgebraBasePluginContract>) {
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
