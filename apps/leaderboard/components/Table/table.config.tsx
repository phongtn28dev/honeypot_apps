import { ColumnDef } from '@tanstack/react-table';
import GenericTanstackTable, {
  createActionCell,
  type TableAction,
} from './generic-table';
import { CountdownTimer } from '../countdown-timer';

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
  cooldown: string;
  weight: number;
  rewards: string;
  isCooldownActive: boolean;
  action: {
    label: string;
    variant?: 'default' | 'outline' | 'secondary';
    isDisabled: boolean;
    className: string;
    onClick: () => void;
  };
}

export const columns: ColumnDef<ReceiptTableData>[] = [
  {
    accessorKey: 'id',
    header: 'Receipt ID',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('id')}</span>
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
      
      // If cooldown is already at 00:00:00, just display the string
      if (cooldown === '00:00:00' || !data.isCooldownActive) {
        return (
          <span
            className={
              cooldown === '00:00:00'
                ? 'text-green-500 font-medium'
                : 'text-gray-600'
            }
          >
            {cooldown}
          </span>
        );
      }
      
      // Otherwise, use the countdown timer
      return (
        <span className="text-orange-500 font-medium">
          <CountdownTimer 
            initialTime={cooldown} 
            onComplete={() => {
              // Update action button when timer completes
              if (data.action.label === "Cooldown") {
                data.action.label = "Claim";
                data.action.isDisabled = false;
                data.action.className = "bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded-md";
                // Force a re-render of the component
                window.dispatchEvent(new CustomEvent('cooldown-complete', { detail: data.id }));
              }
            }}
          />
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
      const action = row.getValue('action') as TableAction;
      return createActionCell(action);
    },
    enableSorting: false,
  },
];
