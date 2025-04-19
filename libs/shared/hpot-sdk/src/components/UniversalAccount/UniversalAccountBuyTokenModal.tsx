import { observer } from 'mobx-react-lite';
import { EvmAddressDisplay } from './AddressDisaplay/EvmAddressDisplay';
import { DynamicFormatAmount, wallet } from '@honeypot/shared';
import { NotConnected } from './AccountStatus/NotConnected';
import { zeroAddress } from 'viem';
import { useMemo } from 'react';
import { SolAddressDisplay } from './AddressDisaplay/SolAddressDisplay';
import { OwnerAddressDisplay } from './AddressDisaplay/OwnerAddressDisplay';
export const UniversalAccountBuyTokenModal = observer(() => {
  const notConnected = useMemo(() => {
    return (
      !wallet.isInit ||
      !wallet.account ||
      wallet.account === zeroAddress ||
      !wallet.universalAccount
    );
  }, [wallet.account, wallet.universalAccount, wallet.isInit]);

  if (notConnected) {
    return <NotConnected />;
  }
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <h2>Universal Account</h2>
        <OwnerAddressDisplay />
        <EvmAddressDisplay />
        <SolAddressDisplay />
      </div>
      <div>
        Account Balance:{' '}
        {DynamicFormatAmount({
          amount: wallet.universalAccountAssetValueUSD?.totalAmountInUSD ?? 0,
          decimals: 5,
          endWith: 'USD',
        })}
      </div>
    </div>
  );
});
