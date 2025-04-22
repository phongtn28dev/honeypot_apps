import { makeAutoObservable } from 'mobx';
import { useEffect } from 'react';

import { AsyncState } from '@honeypot/shared/lib/utils/utils';

export abstract class PageController {
  constructor() {
    makeAutoObservable(this);
  }
  abstract init: AsyncState;
  abstract dispose(): void;
}
