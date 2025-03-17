import { cn } from '@/lib/utils';

import { Tabs } from '@nextui-org/react';
import rhinoLogo from '@/public/images/partners/rhino-finance-logo.svg';
import { Tab } from '@nextui-org/react';
import Image from 'next/image';
import OrbiterBridge from './OrbiterBridge';
import StargateBridge from './StargateBridge';

export default function Bridge() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 xl:px-0 font-gliker w-full">
      {/* TODO: Add pool bg img */}
      <Tabs
        classNames={{
          tab: 'h-12',
          base: 'relative w-full',
          cursor: 'bg-[#202020] !text-white/80 px-2 py-3',
          tabList:
            'flex rounded-[16px] border border-[#202020] bg-white shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020] p-3 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10',
          // TODO: Update top border img
          panel: cn(
            'flex flex-col h-full w-full gap-y-4 items-center bg-[#FFCD4D] rounded-2xl text-[#202020]',
            'px-8 pt-[70px] pb-[70px]',
            "bg-[url('/images/card-container/honey/honey-border.png'),url('/images/card-container/dark/bottom-border.svg')]",
            'bg-[position:-65px_top,_-85px_bottom]',
            'bg-[size:auto_65px,_auto_65px]',
            'bg-repeat-x',
            '!mt-0',
            'h-auto'
          ),
          tabContent: 'text-[#202020]',
        }}
      >
        <Tab key="orbiter" title="Orbiter">
          <OrbiterBridge />
        </Tab>
        <Tab key="stargate" title="Stargate">
          <StargateBridge />
        </Tab>
        <Tab
          key="rhino"
          href="https://app.rhino.fi/bridge/?refId=DeFi_HPOT&token=USDC&chainOut=BERACHAIN&chainIn=ETHEREUM"
          target="_blank"
          title={
            <div className="flex items-center gap-2">
              <Image src={rhinoLogo} alt="Rhino" width={100} height={100} />
              <span>Rhino</span>
            </div>
          }
        ></Tab>
      </Tabs>
    </div>
  );
}
