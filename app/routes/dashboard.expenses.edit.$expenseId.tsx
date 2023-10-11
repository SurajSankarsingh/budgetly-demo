import { NavLink, useActionData, useLoaderData } from '@remix-run/react';
import {
  type LoaderFunction,
  json,
  ActionFunction,
  redirect,
} from '@remix-run/node';
import { SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';

import { getExpense, updateExpense } from '~/models/expenses.server';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { InputCard } from '~/components/InputCard';
import { ValidatedForm, validationError } from 'remix-validated-form';

import { expenseValidator } from '~/validationSchemas/expenseValidator';
import { ErrorAlert } from '~/components/ErrorAlert';
import { SubmitButton } from '~/components/SubmitButton';
import invariant from 'tiny-invariant';
import { SelectTrackerInputCard } from '~/components/SelectTrackerInputCard';
import { getIncompleteTrackerNames } from '~/models/trackers.server';
import { motion } from 'framer-motion';
import { motionCardContainer } from '~/lib/framer';

export const loader: LoaderFunction = async (request) => {
  const { userId } = await getAuth(request);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const expenseId = request.params.expenseId;

  const expense = await getExpense(request, userId, expenseId);
  const trackers = await getIncompleteTrackerNames(request, userId);

  return json({ expense: expense, trackers: trackers });
};

export const action: ActionFunction = async (req) => {
  const { userId } = await getAuth(req);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const expenseResult = await expenseValidator.validate(
    await req.request.formData()
  );

  if (expenseResult.error) {
    return validationError(expenseResult.error);
  }

  const { name, description, amount } = expenseResult.data;

  const trackerId = expenseResult.data.id;

  const expenseId = req.params.expenseId;

  invariant(expenseId, 'expense ID must be defined');

  await updateExpense(
    req,
    name,
    description,
    amount,
    userId,
    expenseId,
    trackerId
  );

  return redirect(`/dashboard/expenses/${expenseId}`);
};

export default function EditExpense() {
  const expenseData = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <SignedIn>
        <section>
          <div className='container px-5 py-24 mx-auto'>
            <NavLink to={`/dashboard/expenses/${expenseData.expense.id}`}>
              <Button variant='outline'>
                <ArrowLeft className='mr-2' />
                Back
              </Button>
            </NavLink>
            <div className='text-center mb-20'>
              <h1 className='sm:text-3xl text-2xl font-medium text-center title-font mb-4'>
                Expense Breakdown
              </h1>
              <p className='text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto'>
                The following is a detailed breakdown of your selected expense
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
                  defaultValue={expenseData.expense.name}
                />
                <InputCard
                  cardName='Description:'
                  name='description'
                  type='text'
                  cardDescription='The description of the expense to be entered'
                  defaultValue={expenseData.expense.description}
                />
                <InputCard
                  cardName='Amount:'
                  name='amount'
                  type='number'
                  cardDescription='The amount of the expense to be entered ($)'
                  defaultValue={expenseData.expense.amount}
                />
                <SelectTrackerInputCard
                  cardName='Tracker:'
                  id='tracker'
                  cardDescription='The tracker to be associated with the expense, if not applicable either leave blank or select N/A'
                  trackers={expenseData.trackers}
                  defaultValue={expenseData.expense.tracker_id.id}
                />
              </motion.ul>
              {actionData ? (
                <div className='grid grid-cols-1 w-full justify-items-center mt-6'>
                  <ErrorAlert
                    name={actionData.title}
                    message={actionData.description}
                  />
                </div>
              ) : null}
              <div className='grid grid-cols-1 w-full justify-items-center mt-6'>
                <SubmitButton name='update' />
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
