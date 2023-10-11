import { ColumnDef } from '@tanstack/react-table';
import { FileSymlink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '~/lib/formatDate';
import { ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Income = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  description: string;
  created_at: string;
  updated_at: string;
};

export const incomeColumns: ColumnDef<Income>[] = [
  {
    accessorKey: 'name',
    header: () => <div className='text-center font-bold font-serif'>Name</div>,
    cell: ({ row }) => (
      <div className='text-center font-medium capitalize'>
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <div className='font-bold font-serif'>Amount</div>
            <ArrowUpDown className='ml-2 w-4 h-4' />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className='text-center font-medium '>{formatted}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: () => (
      <div className='text-center font-bold font-serif'>Description</div>
    ),
    cell: ({ row }) => (
      <div className='text-center font-medium'>
        {row.getValue('description')}
      </div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <div className='font-bold font-serif'>Created On</div>
            <ArrowUpDown className='ml-2 w-4 h-4' />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      const formattedDate = formatDate(date.toISOString());

      return <div className='text-center font-medium'>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'id',
    header: () => <div className='text-center font-bold font-serif'>View</div>,
    cell: ({ row }) => {
      const id = row.getValue('id');

      return (
        <div className='text-center font-medium'>
          <Link
            to={`/dashboard/incomes/${id}`}
            className={`flex justify-center text-teal-500 hover:animate-pulse`}
          >
            <FileSymlink />
          </Link>
        </div>
      );
    },
  },
];
