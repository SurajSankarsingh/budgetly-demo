import { getAuth } from '@clerk/remix/ssr.server';
import { LoaderFunction, redirect, V2_MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import DashLayout from '~/layouts/DashLayout';

import MainLayout from '~/layouts/MainLayout';

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

  return {};
};

export default function Dashboard() {
  return (
    <MainLayout>
      <DashLayout>
        <Outlet />
      </DashLayout>
    </MainLayout>
  );
}
