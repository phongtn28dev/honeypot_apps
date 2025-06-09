import GenericTanstackTable from '@/components/Table/generic-table';
import { columns, ReceiptTableData } from '@/components/Table/table.config';
import { useClaimReceipt } from '@/hooks/useClaimReceipt';
import React, { useEffect, useState } from 'react';
import {
  handleCooldownComplete,
  updateClaimedReceipt,
} from '../helper-function';
import { tableData } from '@/components/Table/mock-data';

export default function AllInOneVaultTable() {
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
    <GenericTanstackTable
      data={currentTableData}
      columns={columns}
      className="mb-6 w-full shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
      enableSorting={true}
      enableFiltering={true}
      enablePagination={true}
      searchPlaceholder="Search receipts..."
    />
  );
}
