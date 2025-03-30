import { cn } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { wallet } from '@/services/wallet';
import { Tab, Tabs } from '@nextui-org/react';
import { NextLayoutPage } from '@/types/nextjs';
import { useCallback, useEffect, useState } from 'react';
import PoolsList from '@/components/algebra/pools/PoolsList';
import AquaberaList from '@/components/Aquabera/VaultLists/VaultLists';

const PoolsPage: NextLayoutPage = observer(() => {
  const [currentTab, setCurrentTab] = useState<'all' | 'my'>('all');

  if (!wallet.currentChain.supportDEX) {
    return (
      <div className="w-full flex items-center justify-center pb-6 sm:pb-12 overflow-x-hidden">
        <div className="text-center">
          <p className="text-lg">DEX is not supported on this chain</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 xl:px-0 font-gliker w-full mt-5">
      {/* TODO: Add pool bg img */}
      <Tabs
        classNames={{
          tab: 'px-2 sm:px-3 sm:h-10 text-xs sm:text-sm',
          base: 'relative w-full',
          cursor: 'bg-[#202020] !text-white/80 px-2 py-3',
          tabList:
            'flex rounded-[16px] border border-[#202020] bg-white shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020] p-2 sm:p-3 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 max-w-[90%] sm:max-w-none',
          panel: cn(
            'flex flex-col h-full w-full gap-y-4 items-center bg-[#FFCD4D] rounded-2xl text-[#202020]',
            'px-4 sm:px-8 pt-[70px] pb-[70px]',
            "bg-[url('/images/card-container/honey/honey-border.png'),url('/images/card-container/dark/bottom-border.svg')]",
            'bg-[position:-65px_top,_-85px_bottom]',
            'bg-[size:auto_65px,_auto_65px]',
            'bg-repeat-x',
            '!mt-0',
            'h-auto'
          ),
          tabContent: 'text-[#202020] text-sm sm:text-base',
        }}
        aria-label="Pool options"
      >
        <Tab
          key="aquabera"
          title={<span className="text-xs sm:text-base">POGE Vault</span>}
        >
          <AquaberaList />
        </Tab>
        <Tab
          key="algebra"
          title={
            <span className="text-xs sm:text-base">Concentrated Liquidity</span>
          }
        >
          <PoolsList />
        </Tab>
      </Tabs>
    </div>
  );
});

export default PoolsPage;
