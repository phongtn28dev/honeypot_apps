import { observer } from 'mobx-react-lite';
import { NextLayoutPage } from '@/types/nextjs';
import CardContainer from '@/components/CardContianer/v3';
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
