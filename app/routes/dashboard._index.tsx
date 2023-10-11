import { getAuth } from '@clerk/remix/ssr.server';
import { createClerkClient } from '@clerk/remix/api.server';
import { LoaderFunction, redirect, V2_MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Remix Budget | Dashboard' },
    { name: 'description', content: 'Budget App built using Remix' },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect('/sign-in');
  }

  const user = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId);

  return { user };
};

export default function DashboardIndex() {
  const { user } = useLoaderData();
  return (
    <section className='flex flex-col justify-items-center items-center mx-6 whitespace-normal'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
        Welcome {user.firstName}
      </h1>

      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Please click on the Menu button on the top left to view your options.
      </p>
      <h3 className='mt-8 scroll-m-20 text-2xl font-semibold tracking-tight'>
        Income
      </h3>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Allows you to create, view and edit your income listings
      </p>
      <h3 className='mt-8 scroll-m-20 text-2xl font-semibold tracking-tight'>
        Expense
      </h3>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Allows you to create, view and edit your expense listings
      </p>
      <h3 className='mt-8 scroll-m-20 text-2xl font-semibold tracking-tight'>
        Tracker
      </h3>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Allows you to create, view and edit your tracker listings
      </p>

      <p className='leading-7 [&:not(:first-child)]:mt-6 text-lg font-semibold'>
        Each option allows you to view a table and chart of your respective
        listings and filter by date range.
      </p>
    </section>
  );
}
