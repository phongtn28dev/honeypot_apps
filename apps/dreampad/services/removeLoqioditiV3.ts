import { makeAutoObservable } from 'mobx';
import { Token } from '@honeypot/shared';
import { AsyncState } from '@honeypot/shared';
import { AlgebraPoolContract } from './contract/algebra/algebra-pool-contract';
import { wallet } from '@honeypot/shared';
import { zeroAddress } from 'viem';
import { chains } from '@/lib/chain';

class RemoveLiquidityV3 {
  currentRemovePair: AlgebraPoolContract | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  setCurrentRemovePair(pair: AlgebraPoolContract) {
    this.currentRemovePair = pair;
  }
}

export const removeLiquidityV3 = new RemoveLiquidityV3();
