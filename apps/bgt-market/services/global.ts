import { action, makeAutoObservable, reaction } from 'mobx';

import { Token } from '@honeypot/shared';

import { PairContract } from '@honeypot/shared';
import { AsyncState } from '@honeypot/shared';
import { ChartDataResponse, resolutionType } from './priceFeed/priceFeedTypes';
import { wallet } from '@honeypot/shared/lib/wallet';
import { trpcClient } from '@/lib/trpc';
import { dayjs } from '@/lib/dayjs';
import { AlgebraPoolContract } from './contract/algebra/algebra-pool-contract';

type baseToken = 'BERA' | 'HONEY';

class GlobalService {
  BgtMarketBaseToken: baseToken = 'BERA';

  constructor() {
    makeAutoObservable(this);
  }

  switchMarketBaseToken() {
    this.BgtMarketBaseToken =
      this.BgtMarketBaseToken === 'BERA' ? 'HONEY' : 'BERA';
  }

  setBgtMarketBaseToken(token: baseToken) {
    this.BgtMarketBaseToken = token;
  }
}

export const globalService = new GlobalService();
