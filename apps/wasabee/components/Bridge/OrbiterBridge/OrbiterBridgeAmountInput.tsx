import { orbiterBridgeService } from '@/services/orbiterBridge';
import { cn, Input } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

interface Props {
  type: 'from' | 'to';
}

export const OrbiterBridgeAmountInput = observer(({ type }: Props) => {
  const handleAmountChange = useCallback(
    (value: string) => {
      // Remove any non-numeric characters except decimal point
      const sanitizedValue = value.replace(/[^0-9.]/g, '');

      // Prevent multiple decimal points
      const parts = sanitizedValue.split('.');
      if (parts.length > 2) return;

      if (type === 'from') {
        orbiterBridgeService.setFromAmount(sanitizedValue);
      }
    },
    [type]
  );

  const value =
    type === 'from'
      ? orbiterBridgeService.fromAmount
      : Number(orbiterBridgeService.toAmount).toFixed(5);

  return (
    <div className="flex flex-col gap-1">
      <Input
        type="text"
        placeholder="0.0"
        value={value}
        onChange={(e) => handleAmountChange(e.target.value)}
        variant="bordered"
        isDisabled={type === 'to'}
        classNames={{
          input: 'text-right',
          inputWrapper: 'bg-transparent',
        }}
        endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">
              {orbiterBridgeService.selectedToken?.symbol}
            </span>
          </div>
        }
      />
      {orbiterBridgeService.router && type === 'from' && (
        <p
          className={cn(
            'text-sm text-default-400 flex gap-1 justify-between',
            Number(orbiterBridgeService.fromAmount) <
              Number(orbiterBridgeService.router.getMinSendAmount()) ||
              (Number(orbiterBridgeService.fromAmount) >
                Number(orbiterBridgeService.router.getMaxSendAmount()) &&
                'text-red-500')
          )}
        >
          <span>min:{orbiterBridgeService.router.getMinSendAmount()}</span>
          <span>max:{orbiterBridgeService.router.getMaxSendAmount()}</span>
        </p>
      )}
    </div>
  );
});

export default OrbiterBridgeAmountInput;
