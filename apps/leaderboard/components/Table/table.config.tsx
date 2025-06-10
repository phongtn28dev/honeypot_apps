import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableAction } from './generic-table';

export interface StakingData {
  id: string;
  cooldown: string;
  weight: number;
  rewards: string;
  action: TableAction;
  isCooldownActive?: boolean;
}

export interface ReceiptTableData {
  id: string;
  receiptId: string;
  cooldown: string;
  weight: string;
  rewards: string;
  claimableAt: string;
  isClaimed: boolean;
  isCooldownActive: boolean;
  action: {
    label: string;
    variant?: 'default' | 'outline' | 'secondary';
    isDisabled: boolean;
    className: string;
    style?: React.CSSProperties;
    onClick: () => void;
  };
}

export const columns: ColumnDef<ReceiptTableData>[] = [
  {
    accessorKey: 'receiptId',
    header: 'Receipt ID',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('receiptId')}</span>
    ),
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const valueA = parseInt(rowA.getValue(columnId) as string, 10);
      const valueB = parseInt(rowB.getValue(columnId) as string, 10);
      return valueA - valueB;
    },
  },
  {
    accessorKey: 'cooldown',
    header: 'Cooldown time',
    cell: ({ row }) => {
      const cooldown = row.getValue('cooldown') as string;
      const data = row.original;
      const claimableAt = parseInt(data.claimableAt);
      const now = Math.floor(Date.now() / 1000);
      const isClaimable = now >= claimableAt;
      const isZero = cooldown === '0';
      if (isZero) {
        return <span className={`text-red-500`}>{cooldown}</span>;
      }
      return (
        <span
          className={
            isClaimable
              ? 'text-green-500 font-medium'
              : 'text-orange-500 font-medium'
          }
        >
          {cooldown}
        </span>
      );
    },
  },
  {
    accessorKey: 'weight',
    header: 'Weight',
    cell: ({ row }) => <span>{row.getValue('weight')}</span>,
  },
  {
    accessorKey: 'rewards',
    header: 'Estimated Rewards',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('rewards')}</span>
    ),
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const data = row.original;
      const claimableAt = parseInt(data.claimableAt);
      const now = Math.floor(Date.now() / 1000);
      const isClaimable = now >= claimableAt;

      let actionConfig;

      if (!isClaimable) {
        // Cooldown period - not yet claimable
        actionConfig = {
          label: 'Cooldown',
          isDisabled: true,
          className:
            'bg-gray-400 text-gray-700 px-3 py-1 rounded-md cursor-not-allowed',
          onClick: () => {},
        };
      } else if (isClaimable && !data.isClaimed) {
        // Claimable - ready to claim
        actionConfig = {
          label: 'Claim',
          isDisabled: false,
          className:
            'px-3 py-1 rounded-md text-black cursor-pointer hover:opacity-80 transition-opacity',
          style: { background: 'rgba(255, 169, 49, 1)' },
          onClick: () => {
            // TODO: Implement claim functionality
            console.log('Claiming receipt:', data.receiptId);
          },
        };
      } else {
        // Already claimed
        actionConfig = {
          label: 'Claimed',
          isDisabled: true,
          className: 'px-3 py-1 rounded-md text-gray-600 cursor-not-allowed',
          style: { background: 'rgba(204, 204, 204, 1)' },
          onClick: () => {},
        };
      }

      return (
        <button
          className={actionConfig.className}
          style={actionConfig.style}
          disabled={actionConfig.isDisabled}
          onClick={actionConfig.onClick}
        >
          {actionConfig.label}
        </button>
      );
    },
    enableSorting: false,
  },
];
