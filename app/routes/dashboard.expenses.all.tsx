import { useLoaderData } from '@remix-run/react';
import { type LoaderFunction, json } from '@remix-run/node';
import { SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';

import { Expense, getExpenses } from '~/models/expenses.server';
import { DataTable } from '~/components/DataTable';
import { DataChart } from '~/components/DataChart';
import { formatDate } from '../lib/formatDate';
import { expenseColumns } from '~/components/ExpenseColumns';

import { useAtomValue } from 'jotai';
import { startDateAtom, endDateAtom } from '~/lib/store';
import { DateRangePicker } from '~/components/DateRangePicker';

import { ChartColor } from '~/components/DataChart';

export const loader: LoaderFunction = async (request) => {
  const { userId } = await getAuth(request);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const expenses = await getExpenses(request, userId);

  return json({ expenses: expenses });
};

export default function Expenses() {
  const data = useLoaderData();
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);

  const start = new Date(startDate).getTime();
  let end = new Date(endDate).setHours(23, 59, 59, 999);
  const endDateNum = new Date(end).getTime();

  const result = data.expenses
    .filter((expense: Expense) => {
      let time = new Date(expense.created_at).getTime();
      return time >= start && time <= endDateNum;
    })
    .sort(function (a: any, b: any) {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

  const chartData = result.map((expense: Expense) => {
    return {
      name: formatDate(expense.created_at),
      value: expense.amount,
    };
  });

  return (
    <div className=''>
      <SignedIn>
        <h1 className='pb-4 text-lg text-center uppercase font-bold'>
          Expenses
        </h1>
        <div className='m-4 flex flex-wrap w-auto justify-center space-y-4'>
          <DateRangePicker />
          <DataChart
            data={chartData}
            name='Expenses'
            color={ChartColor.red}
            description='A graphical layout of your expenses, use the calender to change the range and see what happens!!'
          />

          <DataTable
            columns={expenseColumns}
            data={data.expenses}
            name='Expenses'
            description='A listing of all the expenses you have submitted'
          />
        </div>
      </SignedIn>
      <SignedOut>
        <h1 className='capitalize pb-4 text-lg text-center'>
          You should not see this page if you are not logged in!!
        </h1>
      </SignedOut>
    </div>
  );
}
