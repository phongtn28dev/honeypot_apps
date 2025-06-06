import { DynamicFormatAmount, IDO_STATUS, WasabeeIDO } from '@honeypot/shared';
import dayjs from 'dayjs';
import Countdown from 'react-countdown';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { TokenSelector } from '@honeypot/shared';
import { Button, cn } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { debounce } from 'lodash';
import { wallet } from '@honeypot/shared/lib/wallet';
import BigNumber from 'bignumber.js';
import { runInAction } from 'mobx';

export const WasabeeIDOActionComponent = observer(
  ({
    wasabeeIDO,
    refetchPurchaseHistory,
  }: {
    wasabeeIDO: WasabeeIDO;
    refetchPurchaseHistory?: () => void;
  }) => {
    const idoStatus = wasabeeIDO.idoStatus;
    const startsAt = wasabeeIDO.startsAt;
    const endsAt = wasabeeIDO.endsAt;
    const statusDisplay = wasabeeIDO.idoStatusDisplay;

    const renderComponent = () => {
      switch (idoStatus) {
        case IDO_STATUS.NOT_STARTED:
          return <IDONotStartedComponent wasabeeIDO={wasabeeIDO} />;
        case IDO_STATUS.STARTED:
          return (
            <IDOStartedComponent
              wasabeeIDO={wasabeeIDO}
              refetchPurchaseHistory={refetchPurchaseHistory}
            />
          );
        case IDO_STATUS.ENDED:
          return <IDOEndedComponent wasabeeIDO={wasabeeIDO} />;
        default:
          return null;
      }
    };

    const countdownRenderer = ({
      days,
      hours,
      minutes,
      seconds,
      completed,
    }: any) => {
      if (completed) {
        return <div>Sale Ended</div>;
      }

      return (
        <div className="w-full flex justify-between items-center">
          <span className="text-sm text-[#4D4D4D]">Ends At</span>{' '}
          <span className="text-base font-bold">
            {days}d {hours}h {minutes}m {seconds}s
          </span>
        </div>
      );
    };

    return (
      <>
        <div className="w-full flex items-center justify-between">
          <div className="text-sm text-[#4D4D4D]">Sale Time</div>
          <div className="text-base font-bold">
            {startsAt?.format('DD/MM/YYYY HH:mm')} -{' '}
            {endsAt?.format('DD/MM/YYYY HH:mm')}
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="text-sm text-[#4D4D4D]">Sale Status</div>
          <div className="text-base font-bold">{statusDisplay}</div>
        </div>
        <div>
          {endsAt && (
            <Countdown date={endsAt.toDate()} renderer={countdownRenderer} />
          )}
          <div className="gap-2 text-center">
            <div>
              <div className="text-xl font-bold">
                {endsAt && dayjs(endsAt).format('DD/MM/YYYY')}
              </div>
            </div>
          </div>
        </div>
        {renderComponent()}
      </>
    );
  }
);

