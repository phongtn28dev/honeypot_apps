import GenericTanstackTable from '@/components/Table/generic-table';
import { columns, ReceiptTableData } from '@/components/Table/table.config';
import { useClaimReceipt } from '@/hooks/useClaimReceipt';
import React, { useEffect, useMemo, useState } from 'react';
import {
  handleCooldownComplete,
  updateClaimedReceipt,
} from '../helper-function';
import { tableData } from '@/components/Table/mock-data';
import {
  ApolloClient,
  InMemoryCache,
  useQuery as useApolloQuery,
} from '@apollo/client';
import { RECEIPTS_LIST } from '@/lib/algebra/graphql/queries/receipts-list';
import { useAccount } from 'wagmi';
import { LoadingDisplay } from '@/components/loading-display/loading-display';
import ErrorIcon from '@/components/svg/ErrorIcon';
import { transformReceiptData } from './utils/helper';

export default function AllInOneVaultTable() {
  const [currentTableData, setCurrentTableData] =
    useState<ReceiptTableData[]>(tableData);
  const [refreshKey, setRefreshKey] = useState(0);
  const { address } = useAccount();
  const allInOneVaultClient = useMemo(
    () =>
      new ApolloClient({
        uri: 'https://api.ghostlogs.xyz/gg/pub/96ff5ab9-9c87-47cb-ab46-73a276d93c8b',
        cache: new InMemoryCache(),
        defaultOptions: {
          query: {
            errorPolicy: 'all',
          },
        },
      }),
    []
  );
  const { claimingReceiptId, isConfirmed } = useClaimReceipt();

  const {
    data: receiptsData,
    loading: receiptsLoading,
    error: receiptsError,
    refetch: refetchReceipts,
  } = useApolloQuery(RECEIPTS_LIST, {
    client: allInOneVaultClient,
    variables: { user: '0x8ef3fd2bf7ae8a190e437aa6248d419c34428804' },
    skip: !address,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });
  const listReceipts = receiptsData?.receipts?.items || [];

  useEffect(() => {
    if (listReceipts) {
      const transformedData = transformReceiptData(listReceipts);
      setCurrentTableData(transformedData);
    }
  }, [receiptsData, refreshKey]);

  // Set up interval to refresh table data every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      if (listReceipts) {
        setRefreshKey((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [receiptsData]);

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
      refetchReceipts();
    }
  }, [isConfirmed, claimingReceiptId, refetchReceipts]);

  if (receiptsError) {
    console.error('Error loading receipts:', receiptsError);
    return (
      <div className="mb-6 w-full shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] bg-white rounded-xl p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <ErrorIcon />
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
            Failed to load receipts
          </h3>
          <p className="text-gray-600 text-center mb-4">
            There was an error loading your receipt data. Please try again.
          </p>
          <button
            onClick={() => refetchReceipts()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (receiptsLoading && !receiptsData) {
    return (
      <div className="mb-6 w-full shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] bg-white rounded-xl p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingDisplay size={100} text="Loading receipts..." />
        </div>
      </div>
    );
  }

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
