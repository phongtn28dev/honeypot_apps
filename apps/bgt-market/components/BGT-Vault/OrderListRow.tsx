import { ValidatedVaultAddresses } from '@/config/validatedVaultAddresses';
import { Order, OrderStatus } from '@/lib/algebra/graphql/generated/graphql';
import { BGTVault } from '@/services/contract/bgt-market/bgt-vault';
import { popmodal } from '@/services/popmodal';
import { wallet } from '@/services/wallet';
import { Button, SelectItem } from '@nextui-org/react';
import { cn } from '@nextui-org/theme';
import { PressEvent } from '@react-types/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatEther, parseEther } from 'viem';
import { watchBlockNumber } from 'viem/actions';
import CardContainer from '../CardContianer/v3';
import { WarppedNextSelect } from '../wrappedNextUI/Select/Select';
import { usePollingBlockNumber } from '@/lib/hooks/useBlockNumber';
import { UserBgtVaults } from './UserBgtVaults';
import { useUserBgtVaults } from '@/lib/hooks/useUserBgtVaults';

export const UserOrderListRow = observer(
  ({
    order,
    actionCallBack,
  }: {
    order: Order;
    actionCallBack?: () => void;
  }) => {
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
            {order.orderType}
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
            {(order.price / 10000).toFixed(4)} BERA
          </div>
        </td>
        <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
          <div className="flex flex-col sm:flex-row justify-end items-end gap-1">
            {(
              (Number(order.spentBalance) / Number(order.balance)) *
              100
            ).toFixed(2)}
            %
          </div>
        </td>
        <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap hidden sm:table-cell">
          <div>
            {order.dealer.id.toLowerCase() === wallet.account.toLowerCase() &&
              order.status === 'Pending' && (
                <Button
                  disabled={!wallet.walletClient}
                  isDisabled={!wallet.walletClient}
                  onPress={() => {
                    wallet.contracts.bgtMarket
                      .closeOrder(BigInt(order.id))
                      ?.then(() => {
                        order.status = OrderStatus.Closed;
                        actionCallBack?.();
                      });
                  }}
                >
                  {!wallet.walletClient ? 'Connect Wallet' : 'Close Order'}
                </Button>
              )}

            {!(
              order.dealer.id.toLowerCase() === wallet.account.toLowerCase()
            ) &&
              order.status === 'Pending' && (
                <FillBuyOrderModalButton order={order as Order} />
              )}
          </div>
        </td>
      </tr>
    );
  }
);

export const BuyOrderListRow = observer(
  ({
    order,
    actionCallBack,
  }: {
    order: Order;
    actionCallBack?: () => void;
  }) => {
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
            {(order.price / 10000).toFixed(4)} BERA
          </div>
        </td>
        <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
          <div className="flex flex-col sm:flex-row justify-end items-end gap-1">
            {(
              (Number(order.spentBalance) / Number(order.balance)) *
              100
            ).toFixed(2)}
            %
          </div>
        </td>
        <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap hidden sm:table-cell">
          <div>
            {order.dealer.id.toLowerCase() === wallet.account.toLowerCase() &&
              order.status === 'Pending' && (
                <Button
                  disabled={!wallet.walletClient}
                  isDisabled={!wallet.walletClient}
                  onPress={() => {
                    wallet.contracts.bgtMarket
                      .closeOrder(BigInt(order.id))
                      ?.then(() => {
                        order.status = OrderStatus.Closed;
                        actionCallBack?.();
                      });
                  }}
                >
                  {!wallet.walletClient ? 'Connect Wallet' : 'Close Order'}
                </Button>
              )}

            {!(
              order.dealer.id.toLowerCase() === wallet.account.toLowerCase()
            ) &&
              order.status === 'Pending' && (
                <FillBuyOrderModalButton order={order as Order} />
              )}
          </div>
        </td>
      </tr>
    );
  }
);

