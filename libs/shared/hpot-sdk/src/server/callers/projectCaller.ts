import { ftoRouter } from '../router/fto';
import { t } from '../trpc';

const router = t.router({
  fto: ftoRouter,
});

const createCaller = t.createCallerFactory(router);
export const projectCaller = createCaller({
  user: null,
  //@ts-ignore
  req: null,
});
