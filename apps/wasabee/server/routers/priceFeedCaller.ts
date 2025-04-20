import { priceFeedRouter } from '../router/priceFeed';
import { t } from '../trpc';

const router = t.router({
  priceFeed: priceFeedRouter,
});

const createCaller = t.createCallerFactory(router);
export const priceFeedCaller = createCaller({
  user: null,
  //@ts-ignore
  req: null,
});
