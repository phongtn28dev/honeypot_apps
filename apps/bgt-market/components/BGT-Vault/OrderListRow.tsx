import { ValidatedVaultAddresses } from '@/config/validatedVaultAddresses';
import { Order, OrderStatus } from '@/lib/algebra/graphql/generated/graphql';
import { BGTVault } from '@/services/contract/bgt-market/bgt-vault';
import { popmodal } from '@/services/popmodal';
import { wallet } from '@/services/wallet';
import { Button, SelectItem } from '@nextui-org/react';
import { cn } from '@nextui-org/theme';
import { PressEvent } from '@react-types/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { Address, formatEther } from 'viem';
import { watchBlockNumber } from 'viem/actions';
import CardContainer from '../CardContianer/v3';
import { WarppedNextSelect } from '../wrappedNextUI/Select/Select';
import { usePollingBlockNumber } from '@/lib/hooks/useBlockNumber';

export const BuyOrderListRow = observer(({ order }: { order: Order }) => {
  return (
    <tr key={order.id} className="hover:bg-[#2a2a2a] transition-colors">
      <td className="py-2 px-2 sm:px-4 text-sm sm:text-base font-mono whitespace-nowrap">
        <div
          className={cn(
            'flex items-center gap-2',
            order.status === OrderStatus.Closed && 'text-red-500',
            order.status === OrderStatus.Filled && 'text-green-500'
          )}
        >
          Buy
          {order.status !== OrderStatus.Pending && `(Order ${order.status})`}
        </div>
      </td>
      <td className="py-2 px-2 sm:px-4 text-sm sm:text-base font-mono whitespace-nowrap hidden md:table-cell">
        <div className="flex items-center gap-2">
          {formatEther(order.balance)}{' '}
          {wallet?.currentChain?.nativeToken?.symbol ?? 'BERA'}
        </div>
      </td>
      <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
        <div className="flex flex-col sm:flex-row justify-end items-end gap-1">
          {(order.price / 10000).toFixed(4)}
        </div>
      </td>
      <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
        <div className="flex flex-col sm:flex-row justify-end items-end gap-1">
          {((order.spentBalance / order.balance) * 100).toFixed(2)}%
        </div>
      </td>
      <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap hidden sm:table-cell">
        <div>
          {order.dealer.id.toLowerCase() === wallet.account.toLowerCase() &&
            order.status === 'Pending' && (
              <Button
                disabled={!wallet.walletClient || !wallet.isInit}
                isDisabled={!wallet.walletClient || !wallet.isInit}
                onPress={() => {
                  wallet.contracts.bgtMarket.closeOrder(BigInt(order.id));
                }}
              >
                {!wallet.walletClient ? 'Connect Wallet' : 'Close Order'}
              </Button>
            )}

          {!(order.dealer.id.toLowerCase() === wallet.account.toLowerCase()) &&
            order.status === 'Pending' && (
              <Button
                disabled={!wallet.walletClient || !wallet.isInit}
                isDisabled={!wallet.walletClient || !wallet.isInit}
                onPress={() => {
                  wallet.contracts.bgtMarket.fillSellOrder(BigInt(order.id));
                }}
              >
                {!wallet.walletClient ? 'Connect Wallet' : 'Fill Order'}
              </Button>
            )}
        </div>
      </td>
    </tr>
  );
});

