import { Tooltip } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { wallet } from '@honeypot/shared';
import { ethereumLogo } from '@honeypot/shared';
import Image from 'next/image';
import { Wallet } from 'lucide-react';

export const OwnerAddressDisplay = observer(function OwnerAddressDisplay() {
  return (
    <Tooltip
      content={`Owner Address: ${wallet.universalAccount?.ownerAddress}`}
      closeDelay={0}
    >
      <Wallet className="size-[20px] bg-white rounded-full text-black p-[2px]" />
    </Tooltip>
  );
});
