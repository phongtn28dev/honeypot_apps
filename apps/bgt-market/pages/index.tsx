import { observer } from 'mobx-react-lite';
import { NextLayoutPage } from '@/types/nextjs';
import CardContainer from '@/components/CardContianer/v3';
import Button from '@/components/button/v3';
import {
  Order,
  OrderStatus,
  useRecentBuyOrdersQuery,
  useRecentOrdersQuery,
  useRecentSellOrdersQuery,
} from '@/lib/algebra/graphql/generated/graphql';
import Link from 'next/link';
import { wallet } from '@/services/wallet';
import { useBlockNumber } from 'wagmi';
import { useEffect, useState } from 'react';
import { watchBlockNumber } from 'viem/actions';
import { Address, zeroAddress } from 'viem';
import { ValidatedVaultAddresses } from '@/config/validatedVaultAddresses';
import {
  DropdownItem,
  DropdownTrigger,
  SelectItem,
  Switch,
} from '@nextui-org/react';
import { popmodal } from '@/services/popmodal';
import { PressEvent } from '@react-types/shared';
import { WarppedNextSelect } from '@/components/wrappedNextUI/Select/Select';
import SwapTransactionHistory from '@/components/SwapTransactionHistory';
import {
  BuyOrdersList,
  SellOrdersList,
} from '@/components/BGT-Vault/OrdersList';
import PostOrderModal from './new-order';
import { UserBgtVaults } from '@/components/BGT-Vault/UserBgtVaults';

const HomePage: NextLayoutPage = observer(() => {
  return (
    <div className="w-screen h-full p-2">
      <div className="lg:grid grid-cols-[1fr_400px] gap-2">
        <CardContainer className="col-start-2 lg:grid grid-cols-1 grid-rows-[1fr_1fr]">
          <UserBgtVaults />
          <PostOrderModal />
        </CardContainer>

        <CardContainer className="row-start-1 lg:grid grid-cols-1 grid-rows-[1fr_1fr]">
          <SellOrdersList />
          <BuyOrdersList />
        </CardContainer>
      </div>
    </div>
  );
});

export default HomePage;
