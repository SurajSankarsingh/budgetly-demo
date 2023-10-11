import type { V2_MetaFunction } from '@remix-run/node';

import MainLayout from '~/layouts/MainLayout';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Remix Budget | Home' },
    { name: 'description', content: 'Budget App built using Remix' },
  ];
};

export default function Index() {
  return (
    <MainLayout>
      <section className='flex flex-col justify-items-center items-center mx-6 whitespace-normal'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          Welcome to Budgetly
        </h1>
        <p className='leading-7 [&:not(:first-child)]:mt-6 text-lg break-words'>
          This is a budget app built using{' '}
          <a
            className='text-blue-500 hover:text-blue-700'
            href='https://remix.run'
            target='_blank'
            rel='noopener noreferrer'
          >
            Remix
          </a>
          . It uses{' '}
          <a
            className='text-blue-500 hover:text-blue-700'
            href='https://clerk.dev'
            target='_blank'
            rel='noopener noreferrer'
          >
            Clerk
          </a>{' '}
          for authentication and{' '}
          <a
            className='text-blue-500 hover:text-blue-700'
            href='https://supabase.io'
            target='_blank'
            rel='noopener noreferrer'
          >
            Supabase
          </a>{' '}
          for the database. It also uses{' '}
          <a
            className='text-blue-500 hover:text-blue-700'
            href='https://tailwindcss.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            Tailwind CSS
          </a>{' '}
          and the{' '}
          <a
            className='text-blue-500 hover:text-blue-700'
            href='https://ui.shadcn.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Shadcn
          </a>{' '}
          UI Kit. It is hosted on{' '}
          <a
            className='text-blue-500 hover:text-blue-700'
            href='https://netlify.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            Netlify.
          </a>
        </p>
      </section>
    </MainLayout>
  );
}
