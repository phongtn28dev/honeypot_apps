import { CardContainer, HoneyContainer } from '@/components/CardContianer';
import TokenLogo from '@/components/TokenLogo/TokenLogo';
import { useBitgetEvents } from '@/lib/algebra/graphql/clients/bitget_event';
import { DynamicFormatAmount } from '@/lib/algebra/utils/common/formatAmount';
import { Token } from '@/services/contract/token';
import { wallet } from '@/services/wallet';
import { Button } from '@/components/ui/button';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';

const REWARD_BERA = 400;

export const BitgetCampaign = observer(() => {
  const bitgetEventsData = useBitgetEvents(wallet.account.toLowerCase());
  const instructions = `Trade at least $10 in any of the following pools: 
  Berachain/WBERA, Xi/Honey, Q5/WBERA, or WBERA/Henlo. 
  ${REWARD_BERA} BERA will be distributed to all participants for each pool based on their volume.`;

  const poolNames: Record<string, string> = {
    '0xb228eefe1c9fecd615a242fd3ea99a4e129e5a78': 'Berachain/WBERA',
    '0xa61d8220f35947cce2f6bfc0405dbfca167336da': 'Xi/Honey',
    '0xe86c89a85e9d1b2d514477fee05d61603681f53a': 'Q5/WBERA',
    '0xc1014c1b2b131f87d4dd6ddfd9e3b0ab68fcd631': 'WBERA/Henlo',
  };

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center">
      <HoneyContainer className="max-w-[1200px]">
        <div className="flex flex-col gap-8 p-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-honey-gold">
              Bitget Trading Campaign
            </h1>
            <div className="m-5">📅 Mar 20, 8:00 - Apr 2, 8:00 (UTC)</div>
            <div className="text-lg text-black max-w-2xl mx-auto p-4 bg-yellow-200 rounded-lg">
              {instructions}
            </div>
          </div>

          {/* Total Volume Card */}
          <div className="bg-white rounded-2xl p-6 border border-honey-gold/20 shadow-lg">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-3 text-black">
                Total Event Trading Volume
              </h2>
              <p className="text-4xl font-bold text-honey-gold mb-4">
                {DynamicFormatAmount({
                  amount: bitgetEventsData?.totalVolumeUSD,
                  decimals: 2,
                  beginWith: '$',
                })}
              </p>
              <h2 className="text-xl font-semibold mb-3 text-black">
                Total Participants
              </h2>
              <p className="text-4xl font-bold text-honey-gold">
                {DynamicFormatAmount({
                  amount: bitgetEventsData?.totalFinishedUserCount,
                  decimals: 2,
                  beginWith: '',
                })}
              </p>
            </div>
          </div>

          {/* Pool Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-honey-gold">
              Pool Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bitgetEventsData?.eventPools.map((pool) => (
                <div
                  key={pool.pool.id}
                  className="bg-white rounded-xl p-6 border border-honey-gold/20 hover:border-honey-gold/40 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
                    <div className="flex items-center">
                      <TokenLogo
                        token={Token.getToken({
                          address: pool.pool.token0.id,
                        })}
                        size={24}
                        disableLink
                      />
                      <TokenLogo
                        token={Token.getToken({
                          address: pool.pool.token1.id,
                        })}
                        size={24}
                        disableLink
                      />
                    </div>
                    <div className="h-full flex gap-2 items-center">
                      <h3 className="text-xl font-medium text-honey-gold">
                        {poolNames[pool.pool.id] || pool.pool.id}
                      </h3>
                      <Link href={`/pool-detail/${pool.pool.id}`}>
                        <FaExternalLinkAlt className="hover:text-gold-primary" />
                      </Link>
                    </div>

                    <Link
                      href={`/swap?inputCurrency=${pool.pool.token0.id}&outputCurrency=${pool.pool.token1.id}`}
                    >
                      <Button className="rounded-[8px] border border-black bg-[#FFCD4D] p-2 text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none">
                        Swap
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col lg:flex-row lg:gap-2 justify-between">
                      <div className="flex justify-between items-center py-4 ">
                        <span className="text-black">Volume: </span>
                        <span className="text-lg font-medium text-honey-gold">
                          {DynamicFormatAmount({
                            amount: pool.totalVolumeUSD,
                            decimals: 2,
                            beginWith: '$',
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-black">Participants: </span>
                        <span className="text-lg font-medium text-honey-gold">
                          {DynamicFormatAmount({
                            amount: pool.totalFinishedUserCount,
                            decimals: 2,
                            beginWith: '',
                          })}
                        </span>
                      </div>
                    </div>
                    {pool.currentUser[0] && (
                      <div className="flex flex-col gap-2 bg-yellow-400 rounded-lg p-2">
                        <div className="flex flex-col lg:flex-row justify-between items-center py-2">
                          <span className="text-black">Your Volume</span>
                          <span className="text-lg font-medium text-honey-gold">
                            {DynamicFormatAmount({
                              amount: pool.currentUser[0].amountUSD,
                              decimals: 4,
                              beginWith: '$',
                            })}
                          </span>
                          {pool.currentUser[0].finished ? (
                            <span className="text-green-500">Finished</span>
                          ) : (
                            <span className="text-red-500">Not Finished</span>
                          )}
                        </div>
                        {pool.currentUser[0].finished && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-black">Estimated Reward</span>
                            <span className="text-lg font-medium text-honey-gold">
                              {DynamicFormatAmount({
                                amount:
                                  (Number(pool.currentUser[0].amountUSD) /
                                    pool?.totalVolumeUSD) *
                                  REWARD_BERA,
                                decimals: 2,
                                endWith: 'BERA',
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </HoneyContainer>
    </div>
  );
});

export default BitgetCampaign;
