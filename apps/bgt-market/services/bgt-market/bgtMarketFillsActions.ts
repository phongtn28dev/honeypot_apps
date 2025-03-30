import BigNumber from 'bignumber.js';
import { wallet } from '../wallet';
import { get, makeAutoObservable, reaction } from 'mobx';
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
  OrderFilled,
  OrderStatus,
  OrderType,
} from '@/lib/algebra/graphql/generated/graphql';
import { BGTVault } from '../contract/bgt-market/bgt-vault';

export class BgtMarketFillActions {
  // static gqlOrderFilledToBgtFillActions(order: OrderFilled): BgtFillActions {
  //   return BgtFillActions.getBgtFillActions({
  //     // orderId: order.id.toString(),
  //     // dealerId: order.dealer.id as Address,
  //     // price: order.price.toString(),
  //     // vaultAddress: order.vaultAddress as Address,
  //     // balance: order.balance.toString(),
  //     // spentBalance: order.spentBalance.toString(),
  //     // height: order.height.toString(),
  //     // orderType: order.orderType,
  //     // status: order.status,
  //   });
  // }
  static bgtFillActionsMap: Record<string, BgtMarketFillActions> = {};
  static getBgtFillActions({
    id,

    ...args
  }: {
    id: string;
  } & Partial<BgtMarketFillActions>) {
    const key = id;
    const order = BgtMarketFillActions.bgtFillActionsMap[key];

    if (!order) {
      BgtMarketFillActions.bgtFillActionsMap[key] = new BgtMarketFillActions({
        id: id,
        ...args,
      });
    } else {
      BgtMarketFillActions.bgtFillActionsMap[key].setData(args);
    }
    return BgtMarketFillActions.bgtFillActionsMap[key];
  }

  id: string;

  constructor({ id, ...args }: Partial<BgtMarketFillActions> & { id: string }) {
    this.setData(args);
    this.id = id;
    makeAutoObservable(this);
  }

  setData({ ...args }: Partial<BgtMarketFillActions>) {
    Object.assign(this, args);
  }
}
