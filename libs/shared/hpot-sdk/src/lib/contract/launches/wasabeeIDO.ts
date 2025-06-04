import BigNumber from 'bignumber.js';
import { makeAutoObservable, runInAction } from 'mobx';
import { Address, getContract, GetContractReturnType, zeroAddress } from 'viem';
import { wasabeeIDOABI } from '../../abis/wasabeeIDO/WasabeeIDOABI';
import dayjs, { Dayjs } from 'dayjs';
import { ContractWrite } from '../../utils';
import { Token } from '../token/token';
import { DEFAULT_CHAIN_ID } from '../../../config/algebra/default-chain-id';
import { wallet } from '../../wallet';

export enum IDO_STATUS {
  NOT_STARTED,
  STARTED,
  ENDED,
}

export class WasabeeIDO {
  address: Address | undefined;
  abi = wasabeeIDOABI;

  // Input data
  amountIn: BigNumber = new BigNumber(0);

  // Onchain data
  idoToken: Token | undefined;
  weth: Token | undefined;
  idoTotalAmount: BigNumber = new BigNumber(0);
  priceInETH: BigNumber = new BigNumber(0);
  startsAt: Dayjs = dayjs();
  endsAt: Dayjs = dayjs();
  idoSold: BigNumber = new BigNumber(0);
  maxEthPerWallet: BigNumber = new BigNumber(0);
  feeRate: BigNumber = new BigNumber(0);
  ethPurchased: BigNumber = new BigNumber(0);

  // Metadata
  chainId: number = DEFAULT_CHAIN_ID;
  name: string = '';
  description: string = '';
  imageUrl: string = '';
  bannerUrl: string = '';
  learnMoreUrl: string = '';
  socials: {
    id: string;
    url: string;
    name: string;
    joinedAt: string;
    provider: string;
    username: string;
    followers: number;
    image_url: string;
  }[] = [];

  constructor({
    address,
    ...args
  }: { address: Address } & Partial<WasabeeIDO>) {
    Object.assign(this, args);
    this.address = address;
    makeAutoObservable(this);
  }

  get contract(): GetContractReturnType<
    typeof wasabeeIDOABI,
    typeof wallet.walletClient
  > {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  get idoStatus() {
    const now = dayjs();
    if (now.isBefore(this.startsAt)) {
      return IDO_STATUS.NOT_STARTED;
    }
    if (now.isAfter(this.endsAt)) {
      return IDO_STATUS.ENDED;
    }
    return IDO_STATUS.STARTED;
  }

  get idoStatusDisplay() {
    switch (this.idoStatus) {
      case IDO_STATUS.ENDED:
        return 'Ended';
      case IDO_STATUS.NOT_STARTED:
        return 'Not Started';
      case IDO_STATUS.STARTED:
        return 'Started';
    }
  }

  async loadOnchainData() {
    if (!this.address) {
      return;
    }

    await Promise.all([
      this.loadIDOToken(),
      this.loadWETH(),
      this.loadSaleTimeFrame(),
      this.loadIDOTotalAmount(),
      this.loadPriceInETH(),
      this.loadIDOSold(),
      this.loadMaxEthPerWallet(),
      this.loadFeeRate(),
      this.loadEthPurchased(),
    ]);
  }

  async loadIDOToken() {
    if (!this.address) {
      return;
    }
    const token = (await this.contract.read['idoToken']()) as `0x${string}`;
    const idoToken = Token.getToken({
      address: token,
      force: true,
      chainId: this.chainId.toString(),
    });

    this.idoToken = idoToken;
    return this.idoToken;
  }

  async loadWETH() {
    if (!this.address) {
      return;
    }
    const token = (await this.contract.read['weth']()) as `0x${string}`;
    const weth = Token.getToken({
      address: token,
      force: true,
      chainId: this.chainId.toString(),
    });

    this.weth = weth;
    return this.weth;
  }

  async loadSaleTimeFrame() {
    if (!this.address) {
      return {
        startsAt: new Date(),
        endsAt: new Date(),
      };
    }

    const startsAt = (await this.contract.read['startTime']()) as bigint;
    const endsAt = (await this.contract.read['endTime']()) as bigint;

    this.startsAt = dayjs(Number(startsAt) * 1000);
    this.endsAt = dayjs(Number(endsAt) * 1000);

    return {
      startsAt: new Date(startsAt.toString()),
      endsAt: new Date(endsAt.toString()),
    };
  }

  async loadIDOTotalAmount() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const totalAmount = (await this.contract.read[
      'idoTotalAmount'
    ]()) as bigint;
    this.idoTotalAmount = new BigNumber(totalAmount.toString()).div(
      10 ** (this.idoToken?.decimals ?? 18)
    );

    return this.idoTotalAmount;
  }

  async loadPriceInETH() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const price = (await this.contract.read['priceInETH']()) as bigint;
    this.priceInETH = new BigNumber(price.toString()).div(1e18);

    return this.priceInETH;
  }

  async loadIDOSold() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const sold = (await this.contract.read['idoSold']()) as bigint;
    this.idoSold = new BigNumber(sold.toString()).div(
      10 ** (this.idoToken?.decimals ?? 18)
    );

    return this.idoSold;
  }

  async loadMaxEthPerWallet() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const max = (await this.contract.read['maxEthPerWallet']()) as bigint;
    this.maxEthPerWallet = new BigNumber(max.toString()).div(1e18);

    return this.maxEthPerWallet;
  }

  async loadFeeRate() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const rate = (await this.contract.read['feeRate']()) as bigint;
    this.feeRate = new BigNumber(rate.toString());

    return this.feeRate;
  }

  async loadEthPurchased() {
    if (!this.address || !wallet.account) {
      return new BigNumber(0);
    }

    const purchased = (await this.contract.read['ethPurchased']([
      wallet.account as `0x${string}`,
    ])) as bigint;
    this.ethPurchased = new BigNumber(purchased.toString()).div(1e18);

    return this.ethPurchased;
  }

  setAmountIn(amountIn: string) {
    runInAction(() => {
      this.amountIn = new BigNumber(amountIn);
    });
  }

  async buyWithETH() {
    if (!this.address || this.amountIn.lte(0)) {
      return;
    }

    try {
      const tx = await new ContractWrite(this.contract.write['buy']).call([
        BigInt(
          this.amountIn
            .times(10 ** (this.idoToken?.decimals ?? 18))
            .toFixed(0)
            .toString()
        ),
      ]);

      console.log('tx', tx);
    } catch (error) {
      console.error('error', error);
    }
  }

  async buyWithWETH() {
    if (!this.address || this.amountIn.lte(0)) {
      return;
    }

    await this.weth?.approveIfNoAllowance({
      amount: this.amountIn.times(1e18).toFixed(0).toString(),
      spender: this.address,
    });

    try {
      const tx = await new ContractWrite(
        this.contract.write['buyWithWETH']
      ).call([
        BigInt(
          this.amountIn
            .times(10 ** (this.idoToken?.decimals ?? 18))
            .toFixed(0)
            .toString()
        ),
      ]);

      console.log('tx', tx);
    } catch (error) {
      console.error('error', error);
    }
  }
}
