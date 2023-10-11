import { NavLink, useLoaderData } from '@remix-run/react';
import {
  type LoaderFunction,
  json,
  ActionFunction,
  redirect,
} from '@remix-run/node';
import { SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';

import { deleteIncome, getIncome } from '~/models/incomes.server';
import { formatDate } from '../lib/formatDate';
import { DataCard } from '~/components/DataCard';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DeleteDialog } from '~/components/DeleteDialog';
import invariant from 'tiny-invariant';
import { motion } from 'framer-motion';
import { motionCardContainer } from '~/lib/framer';

export const loader: LoaderFunction = async (request) => {
  const { userId } = await getAuth(request);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const incomeId = request.params.incomeId;

  const income = await getIncome(request, userId, incomeId);

  return json({ income: income });
};

export const action: ActionFunction = async (req) => {
  const { userId } = await getAuth(req);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const incomeId = req.params.incomeId;

  invariant(incomeId, 'Income ID must be defined');

  await deleteIncome(req, userId, incomeId);

  return redirect('/dashboard/incomes/all');
};

export default function Income() {
  const data = useLoaderData();

  const formattedCreatedDate = formatDate(data.income.created_at);
  const formattedUpdatedDate = data.income.updated_at
    ? formatDate(data.income.updated_at)
    : 'N/A';

  return (
    <div>
      <SignedIn>
        <section>
          <div className='container px-5 py-24 mx-auto'>
            <NavLink to='/dashboard/incomes/all'>
              <Button variant='outline'>
                <ArrowLeft className='mr-2' />
                Back
              </Button>
            </NavLink>
            <div className='text-center mb-20'>
              <h1 className='sm:text-3xl text-2xl font-medium text-center title-font mb-4'>
                Income Breakdown
              </h1>
              <p className='text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto'>
                The following is a detailed breakdown of your selected income
              </p>
            </div>
            <motion.ul
              className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full justify-items-center'
              variants={motionCardContainer}
              initial='hidden'
              animate='visible'
            >
              <DataCard
                cardName='Name:'
                cardDescription='The name of the income selected'
                content={data.income.name}
              />
              <DataCard
                cardName='Description:'
                cardDescription='The description of the income selected'
                content={data.income.description}
              />
              <DataCard
                cardName='Amount:'
                cardDescription='The amount of the income selected ($)'
                content={data.income.amount}
              />
              <DataCard
                cardName='Created On:'
                cardDescription='The date the income selected was created'
                content={formattedCreatedDate}
              />
              <DataCard
                cardName='Updated On:'
                cardDescription='The date the income selected was updated'
                content={formattedUpdatedDate}
              />
            </motion.ul>
            <div className='grid grid-cols-1 w-full justify-items-center mt-6'>
              <div className='flex flex-row space-x-4'>
                <NavLink to={`/dashboard/incomes/edit/${data.income.id}`}>
                  <Button variant='outline'>Edit</Button>
                </NavLink>
                <DeleteDialog name='Income' />
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
