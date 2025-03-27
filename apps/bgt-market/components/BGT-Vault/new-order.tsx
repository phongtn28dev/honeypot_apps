import { observer } from 'mobx-react-lite';
import { NextLayoutPage } from '@/types/nextjs';
import CardContainer from '@/components/CardContianer/v3';
import Button from '@/components/button/v3';
import { OrderType } from '@/lib/algebra/graphql/generated/graphql';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { HoneyContainer } from '@/components/CardContianer';
import { WarppedNextSelect } from '@/components/wrappedNextUI/Select/Select';
import { SelectItem } from '@nextui-org/react';
import { wallet } from '@/services/wallet';
import { Address, formatEther, parseEther, zeroAddress } from 'viem';
import { simulateContract } from 'viem/actions';
import { useEffect, useMemo, useState } from 'react';
import { ValidatedVaultAddresses } from '@/config/validatedVaultAddresses';
import { useUserBgtVaults } from '@/lib/hooks/useUserBgtVaults';
import { WrappedToastify } from '@/lib/wrappedToastify';

type FormValues = {
  price: string;
  orderType: OrderType;
  vaultAddress?: string;
  orderBuyValue?: string;
};

export const BgtMarketPostOrderModal: NextLayoutPage = observer(() => {
  const { bgtVaults } = useUserBgtVaults();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      orderType: OrderType.BuyBgt,
    },
  });
  const [buyOrSell, setBuyOrSell] = useState<OrderType | undefined>(
    OrderType.BuyBgt
  );
  const [buyOrSelLoading, setBuyOrSellLoading] = useState<boolean>(false);
  const onSubmit = async (data: FormValues) => {
    setBuyOrSellLoading(true);
    try {
      if (OrderType.BuyBgt === data.orderType) {
        console.log('buy');
        const orderTransaction = wallet.contracts.bgtMarket.postBuyOrder(
          BigInt(Math.floor(Number(data.price) * 10000)),
          BigInt(parseEther(data.orderBuyValue ?? '0'))
        );

        await orderTransaction;
      } else {
        console.log('sell');
        const orderTransaction = wallet.contracts.bgtMarket.postSellOrder(
          BigInt(Math.floor(Number(data.price) * 10000)),
          (data.vaultAddress ?? zeroAddress) as Address
        );
        await orderTransaction;
      }
    } catch (e) {
      if (String(e).includes('RangeError')) {
        WrappedToastify.error({
          title: 'Price BGT per Bera too small',
          message: 'Need at least 1 BGT per Bera',
        });
      }
    }

    setBuyOrSellLoading(false);
  };

  return (
    <div className="w-full h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full rounded-[24px]  bg-white p-5 pt-3"
      >
        <div className="flex items-center gap-2">
          <span className="w-full text-black text-base md:text-xl font-bold text-center">
            Create Order
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-black">Order Type</label>
          <WarppedNextSelect
            isRequired
            items={Object.entries(OrderType)}
            defaultSelectedKeys={[Object.values(OrderType)[0]]}
            selectorIcon={<></>}
            selectionMode="single"
            onSelectionChange={(e) => {
              console.log(e);
              if ((e.currentKey as OrderType) === buyOrSell) {
                setBuyOrSell(undefined);
              } else {
                setBuyOrSell(e.currentKey as OrderType);
              }
            }}
            {...register('orderType')}
          >
            {Object.entries(OrderType).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </WarppedNextSelect>
        </div>

        {buyOrSell !== undefined && (
          <>
            <div className="flex flex-col gap-1 pt-[15px]">
              <label className="text-black">Price BERA Per BGT</label>
              <input
                type="text"
                {...register('price', { required: true })}
                className={
                  'w-full bg-white rounded-[12px] md:rounded-[16px] px-3 md:px-4 py-2 md:py-[18px] text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-sm md:text-base font-medium h-[40px] md:h-[60px]'
                }
                placeholder="Enter Price(>=1.0000)"
              />
              {errors.price && (
                <span className="text-red-500 text-sm">Price is required</span>
              )}
            </div>

            {buyOrSell === OrderType.BuyBgt && (
              <div className="flex flex-col gap-1 pt-[15px]">
                <label className="text-black">Buying Amount(Bera)</label>
                <input
                  type="text"
                  {...register('orderBuyValue', { required: true })}
                  className={
                    'w-full bg-white rounded-[12px] md:rounded-[16px] px-3 md:px-4 py-2 md:py-[18px] text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-sm md:text-base font-medium h-[40px] md:h-[60px]'
                  }
                  placeholder="Enter Buying Amount(>0.01)"
                />
                {errors.orderBuyValue && (
                  <span className="text-red-500 text-sm">Buying Amount</span>
                )}
              </div>
            )}

            {buyOrSell === OrderType.SellBgt && (
              <div className="flex flex-col gap-1 pt-[15px]">
                <label className="text-black">Vault</label>
                <WarppedNextSelect
                  isRequired
                  items={bgtVaults}
                  selectorIcon={<></>}
                  {...register('vaultAddress')}
                >
                  {bgtVaults.map((vault) => (
                    <SelectItem key={vault.address} value={vault.address}>
                      <span>{vault.name}</span>{' '}
                      <span>
                        {Number(
                          formatEther(BigInt(vault.userBgtInVault))
                        ).toFixed(5)}{' '}
                        BGT
                      </span>
                    </SelectItem>
                  ))}
                </WarppedNextSelect>
              </div>
            )}
          </>
        )}
        <Button
          type="submit"
          disabled={!wallet.walletClient || buyOrSelLoading}
          isLoading={buyOrSelLoading}
          className="w-full bg-black text-white font-bold rounded-[12px] md:rounded-[16px] px-3 py-2 md:py-[18px] border-2 border-black hover:bg-black/90 text-sm md:text-base h-[40px] md:h-[60px] mt-[10px]"
        >
          {!wallet.isInit ? 'Connect Wallet' : 'Create Order'}
        </Button>
      </form>
    </div>
  );
});

