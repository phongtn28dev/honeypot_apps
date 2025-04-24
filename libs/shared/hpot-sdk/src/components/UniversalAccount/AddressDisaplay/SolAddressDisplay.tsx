import { Tooltip } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { wallet } from '@honeypot/shared';
import { solanaLogo } from '@honeypot/shared';
import Image from 'next/image';

export const SolAddressDisplay = observer(function SolAddressDisplay() {
  return (
    <Tooltip
      content={`Solana Address: ${wallet.universalAccount?.solanaSmartAccountAddress}`}
      closeDelay={0}
    >
      <Image
        src={solanaLogo}
        alt="Solana"
        width={20}
        height={20}
        className="rounded-full"
      />
    </Tooltip>
  );
});