export const SellOrderListRow = observer(({ order }: { order: Order }) => {
  const [orderVaultBgt, setOrderVaultBgt] = useState<string>('');
  const [rewardVault, setRewardVault] = useState<BGTVault | undefined>(
    undefined
  );
  const { block } = usePollingBlockNumber();

  useEffect(() => {
    if (!order.vaultAddress || order.status !== OrderStatus.Pending) return;
    setRewardVault(
      new BGTVault({
        address: order.vaultAddress.toLowerCase() as Address,
      })
    );
  }, [order.vaultAddress, order.status]);

  const getSaleBGT = useCallback(() => {
    switch (order.status) {
      case OrderStatus.Closed:
        return '0';
      case OrderStatus.Filled:
        return (
          Number(formatEther(BigInt(order.spentBalance))) /
          (order.price / 10000)
        ).toFixed(4);
      case OrderStatus.Pending:
        return Number(formatEther(BigInt(orderVaultBgt))).toFixed(4);
      default:
        return '0';
    }
  }, []);

  useEffect(() => {
    if (!rewardVault) return;
    rewardVault
      .readCurrentUserBgtInVault(order.dealer.id as Address)
      .then((res) => {
        setOrderVaultBgt(res.toString());
      });
  }, [rewardVault, block]);

  return (
    <tr key={order.id} className="hover:bg-[#2a2a2a] transition-colors">
      <td className="py-2 px-2 sm:px-4 text-sm sm:text-base font-mono whitespace-nowrap">
        <div
          className={cn(
            'flex items-center gap-2',
            order.status === OrderStatus.Closed && 'text-red-500',
            order.status === OrderStatus.Filled && 'text-green-500'
          )}
        >
          Buy
          {order.status !== OrderStatus.Pending && `(Order ${order.status})`}
        </div>
      </td>
      <td className="py-2 px-2 sm:px-4 text-sm sm:text-base font-mono whitespace-nowrap hidden md:table-cell">
        <div className="flex items-center gap-2">{getSaleBGT()}</div>
      </td>
      <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
        <div className="flex flex-col sm:flex-row justify-end items-end gap-1">
          {(order.price / 10000).toFixed(4)}
        </div>
      </td>
      <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
        <div className="flex flex-col sm:flex-row justify-end items-end gap-1">
          {((order.price / 10000) * Number(getSaleBGT())).toFixed(4)}{' '}
          {wallet?.currentChain?.nativeToken?.symbol ?? 'BERA'}
        </div>
      </td>
      <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap hidden sm:table-cell">
        <div>
          {order.dealer.id.toLowerCase() === wallet.account.toLowerCase() &&
            order.status === 'Pending' && (
              <Button
                disabled={!wallet.walletClient || !wallet.isInit}
                isDisabled={!wallet.walletClient || !wallet.isInit}
                onPress={() => {
                  wallet.contracts.bgtMarket.closeOrder(BigInt(order.id));
                }}
              >
                {!wallet.walletClient ? 'Connect Wallet' : 'Close Order'}
              </Button>
            )}

          {!(order.dealer.id.toLowerCase() === wallet.account.toLowerCase()) &&
            order.status === 'Pending' && (
              <FillBuyOrderModalButton order={order as Order} />
              // <Button
              //   disabled={!wallet.walletClient || !wallet.isInit}
              //   isDisabled={!wallet.walletClient || !wallet.isInit}
              //   onPress={() => {
              //     wallet.contracts.bgtMarket.fillBuyOrder(
              //       BigInt(order.id),
              //       zeroAddress
              //     );
              //   }}
              // >
              //   {!wallet.walletClient ? "Connect Wallet" : "Fill Order"}
              // </Button>
            )}
        </div>
      </td>
    </tr>
  );
});

const FillBuyOrderModalButton = ({ order }: { order: Order }) => {
  const handleClick = (e: PressEvent) => {
    popmodal.openModal({
      content: <FillBuyOrderModal order={order} />,
      boarderLess: true,
    });
  };

  return (
    <Button
      disabled={!wallet.walletClient || !wallet.isInit}
      isDisabled={!wallet.walletClient || !wallet.isInit}
      onPress={(e) => {
        handleClick(e);
      }}
    >
      {!wallet.walletClient ? 'Connect Wallet' : 'Fill Order'}
    </Button>
  );
};

const FillBuyOrderModal = ({ order }: { order: Order }) => {
  const [selectedVault, setSelectedVault] = useState<Address | undefined>(
    undefined
  );

  const handleClick = () => {
    if (!selectedVault) return;
    wallet.contracts.bgtMarket.fillBuyOrder(BigInt(order.id), selectedVault);
  };

  return (
    <CardContainer className="flex flex-col gap-2">
      <div className="min-w-[500px] flex gap-2 flex-col">
        <label>Vault Address</label>
        <WarppedNextSelect
          isRequired
          items={Object.entries(ValidatedVaultAddresses)}
          defaultSelectedKeys={[Object.keys(ValidatedVaultAddresses)[0]]}
          onSelectionChange={(e) => {
            setSelectedVault(e.currentKey?.toLowerCase() as Address);
          }}
        >
          {Object.entries(ValidatedVaultAddresses).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}({key})
            </SelectItem>
          ))}
        </WarppedNextSelect>

        <Button
          disabled={!wallet.walletClient || !wallet.isInit}
          isDisabled={!wallet.walletClient || !wallet.isInit}
          onPress={() => {
            handleClick();
          }}
        >
          {!wallet.walletClient ? 'Connect Wallet' : 'Fill Order'}
        </Button>
      </div>
    </CardContainer>
  );
};
