import { observer } from 'mobx-react-lite';
import { EvmAddressDisplay } from './AddressDisaplay/EvmAddressDisplay';
import { DynamicFormatAmount, wallet } from '@honeypot/shared';
import { NotConnected } from './AccountStatus/NotConnected';
import { zeroAddress } from 'viem';
import { useMemo, useState } from 'react';
import { SolAddressDisplay } from './AddressDisaplay/SolAddressDisplay';
import { OwnerAddressDisplay } from './AddressDisaplay/OwnerAddressDisplay';
import { BuyTokenSelection } from './BuyTokenSelection';
import { Token } from '../../lib/contract';
import buyWithUniversalAccountService from '../../services/particleUniversalAccount/buyWithUniversalAccountService';
import { Button } from '../button';
import Image from 'next/image';
import { particleIcon } from '../../assets/images/partners';
import { ChainNotSupport } from './AccountStatus/ChainNotSupport';
export const UniversalAccountBuyTokenModal = observer(() => {
  const notConnected = useMemo(() => {
    const isNotConnected =
      !wallet.isInit ||
      !wallet.account ||
      wallet.account === zeroAddress ||
      !wallet.universalAccount;

    return isNotConnected;
  }, [
    wallet.isInit,
    wallet.account,
    wallet.universalAccount,
    wallet.universalAccount?.accountUsdValue,
  ]);

  if (!wallet.currentChain.supportUniversalAccount) {
    return <ChainNotSupport />;
  }

  if (notConnected) {
    return <NotConnected />;
  }

  return (
    <div className="flex flex-col relative bg-white custom-dashed px-[18px] py-6 w-full gap-y-4">
      <div className="w-full flex items-center justify-between gap-x-2">
        <h2 className="font-bold">Universal Account</h2>
        <div className="flex items-center gap-x-2">
          <OwnerAddressDisplay />
          <EvmAddressDisplay />
          <SolAddressDisplay />
        </div>
      </div>
      <div className="flex justify-between items-center gap-x-2">
        <span className="font-bold">Account Balance:</span>{' '}
        <span>
          {DynamicFormatAmount({
            amount: wallet.universalAccount?.accountUsdValue ?? 0,
            decimals: 5,
            endWith: 'USD',
          })}
        </span>
      </div>
      <div className="">Buy Token with Universal Account</div>
      <BuyTokenSelection />
      <div className="text-red-500">
        {buyWithUniversalAccountService.errorText}
      </div>
      <Button
        disabled={!!buyWithUniversalAccountService.errorText}
        isDisabled={!!buyWithUniversalAccountService.errorText}
        onPress={() =>
          buyWithUniversalAccountService.buyToken &&
          wallet.universalAccount?.buyToken(
            buyWithUniversalAccountService.buyToken,
            buyWithUniversalAccountService.buyTokenAmount
          )
        }
      >
        Buy Token
      </Button>
      <div className="w-full flex items-center gap-x-2 justify-center">
        <Image
          src={particleIcon.default}
          alt="particle"
          width={50}
          height={50}
        />
        <div>
          <div>Powered by</div>
          <div>Particle</div>
        </div>
      </div>
    </div>
  );
});
