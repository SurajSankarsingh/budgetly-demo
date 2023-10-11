import { NavLink, useActionData, useLoaderData } from '@remix-run/react';
import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from '@remix-run/node';

import { SignedIn, SignedOut } from '@clerk/remix';

import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { InputCard } from '~/components/InputCard';
import { SelectTrackerInputCard } from '~/components/SelectTrackerInputCard';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { SubmitButton } from '~/components/SubmitButton';

import { getAuth } from '@clerk/remix/ssr.server';

import { ErrorAlert } from '~/components/ErrorAlert';
import { createExpense } from '~/models/expenses.server';

import { expenseValidator } from '~/validationSchemas/expenseValidator';
import { getIncompleteTrackerNames } from '~/models/trackers.server';
import { motion } from 'framer-motion';
import { motionCardContainer } from '~/lib/framer';

export const loader: LoaderFunction = async (request) => {
  const { userId } = await getAuth(request);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const trackers = await getIncompleteTrackerNames(request, userId);

  return json({ trackers: trackers });
};

export const action: ActionFunction = async (req) => {
  const { userId } = await getAuth(req);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const result = await expenseValidator.validate(await req.request.formData());

  if (result.error) {
    return validationError(result.error);
  }

  const { name, description, amount } = result.data;

  const trackerId = result.data.id;

  await createExpense(req, name, description, amount, userId, trackerId);

  return redirect('/dashboard/expenses/all');
};

export default function NewExpense() {
  const data = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <SignedIn>
        <section>
          <div className='container px-5 py-24 mx-auto'>
            <NavLink to='/dashboard/expenses/all'>
              <Button variant='outline'>
                <ArrowLeft className='mr-2' />
                Back
              </Button>
            </NavLink>
            <div className='text-center mb-20'>
              <h1 className='sm:text-3xl text-2xl font-medium text-center title-font mb-4'>
                New Expense Form
              </h1>
              <p className='text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto'>
                The following is a form to enter a new expense. Please fill out
              </p>
            </div>
            <ValidatedForm validator={expenseValidator} method='post'>
              <motion.ul
                className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full justify-items-center'
                variants={motionCardContainer}
                initial='hidden'
                animate='visible'
              >
                <InputCard
                  cardName='Name:'
                  name='name'
                  type='text'
                  cardDescription='The name of the expense to be entered'
                  placeholder='Enter the name of the expense'
                />
                <InputCard
                  cardName='Description:'
                  name='description'
                  type='text'
                  cardDescription='The description of the expense to be entered'
                  placeholder='Enter the description of the expense'
                />
                <InputCard
                  cardName='Amount:'
                  name='amount'
                  type='number'
                  cardDescription='The amount of the expense to be entered ($)'
                  placeholder='Enter the amount of the expense'
                />
                <SelectTrackerInputCard
                  cardName='Tracker:'
                  id='tracker'
                  cardDescription='The tracker to be associated with the expense, if not applicable either leave blank or select N/A'
                  trackers={data.trackers}
                />
              </motion.ul>
              {actionData ? (
                <div className='grid grid-cols-1 w-full justify-items-center mt-6'>
                  <ErrorAlert name={data.title} message={data.description} />
                </div>
              ) : null}
              <div className='grid grid-cols-1 w-full justify-items-center mt-6'>
                <SubmitButton name='create' />
              </div>
            </ValidatedForm>
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
