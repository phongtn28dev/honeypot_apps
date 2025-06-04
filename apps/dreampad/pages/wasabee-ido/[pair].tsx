'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CardContainer from '@/components/CardContianer/v3';
import { useRouter } from 'next/router';
import { Address } from 'viem';
import { networksMap } from '@honeypot/shared';
import { DEFAULT_CHAIN_ID } from '@/config/algebra/default-chain-id';
import { DynamicFormatAmount } from '@honeypot/shared';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { observer } from 'mobx-react-lite';
import { WasabeeIDO } from '@honeypot/shared';

const WasabeeIDOPage = observer(() => {
  const router = useRouter();
  const [wasabeeIDO, setWasabeeIDO] = useState<WasabeeIDO | null>(null);
  const { pair: pairAddress } = router.query;

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

  return (
    <div className="min-h-screen relative w-full font-gliker">
      <div className="container mx-auto max-w-[1520px] space-y-[72px]">
        <CardContainer showBottomBorder={false}>
          <div className="w-full lg:grid lg:grid-cols-5 gap-8 p-8">
            <div className="w-full space-y-4 lg:col-span-2 lg:pr-5 mb-5">
              <div className="space-y-2">
                <div className="flex justify-center items-center w-[74px] h-[32px] bg-white rounded-[4px] border-[0.75px] border-[#202020] shadow-[1px_1px_0px_0px_#000] text-[14px]">
                  ${wasabeeIDO?.idoToken?.symbol}
                </div>

                <h1 className="text-[30px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                  {wasabeeIDO?.idoToken?.name}
                </h1>
                <p className="text-[#4D4D4D]">{wasabeeIDO?.description}</p>
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
                        src="/images/lbp-detail/logo/honeypot.png"
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
                src={wasabeeIDO?.imageUrl ?? ''}
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
                src={wasabeeIDO?.bannerUrl || ''}
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
              <div className="lg:grid lg:grid-cols-[220px_1fr] gap-6 items-start ">
                <div className="space-y-4 mb-2">
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] hover:shadow-[2px_2px_0px_0px_#D29A0D] transition-shadow">
                    <div className="text-sm text-[#4D4D4D] mb-2 text-center">
                      Price per {wasabeeIDO?.idoToken?.symbol}
                    </div>
                    <div className="text-[24px] text-[#4D4D4D]text-shadow-[1.481px_2.963px_0px_#AF7F3D] text-stroke-1 text-stroke-black text-center">
                      {DynamicFormatAmount({
                        amount: wasabeeIDO?.priceInETH.toString() ?? 0,
                        decimals: 2,
                        endWith: 'ETH',
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] hover:shadow-[2px_2px_0px_0px_#D29A0D] transition-shadow">
                    <div className="text-sm text-[#4D4D4D] mb-2 text-center">
                      Total Amount
                    </div>
                    <div className="text-[24px] text-[#4D4D4D] text-shadow-[1.481px_2.963px_0px_#AF7F3D] text-stroke-1 text-stroke-black text-center">
                      {DynamicFormatAmount({
                        amount: wasabeeIDO?.idoTotalAmount.toString() ?? 0,
                        decimals: 2,
                        endWith: wasabeeIDO?.idoToken?.symbol ?? '',
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] hover:shadow-[2px_2px_0px_0px_#D29A0D] transition-shadow">
                    <div className="text-sm text-[#171414] mb-2 text-center">
                      Sold Amount
                    </div>
                    <div className="text-[24px] text-[#4D4D4D] text-shadow-[1.481px_2.963px_0px_#AF7F3D] text-stroke-1 text-stroke-black text-center">
                      {DynamicFormatAmount({
                        amount: wasabeeIDO?.idoSold.toString() ?? 0,
                        decimals: 2,
                        endWith: wasabeeIDO?.idoToken?.symbol ?? '',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContainer>

          <div className="col-span-6 lg:col-span-2 h-full">
            <CardContainer>
              <div className="space-y-4 w-full">
                {/* TODO: Add IDO action component */}
              </div>
            </CardContainer>
          </div>
        </CardContainer>

        <CardContainer
          className="bg-white border-3 border-[#FFCD4D] px-[50px] py-[100px]"
          showBottomBorder={false}
        >
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer">
                  {props.children}
                </a>
              ),
            }}
            remarkPlugins={[remarkGfm]}
          >
            {wasabeeIDO?.description}
          </ReactMarkdown>
        </CardContainer>
      </div>
    </div>
  );
});

export default WasabeeIDOPage;
