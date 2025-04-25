import { BaseContract } from '../baseContract';
import { wallet } from '../../wallet/wallet';
import { makeAutoObservable, runInAction } from 'mobx';
import { Address, getContract } from 'viem';
import { vestingAbi } from '../../abis/token/vesting';
import { ContractWrite, AsyncState } from '../../utils';

export type VestingInfo = readonly [
  totalAmount: bigint,
  claimedAmount: bigint,
  startTime: bigint,
  cliffDuration: bigint,
  vestingDuration: bigint
];

export class TokenVestingContract implements BaseContract {
  address = '';
  name: string = 'TokenVesting';
  abi = vestingAbi;

  // Observable state properties
  isLoading = false;
  tokenAddress: Address | undefined = undefined;
  ownerAddress: Address | undefined = undefined;
  currentUserVestingInfo: VestingInfo | undefined = undefined;
  currentUserClaimableAmount: bigint | undefined = undefined;
  error: Error | undefined = undefined;

  constructor(args: Partial<TokenVestingContract>) {
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

  async init() {
    if (!this.address) return;

    runInAction(() => {
      this.isLoading = true;
      this.error = undefined;
    });

    try {
      // Load token and owner information
      const [tokenAddress, ownerAddress] = await Promise.all([
        this.getToken(),
        this.getOwner(),
      ]);

      // Load current user data if wallet is connected
      let vestingInfo = undefined;
      let claimableAmount = undefined;

      if (wallet.account) {
        [vestingInfo, claimableAmount] = await Promise.all([
          this.getCurrentUserVestingInfo(),
          this.getCurrentUserClaimableAmount(),
        ]);
      }

      runInAction(() => {
        this.tokenAddress = tokenAddress;
        this.ownerAddress = ownerAddress;
        this.currentUserVestingInfo = vestingInfo;
        this.currentUserClaimableAmount = claimableAmount;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err : new Error(String(err));
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  get claim() {
    return new ContractWrite(this.contract.write?.claim, {
      action: 'Claim Vested Tokens',
      isSuccessEffect: true,
    });
  }

  get withdrawUnusedTokens() {
    return new ContractWrite(this.contract.write?.withdrawUnusedTokens, {
      action: 'Withdraw Unused Tokens',
    });
  }

  async getClaimableAmount(user: Address): Promise<bigint> {
    return this.contract.read.getClaimableAmount([user]);
  }

  async getCurrentUserClaimableAmount(): Promise<bigint | undefined> {
    if (!wallet.account) return undefined;
    return this.getClaimableAmount(wallet.account as `0x${string}`);
  }

  async getVestingInfo(user: Address): Promise<VestingInfo> {
    return this.contract.read.vestings([user]);
  }

  async getCurrentUserVestingInfo(): Promise<VestingInfo | undefined> {
    if (!wallet.account) return undefined;
    return this.getVestingInfo(wallet.account as `0x${string}`);
  }

  async getToken(): Promise<Address> {
    return this.contract.read.token();
  }

  async getOwner(): Promise<Address> {
    return this.contract.read.owner();
  }

  setVesting(
    user: Address,
    totalAmount: bigint,
    startTime: bigint,
    cliffDuration: bigint,
    vestingDuration: bigint
  ) {
    return new ContractWrite(this.contract.write?.setVesting, {
      action: 'Set Vesting Schedule',
    }).call([user, totalAmount, startTime, cliffDuration, vestingDuration]);
  }

  transferOwnership(newOwner: Address) {
    return new ContractWrite(this.contract.write?.transferOwnership, {
      action: 'Transfer Ownership',
    }).call([newOwner]);
  }

  renounceOwnership() {
    return new ContractWrite(this.contract.write?.renounceOwnership, {
      action: 'Renounce Ownership',
    }).call();
  }
}
