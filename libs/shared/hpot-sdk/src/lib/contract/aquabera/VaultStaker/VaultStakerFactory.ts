import { BaseContract } from './../../baseContract';
import { wallet } from '../../../wallet/wallet';
import { makeAutoObservable } from 'mobx';
import { Address, getContract, GetContractReturnType, zeroAddress } from 'viem';
import { VaultStakerFactoryABI } from '../../../abis/VaultStakerFactory/VaultStakerFactory';
import { ContractWrite } from '@honeypot/shared/lib/utils';
import { BGTVault } from '../../rewardVault/bgt-vault';
import { ICHIVaultContract } from '../ICHIVault-contract';

export class VaultStakerFactory implements BaseContract {
  address: Address = zeroAddress;
  name: string = 'VaultStakerFactory';
  abi = VaultStakerFactoryABI;

  constructor(args: Partial<VaultStakerFactory>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  get contract(): GetContractReturnType<
    typeof VaultStakerFactoryABI,
    typeof wallet.walletClient
  > {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  async createVaultStakerDefault(
    lbgtReceiver: Address,
    bgtVault: BGTVault,
    amount: number
  ) {
    return this.createMiniVaultStaker(lbgtReceiver, bgtVault, amount);
  }

  async createMiniVaultStaker(
    lbgtReceiver: Address,
    bgtVault: BGTVault,
    n: number
  ) {
    return new ContractWrite(this.contract.write.createMiniVaultStaker).call([
      lbgtReceiver,
      bgtVault.address,
      BigInt(n),
    ]);
  }

  async stakeMiniVaultStakerDefault(
    bgtVaultAddress: Address,
    ichiVault: ICHIVaultContract
  ) {
    return this.stakeMiniVaultStaker(
      [BigInt(0)],
      [BigInt(ichiVault.userShares ?? 0)],
      bgtVaultAddress,
      ichiVault
    );
  }

  async stakeMiniVaultStaker(
    stakerIndexes: bigint[],
    amounts: bigint[],
    bgtVaultAddress: Address,
    vault: ICHIVaultContract
  ) {
    await new ContractWrite(vault.contract.write.approve).call([
      wallet.currentChain.contracts.vaultStakerFactory,
      vault.userShares ?? BigInt(0),
    ]);

    const res = await wallet.publicClient.simulateContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      functionName: 'stake',
      account: wallet.account as Address,
      args: [stakerIndexes, amounts, bgtVaultAddress],
    });

    return new ContractWrite(this.contract.write.stake).call([
      stakerIndexes,
      amounts,
      bgtVaultAddress,
    ]);
  }

  async unstakeMiniVaultStaker(bgtVaultAddress: Address) {
    // const res = await wallet.publicClient.simulateContract({
    //   address: this.address as `0x${string}`,
    //   abi: this.abi,
    //   functionName: 'unStake',
    //   account: wallet.account as Address,
    //   args: [bgtVaultAddress],
    // });

    return new ContractWrite(this.contract.write.unStake).call([
      bgtVaultAddress,
    ]);
  }

  async mintLbgtDefault(rewardVaultAddress: Address) {
    return this.mintLbgt([BigInt(0)], rewardVaultAddress);
  }

  async mintLbgt(stakerIndexes: bigint[], rewardVaultAddress: Address) {
    // const res = await wallet.publicClient.simulateContract({
    //   address: this.address as `0x${string}`,
    //   abi: this.abi,
    //   functionName: 'mintLBGT',
    //   account: wallet.account as Address,
    //   args: [stakerIndexes, rewardVaultAddress],
    // });

    console.log('mintLbgt', stakerIndexes, rewardVaultAddress);

    return new ContractWrite(this.contract.write.mintLBGT).call([
      stakerIndexes,
      rewardVaultAddress,
    ]);
  }

  async getMiniVaultStaker(bgtVaultAddress: Address) {
    return this.contract.read.getStakers([bgtVaultAddress]);
  }
}