export const HeyBgtPostOrderModal: NextLayoutPage = observer(() => {
  const { bgtVaults } = useUserBgtVaults();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      orderType: OrderType.BuyBgt,
    },
  });
  const [buyOrSell, setBuyOrSell] = useState<OrderType | undefined>(
    OrderType.BuyBgt
  );
  const [buyOrSelLoading, setBuyOrSellLoading] = useState<boolean>(false);
  const onSubmit = async (data: FormValues) => {
    setBuyOrSellLoading(true);
    try {
      if (OrderType.BuyBgt === data.orderType) {
        const orderTransaction = wallet.contracts.heyBgt.postBuyOrder(
          BigInt(parseEther(Number(data.price).toFixed(18))),
          BigInt(parseEther(data.orderBuyValue ?? '0'))
        );

        await orderTransaction;
      } else {
        const orderTransaction = wallet.contracts.heyBgt.postSellOrder(
          Number(data.price),
          (data.vaultAddress ?? zeroAddress) as Address
        );
        await orderTransaction;
      }
    } catch (e) {
      if (String(e).includes('RangeError')) {
        WrappedToastify.error({
          title: 'Price BGT per Bera too small',
          message: 'Need at least 1 BGT per Bera',
        });
      }
    }

    setBuyOrSellLoading(false);
  };

  useEffect(() => {
    if (wallet.contracts.heyBgt) {
      wallet.contracts.heyBgt.getBeraPrice();
    }
  }, [wallet.contracts.heyBgt]);

  return (
    <div className="w-full h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full rounded-[24px]  bg-white p-5 pt-3"
      >
        <div className="flex items-center gap-2">
          <span className="w-full text-black text-base md:text-xl font-bold text-center">
            Create Order
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-black">Order Type</label>
          <WarppedNextSelect
            isRequired
            items={Object.entries(OrderType)}
            defaultSelectedKeys={[Object.values(OrderType)[0]]}
            selectorIcon={<></>}
            selectionMode="single"
            onSelectionChange={(e) => {
              if ((e.currentKey as OrderType) === buyOrSell) {
                setBuyOrSell(undefined);
              } else {
                setBuyOrSell(e.currentKey as OrderType);
              }
            }}
            {...register('orderType')}
          >
            {Object.entries(OrderType).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </WarppedNextSelect>
        </div>

        {buyOrSell !== undefined && (
          <>
            <div className="flex flex-col gap-1 pt-[15px]">
              <label className="text-black">Price Honey Per BGT</label>
              <input
                type="text"
                {...register('price', { required: true })}
                className={
                  'w-full bg-white rounded-[12px] md:rounded-[16px] px-3 md:px-4 py-2 md:py-[18px] text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-sm md:text-base font-medium h-[40px] md:h-[60px]'
                }
                placeholder={`Enter Price(>=${wallet.contracts.heyBgt?.beraprice?.toFixed(
                  4
                )})`}
              />
              {errors.price && (
                <span className="text-red-500 text-sm">Price is required</span>
              )}
            </div>

            {buyOrSell === OrderType.BuyBgt && (
              <div className="flex flex-col gap-1 pt-[15px]">
                <label className="text-black">Buying Amount(BGT)</label>
                <input
                  type="text"
                  {...register('orderBuyValue', { required: true })}
                  className={
                    'w-full bg-white rounded-[12px] md:rounded-[16px] px-3 md:px-4 py-2 md:py-[18px] text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-sm md:text-base font-medium h-[40px] md:h-[60px]'
                  }
                  placeholder="Enter Buying Amount(>0.01)"
                />
                {errors.orderBuyValue && (
                  <span className="text-red-500 text-sm">Buying Amount</span>
                )}
              </div>
            )}

            {buyOrSell === OrderType.SellBgt && (
              <div className="flex flex-col gap-1 pt-[15px]">
                <label className="text-black">Vault</label>
                <WarppedNextSelect
                  isRequired
                  items={bgtVaults}
                  selectorIcon={<></>}
                  {...register('vaultAddress')}
                >
                  {bgtVaults.map((vault) => (
                    <SelectItem key={vault.address} value={vault.address}>
                      <span>{vault.name}</span>{' '}
                      <span>
                        {Number(
                          formatEther(BigInt(vault.userBgtInVault))
                        ).toFixed(5)}{' '}
                        BGT
                      </span>
                    </SelectItem>
                  ))}
                </WarppedNextSelect>
              </div>
            )}
          </>
        )}
        <Button
          type="submit"
          disabled={!wallet.walletClient || buyOrSelLoading}
          isLoading={buyOrSelLoading}
          className="w-full bg-black text-white font-bold rounded-[12px] md:rounded-[16px] px-3 py-2 md:py-[18px] border-2 border-black hover:bg-black/90 text-sm md:text-base h-[40px] md:h-[60px] mt-[10px]"
        >
          {!wallet.isInit ? 'Connect Wallet' : 'Create Order'}
        </Button>
      </form>
    </div>
  );
});
