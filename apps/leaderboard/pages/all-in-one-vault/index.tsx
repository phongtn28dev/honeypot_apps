import CardContainer from '@/components/card-contianer/v3';

import GenericTanstackTable from '@/components/Table/generic-table';
import { tableData } from '@/components/Table/mock-data';
import { columns, ReceiptTableData } from '@/components/Table/table.config';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useClaimReceipt } from '@/hooks/useClaimReceipt';
import {
  handleCooldownComplete,
  updateClaimedReceipt,
} from './helper-function';
import StatCard from './components/stat-card';
import SelectionSection from './components/selection-section';

export default function AllInOneVault() {

  const [currentTableData, setCurrentTableData] =
    useState<ReceiptTableData[]>(tableData);

  const { claimingReceiptId, isConfirmed } = useClaimReceipt();

  useEffect(() => {
    const cooldownHandler = (event: CustomEvent) =>
      handleCooldownComplete(event, setCurrentTableData);
    window.addEventListener(
      'cooldown-complete',
      cooldownHandler as EventListener
    );
    return () =>
      window.removeEventListener(
        'cooldown-complete',
        cooldownHandler as EventListener
      );
  }, []);

  useEffect(() => {
    if (isConfirmed && claimingReceiptId) {
      updateClaimedReceipt(claimingReceiptId, setCurrentTableData);
    }
  }, [isConfirmed, claimingReceiptId]);


  return (
    <div className="w-full flex flex-col justify-center items-center px-4 font-gliker">
      <CardContainer className="xl:max-w-[1200px]">
        <StatCard />

        <GenericTanstackTable
          data={currentTableData}
          columns={columns}
          className="mb-6 w-full shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
          enableSorting={true}
          enableFiltering={true}
          enablePagination={true}
          searchPlaceholder="Search receipts..."
        />

        <SelectionSection />
      </CardContainer>
    </div>
  );
}
