import { useLoaderData } from '@remix-run/react';
import { type LoaderFunction, json } from '@remix-run/node';
import { SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';

import { getTrackers } from '~/models/trackers.server';
import { Tracker, trackerColumns } from '~/components/TrackerColumns';
import { DataTable } from '~/components/DataTable';
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

  const trackers = await getTrackers(request, userId);

  return json({ trackers: trackers });
};

export default function Trackers() {
  const data = useLoaderData();

  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);

  const start = new Date(startDate).getTime();
  let end = new Date(endDate).setHours(23, 59, 59, 999);
  const endDateNum = new Date(end).getTime();

  const result = data.trackers
    .filter((tracker: Tracker) => {
      let time = new Date(tracker.created_at).getTime();
      return time >= start && time <= endDateNum;
    })
    .sort(function (a: any, b: any) {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

  const chartData = result.map((tracker: Tracker) => {
    return {
      name: formatDate(tracker.created_at),
      value: tracker.target_amount,
    };
  });

  console.log(chartData);

  return (
    <div className=''>
      <SignedIn>
        <h1 className='pb-4 text-lg text-center uppercase font-bold'>
          Trackers
        </h1>
        <div className='m-4 flex flex-wrap w-auto justify-center space-y-4'>
          <DateRangePicker />
          <DataChart
            data={chartData}
            name='Trackers'
            color={ChartColor.blue}
            altColor={ChartColor.green}
            type='bar'
            description='A graphical layout of your trackers, use the calender to change the range and see what happens!!'
          />

          <DataTable
            columns={trackerColumns}
            data={data.trackers}
            name='Trackers'
            description='A listing of all the trackers you have submitted'
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
