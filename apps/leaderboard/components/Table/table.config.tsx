import { ColumnDef } from '@tanstack/react-table';
import GenericTanstackTable, {
  createActionCell,
  type TableAction,
} from './generic-table';

export interface StakingData {
  id: string;
  cooldown: string;
  weight: number;
  rewards: string;
  action: TableAction;
}

export const columns: ColumnDef<StakingData>[] = [
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
