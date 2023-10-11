import { NavLink, useLoaderData } from '@remix-run/react';
import {
  type LoaderFunction,
  json,
  ActionFunction,
  redirect,
} from '@remix-run/node';
import { SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';

import { Progress } from '~/components/ui/progress';
import { formatDate } from '../lib/formatDate';
import { DataCard } from '~/components/DataCard';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DeleteDialog } from '~/components/DeleteDialog';
import invariant from 'tiny-invariant';
import { deleteTracker, getTracker } from '~/models/trackers.server';
import { getExpensesByTracker } from '~/models/expenses.server';
import { useEffect, useState } from 'react';
import { SimpleDataCard } from '~/components/SimpleDataCard';
import { motion } from 'framer-motion';
import { motionCardContainer } from '~/lib/framer';
import confetti from 'canvas-confetti';

export const loader: LoaderFunction = async (request) => {
  const { userId } = await getAuth(request);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const trackerId = request.params.trackerId;

  const tracker = await getTracker(request, userId, trackerId);

  const expenses = await getExpensesByTracker(request, userId, trackerId);

  return json({ tracker: tracker, expenses: expenses });
};

export const action: ActionFunction = async (req) => {
  const { userId } = await getAuth(req);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const trackerId = req.params.trackerId;

  invariant(trackerId, 'tracker ID must be defined');

  await deleteTracker(req, userId, trackerId);

  return redirect('/dashboard/trackers/all');
};

export default function Tracker() {
  const [progress, setProgress] = useState(0);
  const data = useLoaderData();
  const { expenses } = data;

  const formattedCreatedDate = formatDate(data.tracker.created_at);
  const formattedUpdatedDate = data.tracker.updated_at
    ? formatDate(data.tracker.updated_at)
    : 'N/A';

  const totalExpenses = expenses.reduce((acc: any, expense: any) => {
    return acc + expense.amount;
  }, 0);

  const total = data.tracker.target_amount;

  const totalRemaining = total - totalExpenses;

  const totalPercent = (totalExpenses / total) * 100;

  useEffect(() => {
    const progressTimer = setTimeout(() => setProgress(totalPercent), 800);

    if (totalPercent === 100) {
      var duration = 3 * 1000;
      var animationEnd = Date.now() + duration;
      var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: any, max: any) {
        return Math.random() * (max - min) + min;
      }

      var interval: any = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);
    }

    return () => clearTimeout(progressTimer);
  }, [totalPercent]);

  return (
    <div>
      <SignedIn>
        <section>
          <div className='container px-5 py-24 mx-auto'>
            <NavLink to='/dashboard/trackers/all'>
              <Button variant='outline'>
                <ArrowLeft className='mr-2' />
                Back
              </Button>
            </NavLink>
            <div className='text-center mb-20'>
              <h1 className='sm:text-3xl text-2xl font-medium text-center title-font mb-4'>
                Tracker Breakdown
              </h1>
              <p className='text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto'>
                The following is a detailed breakdown of your selected tracker
              </p>
            </div>
            <motion.ul
              className='grid grid-cols-1 lg:grid-cols-3 gap-4 w-full justify-items-center my-4'
              variants={motionCardContainer}
              initial='hidden'
              animate='visible'
            >
              <SimpleDataCard
                title='Total Contributions'
                value={`$${totalExpenses}`}
                description='The total amount of expenses allocated this tracker'
              />
              <SimpleDataCard
                title='Contributions Remaining'
                value={`$${totalRemaining}`}
                description='The total amount remaining for this tracker'
              />
              <SimpleDataCard
                title='Total Progress'
                value={`${totalPercent.toFixed(2)}%`}
                description='The total progress for this tracker'
              />
            </motion.ul>
            <div className='flex justify-center my-6'>
              <Progress value={progress} max={100} />
            </div>
            <motion.ul
              className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full justify-items-center'
              variants={motionCardContainer}
              initial='hidden'
              animate='visible'
            >
              <DataCard
                cardName='Name:'
                cardDescription='The name of the tracker selected'
                content={data.tracker.name}
              />
              <DataCard
                cardName='Description:'
                cardDescription='The description of the tracker selected'
                content={data.tracker.description}
              />
              <DataCard
                cardName='Target Amount:'
                cardDescription='The target amount of the tracker selected ($)'
                content={data.tracker.target_amount}
              />
              <DataCard
                cardName='Target Date:'
                cardDescription='The target date of the tracker selected ($)'
                date={new Date(data.tracker.target_date)}
              />
              <DataCard
                cardName='Status'
                cardDescription='The target amount of the tracker selected ($)'
                content={data.tracker.status}
              />
              <DataCard
                cardName='Created On:'
                cardDescription='The date the tracker selected was created'
                content={formattedCreatedDate}
              />
              <DataCard
                cardName='Updated On:'
                cardDescription='The date the tracker selected was updated'
                content={formattedUpdatedDate}
              />
            </motion.ul>
            <div className='grid grid-cols-1 w-full justify-items-center mt-6'>
              <div className='flex flex-row space-x-4'>
                <NavLink to={`/dashboard/trackers/edit/${data.tracker.id}`}>
                  <Button variant='outline'>Edit</Button>
                </NavLink>
                <DeleteDialog name='tracker' />
              </div>
            </div>
          </div>
        </section>
      </SignedIn>
      <SignedOut>
        <h1 className='capitalize pb-4 text-lg text-center'>
          You should not see this page if you are not logged in!!
        </h1>
      </SignedOut>
    </div>
  );
}
