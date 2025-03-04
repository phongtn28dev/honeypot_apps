import { BaseContract } from './..';
import { wallet } from '@/services/wallet';
import { makeAutoObservable } from 'mobx';
import { Address, getContract, zeroAddress } from 'viem';
import { ICHIVaultFactoryABI } from '@/lib/abis/aquabera/ICHIVaultFactory';
import { ContractWrite } from '@/services/utils';
import { RewardVaultABI } from '@/lib/abis/bgt-market/RewardVaultABI';
import { chain } from '@/services/chain';

export class BGTVault implements BaseContract {
  static bgtVaultMap: Record<string, BGTVault> = {};
  static getBgtVault({
    address,
    force,
    ...args
  }: {
    address: Address;
    force?: boolean;
  } & Partial<BGTVault>) {
    const lowerAddress = address.toLowerCase() as Address;
    const key = lowerAddress;
    const token = BGTVault.bgtVaultMap[key];

    if (!token) {
      BGTVault.bgtVaultMap[key] = new BGTVault({
        address: lowerAddress,
        ...args,
      });
    } else {
      BGTVault.bgtVaultMap[key].setData(args);
    }

    return BGTVault.bgtVaultMap[key];
  }
  address: Address = zeroAddress;
  name: string = 'BGTVault';
  abi = RewardVaultABI;
  userBgtInVault = '0';

  constructor(args: Partial<BGTVault>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  setData({ ...args }: Partial<BGTVault>) {
    Object.assign(this, args);
  }

  get contract() {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  async setOperatorIfNot(clientAddress: Address, OperatorAddress: Address) {
    const vaultOperator = await this.readOperator(
      clientAddress.toLowerCase() as Address
    );

    if (vaultOperator.toLowerCase() != OperatorAddress.toLowerCase()) {
      await this.setOperator(OperatorAddress.toLowerCase() as Address);
    }
  }

  readOperator(account: Address) {
    return this.contract.read.operator([account]);
  }

  async updateCurrentUserBgtInVault() {
    if (!wallet.account) return '0';

    const userBgt = await this.contract.read.earned([
      wallet.account as Address,
    ]);
    this.userBgtInVault = userBgt.toString();
    return userBgt;
  }

  async readAddressBgtInVault(account: Address) {
    const userBgt = await this.contract.read.earned([account]);
    return userBgt;
  }

  setOperator(account: Address) {
    return new ContractWrite(this.contract.write.setOperator, {
      action: 'Setting Vault Operator',
    }).call([account]);
  }
}
