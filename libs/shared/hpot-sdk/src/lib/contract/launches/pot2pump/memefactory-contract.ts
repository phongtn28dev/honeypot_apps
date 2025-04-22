import { BaseContract } from '../../baseContract';
import { wallet } from '../../../wallet/wallet';
import { Address, getContract, GetContractReturnType } from 'viem';
import { makeAutoObservable } from 'mobx';
import { ContractWrite, AsyncState } from '../../../utils';
import { MemeFactoryABI } from '../../../abis/MemeFactory';
import { pot2PumpFactoryABI } from '../../../abis/Pot2Pump/pot2PumpFactory';

export class MemeFactoryContract implements BaseContract {
  address = '';
  name: string = '';
  abi = pot2PumpFactoryABI;
  constructor(args: Partial<MemeFactoryContract>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  get contract(): GetContractReturnType<
    typeof pot2PumpFactoryABI,
    typeof wallet.walletClient
  > {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  async events(depositerAddress: Address): Promise<readonly Address[]> {
    const res = await this.contract.read.events([depositerAddress]);
    return res as readonly Address[];
  }

  get createPair() {
    return new ContractWrite(this.contract.write.createPair, {
      action: 'Create MEME Project',
      isSuccessEffect: true,
    });
  }

  get allPairsLength(): AsyncState {
    return new AsyncState(this.contract.read.allPairsLength);
  }
}