export const SellOrderListRow = observer(
  ({
    order,
    actionCallBack,
  }: {
    order: Order;
    actionCallBack?: () => void;
  }) => {
    const [orderVaultBgt, setOrderVaultBgt] = useState<string>('');
    const [rewardVault, setRewardVault] = useState<BGTVault | undefined>(
      undefined
    );
    const { block } = usePollingBlockNumber();

    useEffect(() => {
      if (!order.vaultAddress || order.status !== OrderStatus.Pending) return;
      setRewardVault(
        BGTVault.getBgtVault({
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
    }, [order.status, orderVaultBgt, order]);

    useEffect(() => {
      if (!rewardVault) return;
      rewardVault
        .readAddressBgtInVault(order.dealer.id as Address)
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
            Sell
            {order.status !== OrderStatus.Pending && `(Order ${order.status})`}
          </div>
        </td>
        <td className="py-2 px-2 sm:px-4 text-sm sm:text-base font-mono whitespace-nowrap hidden md:table-cell">
          <div className="flex items-center gap-2">{getSaleBGT()}</div>
        </td>
        <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
          <div className="flex flex-col sm:flex-row justify-end items-end gap-1">
            {(order.price / 10000).toFixed(4)} BERA
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
                    wallet.contracts.bgtMarket
                      .closeOrder(BigInt(order.id))
                      ?.then(() => actionCallBack);
                  }}
                >
                  {!wallet.walletClient ? 'Connect Wallet' : 'Close Order'}
                </Button>
              )}

            {!(
              order.dealer.id.toLowerCase() === wallet.account.toLowerCase()
            ) &&
              order.status === 'Pending' && (
                <Button
                  disabled={!wallet.walletClient}
                  isDisabled={!wallet.walletClient}
                  onPress={() => {
                    wallet.contracts.bgtMarket
                      .fillSellOrder(
                        BigInt(order.id),
                        BigInt(
                          (order.price / 10000) * Number(orderVaultBgt) * 1.1
                        )
                      )
                      ?.then(() => actionCallBack);
                  }}
                >
                  {!wallet.walletClient ? 'Connect Wallet' : 'Fill Order'}
                </Button>
              )}
          </div>
        </td>
      </tr>
    );
  }
);

const FillBuyOrderModalButton = observer(
  ({
    order,
    actionCallBack,
  }: {
    order: Order;
    actionCallBack?: () => void;
  }) => {
    const isWallet = useMemo(() => {
      return wallet.walletClient;
    }, [wallet.isInit, wallet.walletClient]);
    const handleClick = (e: PressEvent) => {
      popmodal.openModal({
        content: (
          <FillBuyOrderModal order={order} actionCallBack={actionCallBack} />
        ),
        boarderLess: true,
      });
    };

    return (
      <Button
        disabled={!isWallet}
        isDisabled={!isWallet}
        onPress={(e) => {
          handleClick(e);
        }}
      >
        {!wallet.walletClient ? 'Connect Wallet' : 'Fill Order'}
      </Button>
    );
  }
);

const FillBuyOrderModal = ({
  order,
  actionCallBack,
}: {
  order: Order;
  actionCallBack?: () => void;
}) => {
  const [selectedVault, setSelectedVault] = useState<Address | undefined>(
    undefined
  );
  const { bgtVaults } = useUserBgtVaults();

  const handleClick = () => {
    if (!selectedVault) return;
    wallet.contracts.bgtMarket
      .fillBuyOrder(BigInt(order.id), selectedVault)
      ?.then(() => actionCallBack);
  };

  return (
    <CardContainer className="flex flex-col gap-2">
      <div className="min-w-[500px] flex gap-2 flex-col">
        <label>Vault Address</label>
        <WarppedNextSelect
          isRequired
          items={bgtVaults}
          onSelectionChange={(e) => {
            setSelectedVault(e.currentKey?.toLowerCase() as Address);
          }}
        >
          {bgtVaults.map((vault) => (
            <SelectItem key={vault.address} value={vault.address}>
              {vault.name}(
              {Number(formatEther(BigInt(vault.userBgtInVault))).toFixed(5)})
              BGT
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
