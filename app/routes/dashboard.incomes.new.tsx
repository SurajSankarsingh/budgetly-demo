import { NavLink, useActionData } from '@remix-run/react';
import { ActionFunction, redirect } from '@remix-run/node';

import { SignedIn, SignedOut } from '@clerk/remix';

import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { InputCard } from '~/components/InputCard';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { SubmitButton } from '~/components/SubmitButton';

import { getAuth } from '@clerk/remix/ssr.server';
import { createIncome } from '~/models/incomes.server';
import { ErrorAlert } from '~/components/ErrorAlert';

import { incomeValidator } from '~/validationSchemas/incomeValidator';
import { motionCardContainer } from '~/lib/framer';
import { motion } from 'framer-motion';

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

  await createIncome(req, name, description, amount, userId);

  return redirect('/dashboard/incomes/all');
};

export default function NewIncome() {
  const data = useActionData();

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
                New Income Form
              </h1>
              <p className='text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto'>
                The following is a form to enter a new income. Please fill out
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
                  placeholder='Enter the name of the income'
                />
                <InputCard
                  cardName='Description:'
                  name='description'
                  type='text'
                  cardDescription='The description of the income to be entered'
                  placeholder='Enter the description of the income'
                />
                <InputCard
                  cardName='Amount:'
                  name='amount'
                  type='number'
                  cardDescription='The amount of the income to be entered ($)'
                  placeholder='Enter the amount of the income'
                />
              </motion.ul>
              {data ? (
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