const IDOStartedComponent = observer(
  ({
    wasabeeIDO,
    refetchPurchaseHistory,
  }: {
    wasabeeIDO: WasabeeIDO;
    refetchPurchaseHistory?: () => void;
  }) => {
    const [useWETH, setUseWETH] = useState(false);
    const inputDebounce = debounce((value: string) => {
      wasabeeIDO.setAmountIn(!!value ? value : '0');
    }, 300);

    const buyTokens = async () => {
      try {
        if (!wallet.account) {
          throw new Error('No wallet account connected');
        }

        // Check balances before attempting transaction
        if (useWETH) {
          const wethBalance = wasabeeIDO.weth?.balance ?? new BigNumber(0);
          console.log('WBERA Balance Check:', {
            balance: wethBalance.toString(),
            amountIn: wasabeeIDO.amountIn.toString(),
            balanceInWei: wethBalance.times(10 ** 18).toString(),
            amountInWei: wasabeeIDO.amountIn.times(10 ** 18).toString(),
          });
          if (wethBalance.lt(wasabeeIDO.amountIn)) {
            throw new Error(
              `Insufficient WBERA balance. You have ${wethBalance.toString()} WBERA but need ${wasabeeIDO.amountIn.toString()} WBERA`
            );
          }
          await wasabeeIDO.buyWithWETH();
        } else {
          const ethBalance = wallet.balance?.div(10 ** 18) ?? new BigNumber(0);
          console.log('BERA Balance Check:', {
            balance: ethBalance.toString(),
            amountIn: wasabeeIDO.amountIn.toString(),
            balanceInWei: wallet.balance?.toString(),
            amountInWei: wasabeeIDO.amountIn.times(10 ** 18).toString(),
          });
          if (ethBalance.lt(wasabeeIDO.amountIn)) {
            throw new Error(
              `Insufficient BERA balance. You have ${ethBalance.toString()} BERA but need ${wasabeeIDO.amountIn.toString()} BERA`
            );
          }
          await wasabeeIDO.buyWithETH();
        }

        // Update balances after successful transaction
        wasabeeIDO.weth?.getBalance();
        wasabeeIDO.idoToken?.getBalance();
        wasabeeIDO.loadEthPurchased();
        wasabeeIDO.setAmountIn('0');
        if (refetchPurchaseHistory) {
          setTimeout(() => {
            refetchPurchaseHistory();
          }, 2000);
        }
      } catch (error: any) {
        console.error('Transaction Error:', error);
        // Show more user-friendly error message
        if (error.message.includes('ERC20InsufficientBalance')) {
          alert(
            'Insufficient token balance. Please check your balance and try again.'
          );
        } else {
          alert(`Transaction failed: ${error.message}`);
        }
      }
    };

    useEffect(() => {
      if (wallet.account) {
        wasabeeIDO.loadWETH().then(() => {
          wasabeeIDO.weth?.getBalance();
        });
        wasabeeIDO.idoToken?.getBalance();
        wasabeeIDO.loadEthPurchased();
        // Load native BERA balance
        wallet.publicClient
          .getBalance({
            address: wallet.account as `0x${string}`,
          })
          .then((balance) => {
            runInAction(() => {
              wallet.balance = new BigNumber(balance.toString());
            });
          });
      }
    }, [wallet.account]);

    // Calculate output token amount based on input ETH
    const outputAmount = wasabeeIDO.amountIn.gt(0)
      ? wasabeeIDO.amountIn.div(wasabeeIDO.priceInETH)
      : new BigNumber(0);

    return (
      <div className="bg-white rounded-[16px] border border-black p-4 text-center">
        <div className="text-lg font-bold mb-2">Sale Started</div>
        <div>
          <div className="text-left text-sm text-[#4D4D4D]">
            <span>Balance: </span>{' '}
            <DynamicFormatAmount
              amount={
                useWETH
                  ? wasabeeIDO.weth?.balance?.toString() ?? '0'
                  : wallet.balance?.div(10 ** 18).toString() ?? '0'
              }
              decimals={5}
              endWith={useWETH ? 'WBERA' : 'BERA'}
            />{' '}
          </div>
          <div className="w-full text-sm text-[#4D4D4D] mb-4 md:flex items-center gap-2">
            <div className="w-full flex flex-col items-end">
              <div className="flex items-center gap-2 w-full">
                <Input
                  disabled={false}
                  type="text"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    inputDebounce(e.target.value);
                  }}
                  className={cn(
                    'text-right',
                    '!bg-transparent',
                    '[&_*]:!bg-transparent',
                    'data-[invalid=true]:!bg-transparent'
                  )}
                  classNames={{
                    inputWrapper: cn(
                      '!bg-transparent',
                      'border-2',
                      'border-black',
                      'shadow-none',
                      '!transition-none',
                      'data-[invalid=true]:!bg-transparent',
                      'group-data-[invalid=true]:!bg-transparent'
                    ),
                    input: cn(
                      '!bg-transparent',
                      '!text-[#202020]',
                      'text-right',
                      'text-xl',
                      '!pr-0',
                      '[appearance:textfield]',
                      '[&::-webkit-outer-spin-button]:appearance-none',
                      '[&::-webkit-inner-spin-button]:appearance-none',
                      'data-[invalid=true]:!bg-transparent'
                    ),
                    clearButton: cn(
                      'opacity-70',
                      'hover:opacity-100',
                      '!text-black',
                      '!p-0',
                      'end-0 start-auto'
                    ),
                  }}
                  placeholder="0.0"
                />
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => setUseWETH(!useWETH)}
                  className="bg-white border-2 border-black hover:bg-gray-100 text-black whitespace-nowrap"
                >
                  {useWETH ? 'WBERA' : 'BERA'}
                </Button>
              </div>
              <div className="text-sm text-[#4D4D4D] mt-1">
                You will receive: {outputAmount.toFixed(6)}{' '}
                {wasabeeIDO.idoToken?.symbol}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-left text-sm text-[#4D4D4D]">
            <span>Purchased: </span> {wasabeeIDO.ethPurchased.toString() ?? 0}{' '}
            BERA
          </div>
        </div>
        <div className="mt-4">
          <Button
            onPress={buyTokens}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            Buy with {useWETH ? 'WBERA' : 'BERA'}
          </Button>
        </div>
      </div>
    );
  }
);

const IDONotStartedComponent = ({ wasabeeIDO }: { wasabeeIDO: WasabeeIDO }) => {
  return (
    <div className="bg-white rounded-[16px] border border-black p-4 text-center">
      <div className="text-lg font-bold mb-2">Sale Not Started</div>
    </div>
  );
};

const IDOEndedComponent = ({ wasabeeIDO }: { wasabeeIDO: WasabeeIDO }) => {
  return (
    <div className="bg-white rounded-[16px] border border-black p-4 text-center">
      <div className="text-lg font-bold mb-2">Sale Ended</div>
      <div className="text-left text-sm text-[#4D4D4D]">
        <span>Purchased: </span> {wasabeeIDO.ethPurchased.toString() ?? 0} BERA
      </div>
    </div>
  );
};

// Pass refetchPurchaseHistory down to IDOStartedComponent
// eslint-disable-next-line react/display-name
export default observer(
  (props: { wasabeeIDO: WasabeeIDO; refetchPurchaseHistory?: () => void }) => (
    <WasabeeIDOActionComponent {...props} />
  )
);
