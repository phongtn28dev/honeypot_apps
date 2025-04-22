import { wallet } from '../../wallet';
import { Signer, ethers } from 'ethers';
import { Contract } from 'ethcall';
import BigNumber from 'bignumber.js';
import { makeAutoObservable } from 'mobx';
import { getContract, GetContractReturnType } from 'viem';
import { algebraFactoryABI } from '../../abis/algebra-contracts/ABIs';
import { ContractWrite } from '../../utils/utils';
import { BaseContract } from '../baseContract';

export class AlgebraFactoryContract implements BaseContract {
  address = '';
  name: string = '';
  abi = algebraFactoryABI;

  constructor(args: Partial<AlgebraFactoryContract>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  get contract(): GetContractReturnType<
    typeof algebraFactoryABI,
    typeof wallet.walletClient
  > {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  get createPool() {
    return new ContractWrite(this.contract.write?.createPool, {
      action: 'Create Pool',
      isSuccessEffect: true,
    });
  }
}
