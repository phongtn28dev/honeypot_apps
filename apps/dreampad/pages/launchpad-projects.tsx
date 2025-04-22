import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { wallet } from '@honeypot/shared';
import { useEffect, useState } from 'react';
import { Button } from '@/components/button/button-next';
import launchpad from '@/services/launchpad';
import { NextLayoutPage } from '@/types/nextjs';
import { Tab, Tabs, Button as NextButton } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { defaultContainerVariants, itemPopUpVariants } from '@/lib/animation';
import { WrappedNextInputSearchBar } from '@/components/wrappedNextUI/SearchBar/WrappedInputSearchBar';
import LaunchPadProjectCard from '@/components/LaunchPadProjectCard';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { DataContainer } from '@/components/DataContainer';
import dayjs from 'dayjs';
import { LaunchCardV3 } from '@/components/LaunchCard/v3';
import { HoneyContainer } from '@/components/CardContianer';
import { useLbpLaunchList } from '@honeypot/shared';
import { Address } from 'viem';
import { lbpMetadatas } from '@honeypot/shared';
import { PaginationState } from '@honeypot/shared';

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
    <HoneyContainer className="mx-auto max-w-[1280px]">
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
            className={'border border-[#5C5C5C] rounded-lg overflow-hidden'}
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
    </HoneyContainer>
  );
});

export default LbpProjectList;
