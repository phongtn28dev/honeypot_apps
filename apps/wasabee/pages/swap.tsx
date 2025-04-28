import React from 'react';
import { observe } from 'mobx';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { chart } from '@honeypot/shared/services';
import { observer } from 'mobx-react-lite';
import { wallet } from '@honeypot/shared';
import { useSearchParams } from 'next/navigation';
import { itemPopUpVariants } from '@/lib/animation';
import { DarkContainer } from '@/components/CardContianer';
import V3SwapCard from '@/components/algebra/swap/V3SwapCard';
import KlineChart from './launch-detail/components/KlineChart';
import { LoadingDisplay } from '@/components/LoadingDisplay/LoadingDisplay';
import SwapTransactionHistory from '@/components/SwapTransactionHistory';
import { Tab, Tabs } from '@nextui-org/react';
import { cn } from '@/lib/tailwindcss';
import { UniversalAccountBuyTokenModal } from '@honeypot/shared';

const SwapPage = observer(() => {
  const inputCurrency = useSearchParams()?.get('inputCurrency');
  const outputCurrency = useSearchParams()?.get('outputCurrency');

  const isInit = wallet.isInit;

  if (!wallet.currentChain?.supportDEX) {
    return (
      <div className="w-full flex items-center justify-center pb-6 sm:pb-12 overflow-x-hidden">
        <div className="text-center">
          <p className="text-lg">DEX is not supported on this chain</p>
        </div>
      </div>
    );
  }

  const defaultOutputToken = wallet.currentChain?.validatedTokens?.find(
    (token) => token.isStableCoin
  )?.address;

  return isInit ? (
    <div className="w-full flex items-center justify-center pb-6 sm:pb-12 pt-8">
      <div className="w-full xl:mx-auto xl:max-w-[1200px] 2xl:max-w-[1500px] px-2 sm:px-4 md:px-8 xl:px-0 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {chart.showChart && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemPopUpVariants}
            transition={{ duration: 0.5 }}
            className="w-full col-span-2 lg:col-span-1"
          >
            <DarkContainer>
              <KlineChart height={479} />
            </DarkContainer>
          </motion.div>
        )}

        <motion.div
          variants={itemPopUpVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full flex flex-col items-center justify-start col-span-2 lg:col-span-1 overflow-visible"
        >
          <Tabs
            destroyInactiveTabPanel={false}
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
          >
            <Tab key="swap" title="Swap">
              <V3SwapCard
                bordered={false}
                fromTokenAddress={inputCurrency ?? undefined}
                toTokenAddress={outputCurrency ?? defaultOutputToken}
                isUpdatingPriceChart={true}
              />
            </Tab>
            <Tab key="universal" title="Universal Account">
              <UniversalAccountBuyTokenModal />
            </Tab>
          </Tabs>
        </motion.div>

        <motion.div
          variants={itemPopUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="w-full col-span-2 h-full"
        >
          <SwapTransactionHistory />
        </motion.div>
      </div>
    </div>
  ) : (
    <LoadingDisplay />
  );
});

export default SwapPage;
