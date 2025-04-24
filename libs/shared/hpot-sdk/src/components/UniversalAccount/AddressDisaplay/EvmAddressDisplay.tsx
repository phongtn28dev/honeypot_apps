import { Tooltip } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { wallet } from '@honeypot/shared';
import { ethereumLogo } from '@honeypot/shared';
import Image from 'next/image';

export const EvmAddressDisplay = observer(function EvmAddressDisplay() {
  return (
    <Tooltip
      content={`EVM Address: ${wallet.universalAccount?.evmSmartAccountAddress}`}
      closeDelay={0}
    >
      <Image
        src={ethereumLogo}
        alt="Ethereum"
        width={20}
        height={20}
        className="rounded-full"
      />
    </Tooltip>
  );
});
