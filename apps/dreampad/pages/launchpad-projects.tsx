import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Button } from '@/components/button/button-next';
import { motion } from 'framer-motion';
import { defaultContainerVariants, itemPopUpVariants } from '@/lib/animation';
import LaunchPadProjectCard from '@/components/LaunchPadProjectCard';
import { DataContainer } from '@/components/DataContainer';
import { HoneyContainer } from '@/components/CardContianer';
import { useLbpLaunchList } from '@honeypot/shared';
import { Address } from 'viem';
import { PaginationState } from '@honeypot/shared';
import { Tab, Tabs } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { wasabeeIDOmetadata } from '@honeypot/shared';

const LbpProjectList = observer(() => {
  const { data, loading, error } = useLbpLaunchList();
  const [paginationState] = useState(() => new PaginationState({ limit: 10 }));
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (data) {
      paginationState.setTotal(data.length);
    }
  }, [data]);

  const paginatedData = data?.slice(
    paginationState.offset,
    paginationState.end
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    paginationState.onPageChange(page);
  };

  return (
    <div className="min-h-screen relative w-full font-gliker">
      <div className="container mx-auto max-w-[1520px] space-y-[48px]">
        {/* Wasabee Banner */}
        <HoneyContainer className="mx-auto max-w-[1280px]">
          <div className="relative overflow-hidden rounded-[16px] border border-black bg-gradient-to-r from-[#FFCD4D] to-[#D29A0D] p-8">
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={wasabeeIDOmetadata.tokenIcon}
                      alt="Wasabee"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <h1 className="text-[32px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                      Wasabee
                    </h1>
                  </div>
                  <p className="text-[18px] text-[#202020] font-medium">
                    Concentrated Liquidity DEX for Meme & Long-tail Assets on
                    Berachain
                  </p>
                  <p className="text-[#4D4D4D] leading-relaxed">
                    VC-free project with advanced liquidity management through
                    Automated Liquidity Manager (ALM). Selected for Berachain's
                    RFA program with PoL integration.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-white rounded-[8px] border border-black px-4 py-2 shadow-[2px_2px_0px_0px_#000]">
                    <span className="text-sm font-medium">Fair Launch</span>
                  </div>
                  <div className="bg-white rounded-[8px] border border-black px-4 py-2 shadow-[2px_2px_0px_0px_#000]">
                    <span className="text-sm font-medium">PoL Integrated</span>
                  </div>
                  <div className="bg-white rounded-[8px] border border-black px-4 py-2 shadow-[2px_2px_0px_0px_#000]">
                    <span className="text-sm font-medium">BGT Incentives</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/wasabee-ido/0x37e1F8ea31307d9Bf2560bB0b4fA4b3274Ea468F"
                    className="bg-[#202020] text-white px-6 py-3 rounded-[8px] border border-black hover:bg-[#333] transition-colors shadow-[2px_2px_0px_0px_#000] font-medium"
                  >
                    Join Wasabee IDO
                  </Link>
                </div>
              </div>

              {/* Right Content - Tokenomics */}
              <div className="flex justify-center">
                <div className="relative">
                  <Image
                    src="/images/wasabee-tokenomics.jpg"
                    alt="Wasabee Tokenomics"
                    width={400}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </HoneyContainer>

        <HoneyContainer className="mx-auto max-w-[1280px]">
          <Tabs
            classNames={{
              tabList: 'bg-[#202020] text-white',
              tab: 'text-white',
              panel: 'w-full',
            }}
          >
            <Tab key="lbp" title="LBP">
              <DataContainer
                hasData={data && data?.length > 0}
                isLoading={loading}
                className="w-full"
              >
                <div className="w-full">
                  <motion.div
                    variants={defaultContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className={
                      'border border-[#5C5C5C] rounded-lg overflow-hidden'
                    }
                  >
                    <table className="w-full">
                      <thead className="bg-[#323232] text-white border-b border-[#5C5C5C]">
                        <tr>
                          <th>Project</th>
                          <th>Status</th>
                          <th>Raise Token</th>
                          <th>Raise Amount</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="border-t border-[#F7931A0D] rounded-lg overflow-hidden">
                        {paginatedData?.map((pair, idx) => (
                          <motion.tr
                            variants={itemPopUpVariants}
                            key={idx}
                            className="bg-[#202020]  border-b-2 border-[#5C5C5C] "
                          >
                            <LaunchPadProjectCard
                              status={pair.launchStatusDisplay}
                              coverImg={pair.lbpBanner}
                              isShowCoverImage={true}
                              endDate={pair.endsAt.unix()}
                              startDate={pair.startsAt.unix()}
                              tokenName={pair.shareToken?.symbol ?? ''}
                              projectAuthor={pair.owner}
                              fundsRaised={pair.fundsRaised.toNumber()}
                              assetTokenSymbol={pair.assetToken?.symbol ?? ''}
                              shareTokenSymbol={pair.imageUrl}
                              pairAddress={pair.address as Address}
                              variant="list"
                            />
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                    {data && data.length > 0 && (
                      <div className="flex justify-center items-center gap-2 py-4 bg-[#202020]">
                        <Button
                          onPress={() => handlePageChange(currentPage - 1)}
                          isDisabled={currentPage === 1}
                          className="bg-[#323232] text-white"
                        >
                          Previous
                        </Button>
                        <span className="text-white">
                          Page {currentPage} of {paginationState.totalPage}
                        </span>
                        <Button
                          onPress={() => handlePageChange(currentPage + 1)}
                          isDisabled={currentPage === paginationState.totalPage}
                          className="bg-[#323232] text-white"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </div>
              </DataContainer>
            </Tab>
            <Tab key="FTO" title="FTO">
              <div className="text-center text-2xl">Coming soon</div>
            </Tab>
          </Tabs>
        </HoneyContainer>
      </div>
    </div>
  );
});

export default LbpProjectList;
