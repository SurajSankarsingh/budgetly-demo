import { NavLink, useActionData, useLoaderData } from '@remix-run/react';
import {
  type LoaderFunction,
  json,
  ActionFunction,
  redirect,
} from '@remix-run/node';
import { SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';

import { getTracker, updateTracker } from '~/models/trackers.server';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { InputCard } from '~/components/InputCard';
import { ValidatedForm, validationError } from 'remix-validated-form';

import { trackerValidator } from '~/validationSchemas/trackerValidator';
import { ErrorAlert } from '~/components/ErrorAlert';
import { SubmitButton } from '~/components/SubmitButton';
import invariant from 'tiny-invariant';
import { DateInputCard } from '~/components/DateInputCard';

import { useAtomValue } from 'jotai';
import { targetDateAtom } from '~/lib/store';
import { StatusSelectInput } from '~/components/StatusSelectInput';
import { ta } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { motionCardContainer } from '~/lib/framer';

export const loader: LoaderFunction = async (request) => {
  const { userId } = await getAuth(request);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const trackerId = request.params.trackerId;

  const tracker = await getTracker(request, userId, trackerId);

  return json({ tracker: tracker });
};

export const action: ActionFunction = async (req) => {
  const { userId } = await getAuth(req);

  if (!userId) {
    return { message: 'You must be signed in to view this page.' };
  }

  const trackerResult = await trackerValidator.validate(
    await req.request.formData()
  );

  if (trackerResult.error) {
    return validationError(trackerResult.error);
  }
  console.log(trackerResult.data);

  const { name, description, target_amount, target_date, status } =
    trackerResult.data;

  const trackerId = req.params.trackerId;

  invariant(trackerId, 'tracker ID must be defined');

  console.log(name, description, target_amount, target_date, status);

  await updateTracker(
    req,
    name,
    description,
    target_amount,
    target_date,
    status,
    userId,
    trackerId
  );

  return redirect(`/dashboard/trackers/${trackerId}`);
};

export default function EditTracker() {
  const data = useLoaderData();
  const actionData = useActionData();
  const targetDate = useAtomValue(targetDateAtom);
  targetDate.setHours(23, 59, 59, 999);

  return (
    <div>
      <SignedIn>
        <section>
          <div className='container px-5 py-24 mx-auto'>
            <NavLink to={`/dashboard/trackers/${data.tracker.id}`}>
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
            <ValidatedForm validator={trackerValidator} method='post'>
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
                  cardDescription='The name of the tracker to be entered'
                  defaultValue={data.tracker.name}
                />
                <InputCard
                  cardName='Description:'
                  name='description'
                  type='text'
                  cardDescription='The description of the tracker to be entered'
                  defaultValue={data.tracker.description}
                />
                <InputCard
                  cardName='Target Amount:'
                  name='target_amount'
                  type='number'
                  cardDescription='The target amount of the tracker to be entered ($)'
                  defaultValue={data.tracker.target_amount}
                />
                <DateInputCard
                  cardName='Target Date:'
                  name='target_date'
                  cardDescription='The target date of the tracker to be entered'
                />
                <input
                  type='hidden'
                  name='target_date'
                  value={targetDate.toISOString()}
                />

                <StatusSelectInput
                  cardName='Status:'
                  name='status'
                  cardDescription='The status of the tracker to be entered'
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
