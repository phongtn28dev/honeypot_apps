import BigNumber from 'bignumber.js';
import { wallet } from '@honeypot/shared';
import { get, makeAutoObservable, reaction, runInAction } from 'mobx';
import { Address, formatEther, getContract, zeroAddress } from 'viem';
import { ContractWrite } from '../utils';
import { amountFormatted } from '@/lib/format';
import { ERC20ABI } from '@/lib/abis/erc20';
import { faucetABI } from '@/lib/abis/faucet';
import { watchAsset } from 'viem/actions';
import { networksMap } from '../network';
import { WrappedToastify } from '@/lib/wrappedToastify';
import { trpcClient } from '@/lib/trpc';
import NetworkManager from '../network';
import { getSingleTokenData } from '@/lib/algebra/graphql/clients/token';
import {
  Order,
  OrderStatus,
  OrderType,
} from '@/lib/algebra/graphql/generated/graphql';
import { BGTVault } from '../contract/bgt-market/bgt-vault';

export class BgtMarketOrder {
  static gqlOrderToBgtOrder(order: Order): BgtMarketOrder {
    return BgtMarketOrder.getBgtOrder({
      orderId: order.id.toString(),
      dealerId: order.dealer.id as Address,
      price: order.price.toString(),
      vaultAddress: order.vaultAddress as Address,
      balance: order.balance.toString(),
      spentBalance: order.spentBalance.toString(),
      height: order.height.toString(),
      orderType: order.orderType,
      status: order.status,
    });
  }
  static bgtOrderMap: Record<string, BgtMarketOrder> = {};
  static getBgtOrder({
    orderId,
    dealerId,
    ...args
  }: {
    orderId: string;
  } & Partial<BgtMarketOrder>) {
    const key = orderId;
    const order = BgtMarketOrder.bgtOrderMap[key];

    if (!order) {
      BgtMarketOrder.bgtOrderMap[key] = new BgtMarketOrder({
        orderId: orderId,
        dealerId: dealerId as Address,
        ...args,
      });
    } else {
      BgtMarketOrder.bgtOrderMap[key].setData(args);
    }
    return BgtMarketOrder.bgtOrderMap[key];
  }

  orderId: string;
  dealerId: Address = zeroAddress;
  price: number = 0;
  vaultAddress: Address = zeroAddress;
  balance: bigint = BigInt(0);
  spentBalance: bigint = BigInt(0);
  height: string = '0';
  orderType: OrderType = OrderType.BuyBgt;
  status: OrderStatus = OrderStatus.Pending;
  orderVaultBgt: bigint = BigInt(0);

  get orderString() {
    switch (this.orderType) {
      case OrderType.BuyBgt:
        return 'BuyBGT';
      case OrderType.SellBgt:
        return 'SellBGT';
    }
  }

  get pricePerBgtString() {
    return (this.price / 10000).toFixed(4);
  }

  get rewardVault() {
    if (!this.vaultAddress || this.status !== OrderStatus.Pending) return;

    return BGTVault.getBgtVault({
      address: this.vaultAddress.toLowerCase() as Address,
    });
  }

  get totalPriceString() {
    switch (this.orderType) {
      case OrderType.BuyBgt:
        return (
          Number(this.pricePerBgtString) * Number(formatEther(this.balance))
        );
      case OrderType.SellBgt:
        return (Number(this.pricePerBgtString) * Number(this.SaleBGT)).toFixed(
          4
        );
    }
  }

  get SaleBGT(): string {
    if (this.orderType === OrderType.SellBgt) {
      switch (this.status) {
        case OrderStatus.Closed:
          return '0';
        case OrderStatus.Filled:
          return (
            Number(formatEther(BigInt(this.spentBalance))) /
            Number(this.pricePerBgtString)
          ).toFixed(4);
        case OrderStatus.Pending:
          return Number(formatEther(BigInt(this.orderVaultBgt))).toFixed(4);
        default:
          return '0';
      }
    } else {
      return formatEther(this.balance);
    }
  }

  get filledPercentString() {
    switch (this.orderType) {
      case OrderType.BuyBgt:
        const filledAmount =
          Number(formatEther(this.spentBalance)) / Number(this.price / 10000);

        return `${
          filledAmount != 0 && filledAmount < 0.01
            ? '<0.01'
            : filledAmount.toFixed(2)
        } BGT (${(
          (Number(this.spentBalance) / Number(this.balance)) *
          100
        ).toFixed(2)}%)`;
      case OrderType.SellBgt:
        if (this.status === OrderStatus.Filled) {
          return 'Filled';
        } else {
          return 'Unfilled';
        }
    }
  }

  constructor({
    orderId,
    ...args
  }: Partial<BgtMarketOrder> & { orderId: string }) {
    this.setData(args);
    this.orderId = orderId;
    makeAutoObservable(this);
  }

  updateOrderVaultBgt() {
    if (!this.rewardVault || this.rewardVault.address === zeroAddress) return;
    this.rewardVault
      .readAddressBgtInVault(this.dealerId as Address)
      .then((res) => {
        runInAction(() => {
          this.orderVaultBgt = res;
        });
      });
  }

  setData({ ...args }: Partial<BgtMarketOrder>) {
    runInAction(() => {
      Object.assign(this, args);
    });
  }
}
