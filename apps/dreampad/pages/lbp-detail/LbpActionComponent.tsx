import { LAUNCH_STATUS, LbpLaunch } from '@honeypot/shared';
import dayjs from 'dayjs';
import Countdown from 'react-countdown';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { TokenSelector } from '@honeypot/shared';
import { Button, cn } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { debounce } from 'lodash';
import { wallet } from '@honeypot/shared';
import { trpcClient } from '@honeypot/shared/lib/trpc/trpc';

export const LbpActionComponent = observer(
  ({ lbpLaunch }: { lbpLaunch: LbpLaunch }) => {
    const launchStatus = lbpLaunch.launchStatus;
    const startsAt = lbpLaunch.startsAt;
    const endsAt = lbpLaunch.endsAt;
    const statusDisplay = lbpLaunch.launchStatusDisplay;

    const renderComponent = () => {
      switch (launchStatus) {
        case LAUNCH_STATUS.NOT_STARTED:
          return <LbpNotStartedComponent lbpLaunch={lbpLaunch} />;
        case LAUNCH_STATUS.STARTED:
          return <LbpStartedComponent lbpLaunch={lbpLaunch} />;
        case LAUNCH_STATUS.CLOSED:
          return <LbpClosedComponent lbpLaunch={lbpLaunch} />;
        case LAUNCH_STATUS.ENDED:
          return <LbpEndedComponent lbpLaunch={lbpLaunch} />;
        case LAUNCH_STATUS.CANCELLED:
          return <LbpCancelledComponent lbpLaunch={lbpLaunch} />;
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
        <div className=" w-full flex justify-between items-center">
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

const LbpStartedComponent = observer(
  ({ lbpLaunch }: { lbpLaunch: LbpLaunch }) => {
    const outputAmount = lbpLaunch.amountOut.toString();
    const inputDebounce = debounce((value: string) => {
      console.log('inputDebounce', value);
      lbpLaunch.setAmountIn(!!value ? value : '0');
    }, 300);

    const buyShares = () => {
      lbpLaunch.buyShares().then(() => {
        lbpLaunch.assetToken?.getBalance();
        lbpLaunch.shareToken?.getBalance();
        lbpLaunch.loadUserPurchasedShares();
        lbpLaunch.setAmountIn('0');
      });
    };

    useEffect(() => {
      if (wallet.account) {
        lbpLaunch.assetToken?.getBalance();
        lbpLaunch.shareToken?.getBalance();
        lbpLaunch.loadUserPurchasedShares();
      }
    }, [wallet.account]);

    return (
      <div className="bg-white rounded-[16px] border border-black p-4 text-center">
        <button
          onClick={() => {
            trpcClient.lbp.createLbpTransaction.mutate({
              tx_hash: '0x123',
              buy_amount: '0.01',
              lbp_address: '0x123',
              chain_id: 1,
              wallet_address: wallet.account as `0x${string}`,
            });
          }}
        >
          test
        </button>
        <div className="text-lg font-bold mb-2">Sale Started</div>
        <div>
          <div className="text-left text-sm text-[#4D4D4D]">
            <span>Balance: </span>{' '}
            {lbpLaunch.assetToken?.balance?.toString() ?? 0}
          </div>
          <div className="w-full text-sm text-[#4D4D4D] mb-4 md:flex items-center gap-2">
            {lbpLaunch.assetToken && (
              <div className="w-[150px]">
                <TokenSelector
                  value={lbpLaunch.assetToken}
                  onSelect={(token) => {
                    console.log(token);
                  }}
                  disableSelection={true}
                />
              </div>
            )}
            <div className="w-full flex flex-col items-end">
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
                    'border-none',
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
            </div>
          </div>
        </div>
        <div>
          <div className="text-left text-sm text-[#4D4D4D]">
            <span>Purchased: </span>{' '}
            {lbpLaunch.userPurchasedShares.toString() ?? 0}
          </div>
          <div className="text-sm  w-full  text-[#4D4D4D] mb-4 md:flex items-center gap-2">
            {lbpLaunch.shareToken && (
              <div className="w-[150px]">
                <TokenSelector
                  value={lbpLaunch.shareToken}
                  onSelect={(token) => {
                    console.log(token);
                  }}
                  disableSelection={true}
                />
              </div>
            )}
            <div className="w-full flex flex-col items-end">
              <Input
                disabled={true}
                type="text"
                value={lbpLaunch.amountOut?.toString() ?? ''}
                className={cn(
                  'text-right',
                  '!bg-transparent',
                  '[&_*]:!bg-transparent',
                  'data-[invalid=true]:!bg-transparent'
                )}
                classNames={{
                  inputWrapper: cn(
                    '!bg-transparent',
                    'border-none',
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
            </div>
          </div>
        </div>
        <Button onPress={buyShares}>Buy Shares</Button>
      </div>
    );
  }
);

const LbpNotStartedComponent = ({ lbpLaunch }: { lbpLaunch: LbpLaunch }) => {
  return (
    <div className="bg-white rounded-[16px] border border-black p-4 text-center">
      <div className="text-lg font-bold mb-2">Sale Not Started</div>
    </div>
  );
};

const LbpEndedComponent = ({ lbpLaunch }: { lbpLaunch: LbpLaunch }) => {
  return (
    <div className="bg-white rounded-[16px] border border-black p-4 text-center">
      <div className="text-lg font-bold mb-2">Sale Ended</div>
      <div className="text-sm text-[#4D4D4D] mb-4">
        The token sale has ended. Close this Sale to redeem tokens.
      </div>
      <div className="border-t border-black pt-4">
        <div className="flex w-full items-center justify-center text-sm">
          <Button
            className="bg-black text-white border-none rounded-lg"
            onPress={() => {
              lbpLaunch.closeSale();
            }}
          >
            Close Sale
          </Button>
        </div>
      </div>
    </div>
  );
};

const LbpCancelledComponent = ({ lbpLaunch }: { lbpLaunch: LbpLaunch }) => {
  return (
    <div className="bg-white rounded-[16px] border border-black p-4 text-center">
      <div className="text-lg font-bold mb-2">Sale Cancelled</div>
    </div>
  );
};

const LbpClosedComponent = observer(
  ({ lbpLaunch }: { lbpLaunch: LbpLaunch }) => {
    const redeemTokens = () => {
      lbpLaunch.redeemTokens().then(() => {
        lbpLaunch.assetToken?.getBalance();
        lbpLaunch.shareToken?.getBalance();
        lbpLaunch.loadUserPurchasedShares();
      });
    };
    return (
      <div className="bg-white rounded-[16px] border border-black p-4 text-center">
        <div className="text-lg font-bold mb-2">Sale Closed</div>
        <div className="flex flex-col items-center justify-between gap-4">
          <div className="text-sm text-[#4D4D4D]">
            Your Shares:{' '}
            <span>
              {lbpLaunch.userPurchasedShares.toFixed(5).toString() ?? 0}{' '}
              {lbpLaunch.shareToken?.symbol}
            </span>
          </div>
          <div>
            <Button
              className={cn(
                'bg-black text-white border-none rounded-lg',
                lbpLaunch.userPurchasedShares.eq(0) && 'opacity-50'
              )}
              isDisabled={lbpLaunch.userPurchasedShares.eq(0)}
              onPress={redeemTokens}
            >
              Redeem Tokens
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

export default LbpActionComponent;
