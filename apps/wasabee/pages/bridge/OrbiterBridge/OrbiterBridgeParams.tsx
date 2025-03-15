import { truncate } from '@/lib/format';
import { orbiterBridgeService } from '@/services/orbiterBridge';
import { Tooltip } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

export const OrbiterBridgeParams = observer(() => {
  if (!orbiterBridgeService.router) {
    return null;
  }

  const router = orbiterBridgeService.router;

  return (
    <div className="w-full flex flex-col gap-2 mt-4 p-4 bg-transparent rounded-xl">
      <div className="flex justify-between items-center">
        <span className="text-sm text-default-500">Maker Address</span>
        <Tooltip content={router.makerAddress}>
          <span className="text-sm font-medium">
            {truncate(router.makerAddress, 12)}
          </span>
        </Tooltip>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-default-500">From Token Address</span>
        <Tooltip content={router.srcToken.address}>
          <span className="text-sm font-medium">
            {truncate(router.srcToken.address, 12)}
          </span>
        </Tooltip>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-default-500">To Token Address</span>
        <Tooltip content={router.dstToken.address}>
          <span className="text-sm font-medium">
            {truncate(router.dstToken.address, 12)}
          </span>
        </Tooltip>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-default-500">Withholding Fees</span>
        <span className="text-sm font-medium">
          {router.routerConfig.withholdingFee} {router.srcToken.symbol}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-default-500">Trading Fees</span>
        <span className="text-sm font-medium">
          {router.routerConfig.tradeFee} %
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-default-500">Estimated Time</span>
        <span className="text-sm font-medium">{router.spentTime} Seconds</span>
      </div>
    </div>
  );
});

export default OrbiterBridgeParams;
