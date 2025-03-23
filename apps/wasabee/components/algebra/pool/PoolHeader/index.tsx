import CurrencyLogo from '@/components/algebra/common/CurrencyLogo';
import PageTitle from '@/components/algebra/common/PageTitle';
import { Skeleton } from '@/components/algebra/ui/skeleton';
import TokenLogo from '@/components/TokenLogo/TokenLogo';
import { useCurrency } from '@/lib/algebra/hooks/common/useCurrency';
import { formatPercent } from '@/lib/algebra/utils/common/formatPercent';
import { AlgebraPoolContract } from '@/services/contract/algebra/algebra-pool-contract';
import { Address } from 'viem';
import { Token } from '@/services/contract/token';
import { Pool } from '@cryptoalgebra/sdk';
import { observer } from 'mobx-react-lite';
import { Button, Link } from '@nextui-org/react';

interface PoolHeaderProps {
  pool: Pool | null;
  poolId: Address | null;
  token0: Token | null;
  token1: Token | null;
}

const PoolHeader = observer(
  ({ pool, token0, token1, poolId }: PoolHeaderProps) => {
    const poolFee = pool && formatPercent.format(pool.fee / 10_00000);

    return (
      <div className="flex items-center w-full gap-3.5">
        <div className="flex">
          <div className="z-10">
            {token0?.address && (
              <TokenLogo
                size={40}
                token={Token.getToken({
                  address: token0.address,
                })}
              />
            )}
          </div>
          <div className="-ml-4">
            {token1?.address && (
              <TokenLogo
                size={40}
                token={Token.getToken({
                  address: token1.address,
                })}
              />
            )}
          </div>
        </div>

        {/* TODO: bg color  */}
        {token0?.symbol && token1?.symbol ? (
          <PageTitle title={`${token0?.symbol} / ${token1?.symbol}`}>
            <span className="hidden sm:inline px-3 py-2 font-medium rounded-full text-[#479FFF] border border-[#E18A20]/40 bg-[#E18A20]/20">{`${poolFee}`}</span>{' '}
            <Link
              href={`/swap?inputCurrency=${token0.address}&outputCurrency=${token1.address}`}
            >
              <Button color="primary" className="w-full lg:w-auto">
                Swap
              </Button>
            </Link>
            <Link href={`/new-position/${poolId}`}>
              <Button color="primary" className="w-full lg:w-auto">
                Create Position
              </Button>
            </Link>
          </PageTitle>
        ) : (
          <Skeleton className="w-[200px] h-[40px] bg-card" />
        )}
      </div>
    );
  }
);

export default PoolHeader;
