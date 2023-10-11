import { NavLink, useActionData, useLoaderData } from '@remix-run/react';
import {
  type LoaderFunction,
  json,
  ActionFunction,
  redirect,
} from '@remix-run/node';
import { SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';

import { getIncome, updateIncome } from '~/models/incomes.server';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { InputCard } from '~/components/InputCard';
import { ValidatedForm, validationError } from 'remix-validated-form';

import { incomeValidator } from '~/validationSchemas/incomeValidator';
import { ErrorAlert } from '~/components/ErrorAlert';
import { SubmitButton } from '~/components/SubmitButton';
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

  const result = await incomeValidator.validate(await req.request.formData());

  if (result.error) {
    return validationError(result.error);
  }

  const { name, description, amount } = result.data;

  const incomeId = req.params.incomeId;

  invariant(incomeId, 'Income ID must be defined');

  await updateIncome(req, name, description, amount, userId, incomeId);

  return redirect(`/dashboard/incomes/${incomeId}`);
};

export default function EditIncome() {
  const data = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <SignedIn>
        <section>
          <div className='container px-5 py-24 mx-auto'>
            <NavLink to={`/dashboard/incomes/${data.income.id}`}>
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
            <ValidatedForm validator={incomeValidator} method='post'>
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
                  cardDescription='The name of the income to be entered'
                  defaultValue={data.income.name}
                />
                <InputCard
                  cardName='Description:'
                  name='description'
                  type='text'
                  cardDescription='The description of the income to be entered'
                  defaultValue={data.income.description}
                />
                <InputCard
                  cardName='Amount:'
                  name='amount'
                  type='number'
                  cardDescription='The amount of the income to be entered ($)'
                  defaultValue={data.income.amount}
                />
              </motion.ul>
              {actionData ? (
                <div className='grid grid-cols-1 w-full justify-items-center mt-6'>
                  <ErrorAlert name={data.title} message={data.description} />
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
