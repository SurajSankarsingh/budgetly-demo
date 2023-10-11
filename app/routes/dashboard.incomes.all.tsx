import { useLoaderData } from '@remix-run/react';
import { type LoaderFunction, json } from '@remix-run/node';
import { SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';

import { getIncomes } from '~/models/incomes.server';
import { DataTable } from '~/components/DataTable';
import { Income, incomeColumns } from '~/components/IncomeColumns';
import { DataChart } from '~/components/DataChart';
import { formatDate } from '../lib/formatDate';

import { useAtomValue } from 'jotai';
import { startDateAtom, endDateAtom } from '~/lib/store';
import { DateRangePicker } from '~/components/DateRangePicker';

import { ChartColor } from '~/components/DataChart';

export const loader: LoaderFunction = async (request) => {
  const { userId } = await getAuth(request);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const incomes = await getIncomes(request, userId);

  return json({ incomes: incomes });
};

export default function Incomes() {
  const data = useLoaderData();
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);

  const start = new Date(startDate).getTime();
  let end = new Date(endDate).setHours(23, 59, 59, 999);
  const endDateNum = new Date(end).getTime();

  const result = data.incomes
    .filter((income: Income) => {
      let time = new Date(income.created_at).getTime();
      return time >= start && time <= endDateNum;
    })
    .sort(function (a: any, b: any) {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

  const chartData = result.map((income: Income) => {
    return {
      name: formatDate(income.created_at),
      value: income.amount,
    };
  });

  return (
    <div className=''>
      <SignedIn>
        <h1 className='pb-4 text-lg text-center uppercase font-bold'>
          Incomes
        </h1>
        <div className='m-4 flex flex-wrap w-auto justify-center space-y-4'>
          <DateRangePicker />
          <DataChart
            data={chartData}
            name='Incomes'
            color={ChartColor.green}
            description='A graphical layout of your incomes, use the calender to change the range and see what happens!!'
          />

          <DataTable
            columns={incomeColumns}
            data={data.incomes}
            name='Incomes'
            description='A listing of all the incomes you have submitted'
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
