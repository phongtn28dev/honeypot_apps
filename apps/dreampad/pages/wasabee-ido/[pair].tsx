'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CardContainer from '@/components/CardContianer/v3';
import { useRouter } from 'next/router';
import { Address } from 'viem';
import { networksMap } from '@honeypot/shared';
import { DEFAULT_CHAIN_ID } from '@/config/algebra/default-chain-id';
import { DynamicFormatAmount } from '@honeypot/shared';
import { observer } from 'mobx-react-lite';
import { WasabeeIDO } from '@honeypot/shared';
import WasabeeIDOActionComponent from './WasabeeIDOActionComponent';
import { useWasabeeIDO } from '@honeypot/shared';
import BigNumber from 'bignumber.js';
import { wasabeeIDOmetadata } from '@honeypot/shared';

const WasabeeIDOPage = observer(() => {
  const router = useRouter();
  const { pair: pairAddress } = router.query;
  const { data, loading, error, refetch } = useWasabeeIDO(
    pairAddress?.toString().toLowerCase() as Address
  );
  const [wasabeeIDO, setWasabeeIDO] = useState<WasabeeIDO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (pairAddress) {
      const ido = new WasabeeIDO({
        address: pairAddress.toString().toLowerCase() as Address,
      });
      ido.loadOnchainData().then(() => {
        setWasabeeIDO(ido);
      });
    }
  }, [pairAddress]);

  const totalPages = Math.ceil(
    (data?.idopools[0]?.purchases?.length ?? 0) / pageSize
  );
  const paginatedPurchases = data?.idopools[0]?.purchases?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen relative w-full font-gliker">
      <div className="container mx-auto max-w-[1520px] space-y-[72px]">
        <CardContainer showBottomBorder={false}>
          <div className="w-full lg:grid lg:grid-cols-5 gap-8 p-8">
            <div className="w-full space-y-4 lg:col-span-2 lg:pr-5 mb-5">
              <div className="space-y-2">
                <div className="flex justify-center items-center min-w-[74px] px-3 h-[32px] bg-white rounded-[4px] border-[0.75px] border-[#202020] shadow-[1px_1px_0px_0px_#000] text-[14px]">
                  {wasabeeIDO?.idoToken?.symbol}
                </div>

                <h1 className="text-[30px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                  {wasabeeIDO?.idoToken?.name}
                </h1>
                <p className="text-[#4D4D4D]">
                  {wasabeeIDOmetadata.tokenDescription}
                </p>
              </div>

              <div className="rounded-[16px] border border-black bg-white shadow-[4px_4px_0px_0px_#D29A0D] p-4">
                <div className="divide-y divide-black">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#4D4D4D] text-xs">
                      Token Sale Type
                    </span>
                    <div className="text-[#202020] text-base flex items-center gap-1">
                      IDO
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#4D4D4D] text-xs">
                      Network Chain
                    </span>
                    <div className="text-[#202020] text-base flex items-center gap-1">
                      {
                        networksMap[wasabeeIDO?.chainId ?? DEFAULT_CHAIN_ID]
                          .chain.name
                      }
                      <Image
                        src={
                          networksMap[wasabeeIDO?.chainId ?? DEFAULT_CHAIN_ID]
                            .iconUrl
                        }
                        alt="chain"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#4D4D4D] text-xs">
                      Launch Partner
                    </span>
                    <div className="text-[#202020] text-base flex items-center gap-1 text-right">
                      Honeypot Finance
                      <Image
                        src={wasabeeIDOmetadata.tokenIcon}
                        alt="honeypot"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#4D4D4D] text-xs">Status</span>
                    <div className="text-[#202020] text-base flex items-center gap-1">
                      {wasabeeIDO?.idoStatusDisplay}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Logo */}
            <div className="relative w-full h-[400px] object-contain col-span-3 lg:pl-[50px]">
              <Image
                src={wasabeeIDOmetadata.tokenIcon}
                alt="Logo"
                className="absolute h-[150px] w-[150px] object-cover top-[50%] left-[50%] lg:left-[0px] translate-x-[-50%] lg:translate-x-[-10%] translate-y-[-50%] z-10 rounded-full border-amber-300 border-[1rem] bg-amber-300 "
                width={500}
                height={500}
                priority
                onError={(e) => {
                  e.currentTarget.src = '/images/empty-logo.png';
                }}
              />
              <Image
                src={wasabeeIDOmetadata.tokenBanner}
                alt="Banner"
                onError={(e) => {
                  e.currentTarget.src = '/images/homepage.png';
                }}
                className="relative w-full h-full object-cover col-span-3"
                width={500}
                height={500}
                priority
              />
            </div>
          </div>
        </CardContainer>

        <CardContainer
          className="bg-transparent border-3 border-[#FFCD4D] px-8 grid grid-cols-6 gap-y-7 gap-x-6 items-start"
          showBottomBorder={false}
        >
          <CardContainer className="col-span-6 lg:col-span-4">
            <div className="space-y-6 w-full">
              <div className="lg:grid lg:grid-cols-[220px_1fr] gap-6 items-start h-full">
                <div className="space-y-4 mb-2">
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] hover:shadow-[2px_2px_0px_0px_#D29A0D] transition-shadow">
                    <div className="text-sm text-[#4D4D4D] mb-2 text-center">
                      Price per {wasabeeIDO?.idoToken?.symbol}
                    </div>
                    <div className="text-[24px] text-[#4D4D4D]text-shadow-[1.481px_2.963px_0px_#AF7F3D] text-stroke-1 text-stroke-black text-center">
                      {DynamicFormatAmount({
                        amount: wasabeeIDO?.priceInETH.toString() ?? 0,
                        decimals: 2,
                        endWith: 'BERA',
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] hover:shadow-[2px_2px_0px_0px_#D29A0D] transition-shadow">
                    <div className="text-sm text-[#4D4D4D] mb-2 text-center">
                      Total Amount
                    </div>
                    <div className="text-[24px] text-[#4D4D4D] text-shadow-[1.481px_2.963px_0px_0px_#AF7F3D] text-stroke-1 text-stroke-black text-center">
                      {DynamicFormatAmount({
                        amount: wasabeeIDO?.idoTotalAmount.toString() ?? 0,
                        decimals: 3,
                        endWith: wasabeeIDO?.idoToken?.symbol ?? '',
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] hover:shadow-[2px_2px_0px_0px_#D29A0D] transition-shadow">
                    <div className="text-sm text-[#171414] mb-2 text-center">
                      Sold Amount
                    </div>
                    <div className="text-[24px] text-[#4D4D4D] text-shadow-[1.481px_2.963px_0px_0px_#AF7F3D] text-stroke-1 text-stroke-black text-center">
                      {DynamicFormatAmount({
                        amount: wasabeeIDO?.idoSold.toString() ?? 0,
                        decimals: 2,
                        endWith: wasabeeIDO?.idoToken?.symbol ?? '',
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col h-full">
                  <div className="text-lg font-semibold mb-4">
                    Purchase History
                  </div>
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] flex-1 flex flex-col">
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full">
                        <thead>
                          <tr className="text-sm text-[#4D4D4D] border-b border-black">
                            <th className="py-2 text-left">Buyer</th>
                            <th className="py-2 text-right">BERA Amount</th>
                            <th className="py-2 text-right">Token Amount</th>
                            <th className="py-2 text-right">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedPurchases?.map(
                            (purchase: any, index: number) => (
                              <tr
                                key={index}
                                className="text-sm border-b border-gray-200 last:border-0"
                              >
                                <td className="py-2 text-left">
                                  {`${purchase.buyer.slice(
                                    0,
                                    6
                                  )}...${purchase.buyer.slice(-4)}`}
                                </td>
                                <td className="py-2 text-right">
                                  {DynamicFormatAmount({
                                    amount: new BigNumber(
                                      purchase.ethAmount.toString()
                                    )
                                      .div(1e18)
                                      .toString(),
                                    decimals: 4,
                                    endWith: 'BERA',
                                  })}
                                </td>
                                <td className="py-2 text-right">
                                  {DynamicFormatAmount({
                                    amount: new BigNumber(
                                      purchase.tokenAmount.toString()
                                    )
                                      .div(
                                        10 **
                                          (wasabeeIDO?.idoToken?.decimals ?? 18)
                                      )
                                      .toString(),
                                    decimals: 4,
                                    endWith: wasabeeIDO?.idoToken?.symbol ?? '',
                                  })}
                                </td>
                                <td className="py-2 text-right">
                                  {new Date(
                                    Number(purchase.timestamp) * 1000
                                  ).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false,
                                  })}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-[#FFCD4D] text-black rounded-lg hover:bg-[#FFD700] transition-colors disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="mx-4 py-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-[#FFCD4D] text-black rounded-lg hover:bg-[#FFD700] transition-colors disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContainer>

          <div className="col-span-6 lg:col-span-2 h-full">
            <CardContainer>
              <div className="space-y-4 w-full">
                {wasabeeIDO && (
                  <WasabeeIDOActionComponent
                    wasabeeIDO={wasabeeIDO}
                    refetchPurchaseHistory={refetch}
                  />
                )}
              </div>
            </CardContainer>
          </div>
        </CardContainer>

        <CardContainer
          className="bg-white border-3 border-[#FFCD4D] px-[50px] py-[100px]"
          showBottomBorder={false}
        >
          <div className="space-y-8">
            {/* About Wasabee */}
            <div className="space-y-4">
              <h2 className="text-[24px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                About Wasabee
              </h2>
              <p className="text-[#4D4D4D] leading-relaxed">
                Wasabee is a concentrated liquidity DEX to support meme and
                long-tail asset trading on Berachain. With support for
                concentrated liquidity and dynamic fee mechanisms, Wasabee is
                uniquely designed to meet the fast-evolving needs of meme
                trading markets. Further, leveraging advanced liquidity
                management through its Automated Liquidity Manager (ALM),
                Wasabee ensures deep liquidity and optimizes fee collection for
                users.
              </p>
              <p className="text-[#4D4D4D] leading-relaxed">
                Wasabee has been selected for Berachain's RFA program, with
                three active pools integrated into Berachain's
                Proof-of-Liquidity (PoL) system, making them eligible for both
                BERA and BGT incentives.
              </p>
              <div className="space-y-2">
                <p className="text-[#4D4D4D] font-medium">Key Links:</p>
                <ul className="text-[#4D4D4D] space-y-1 ml-4">
                  <li>
                    •{' '}
                    <a
                      href="https://x.com/WasabeeFi/status/1887806031335665817"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      RFA announcement
                    </a>
                  </li>
                  <li>
                    •{' '}
                    <a
                      href="https://hub.forum.berachain.com/t/general-non-bex-reward-vault-request-for-ibera-wbera-on-wasabee/793"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      iBERA-WBERA vault
                    </a>
                  </li>
                  <li>
                    •{' '}
                    <a
                      href="https://hub.forum.berachain.com/t/general-non-bex-reward-vault-request-for-wgbera-wbera-on-wasabee/795"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      wgBERA-WBERA
                    </a>
                  </li>
                  <li>
                    •{' '}
                    <a
                      href="https://hub.forum.berachain.com/t/general-non-bex-reward-vault-request-for-weth-wbera-on-wasabee/655"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      WETH-WBERA
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Fair Launch */}
            <div className="space-y-4">
              <h2 className="text-[24px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                Fair Launch
              </h2>
              <p className="text-[#4D4D4D] leading-relaxed">
                Wasabee is a VC-free project, ensuring a fully community-driven
                fair launch. All unsold public sale tokens will be permanently
                burned.
              </p>
            </div>

            {/* Tokenomics */}
            <div className="space-y-4">
              <h2 className="text-[24px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                Tokenomics
              </h2>
              <div className="flex justify-center">
                <Image
                  src="/images/wasabee-tokenomics.jpg"
                  alt="Wasabee Tokenomics Distribution"
                  width={600}
                  height={600}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Token Utility */}
            <div className="space-y-4">
              <h2 className="text-[24px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                Token Utility
              </h2>
              <ul className="text-[#4D4D4D] space-y-3">
                <li>
                  <strong>Reward Vault Incentives:</strong> Deploy $BEE to
                  kick-start PoL reward pools—driving deeper TVL and higher
                  yield for participants.
                </li>
                <li>
                  <strong>Staking & Governance:</strong> Stake $BEE to vote on
                  DAO proposals and shape how incentives are distributed; early
                  stakers earn "Founding Member" status with enhanced voting
                  weight.
                </li>
                <li>
                  <strong>Liquidity Farming:</strong> Provide $BEE–WBERA
                  liquidity to earn ongoing farming rewards while bolstering
                  pool depth.
                </li>
                <li>
                  <strong>Trading-Fee Reduction:</strong> Once activated,
                  holding $BEE grants tiered discounts on swap fees.
                </li>
              </ul>
            </div>

            {/* Wasabee Team */}
            <div className="space-y-4">
              <h2 className="text-[24px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                Wasabee Team
              </h2>
              <p className="text-[#4D4D4D] leading-relaxed">
                Wasabee is built by seasoned DeFi operators with DEX experience
                dating back to 2020. We're mission-driven to bring meme
                liquidity into the concentrated liquidity era—without
                rent-seeking intermediaries.
              </p>
            </div>

            {/* Community and Partnerships */}
            <div className="space-y-4">
              <h2 className="text-[24px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                Community and Partnerships
              </h2>
              <p className="text-[#4D4D4D] leading-relaxed">
                Wasabee builds community through its Genesis NFT collection, The
                Hive Awakens (1,000 supply), launched in March 2025 via
                whitelisted free mint to reward early supporters. We've also
                formed key partnerships across the Berachain ecosystem,
                including Honeypot Finance (launchpad), Ooga Booga (aggregator),
                BeraPaw (BGT derivatives), and TerpLayer (BTCfi), working
                together to drive liquidity, visibility, and long-tail asset
                adoption.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h2 className="text-[24px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                Links
              </h2>
              <div className="text-[#4D4D4D]">
                <a
                  href="https://wasabee.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://wasabee.xyz/
                </a>
              </div>
            </div>
          </div>
        </CardContainer>
      </div>
    </div>
  );
});

export default WasabeeIDOPage;
