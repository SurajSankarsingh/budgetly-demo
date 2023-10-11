import { ArrowBigLeft, ArrowBigRight, ClipboardCheck } from 'lucide-react';
import DashNav from '~/components/DashNav';

const navItems = [
  {
    id: '1',
    title: 'Incomes',
    href: '/dashboard/incomes',
    icon: <ArrowBigLeft />,
    style: 'text-teal-700 dark:text-teal-500',
    links: [
      {
        linkId: 'link-1',
        title: 'All Incomes',
        href: '/dashboard/incomes/all',
      },
      {
        linkId: 'link-2',
        title: 'New Income',
        href: '/dashboard/incomes/new',
      },
    ],
  },
  {
    id: '2',
    title: 'Expenses',
    href: '/dashboard/expenses',
    icon: <ArrowBigRight />,
    style: 'text-red-700 dark:text-red-500 ',
    links: [
      {
        linkId: 'link-1',
        title: 'All Expenses',
        href: '/dashboard/expenses/all',
      },
      {
        linkId: 'link-2',
        title: 'New Expense',
        href: '/dashboard/expenses/new',
      },
    ],
  },
  {
    id: '3',
    title: 'Trackers',
    href: '/dashboard/trackers',
    icon: <ClipboardCheck />,
    style: 'text-blue-700 dark:text-blue-500',
    links: [
      {
        linkId: 'link-1',
        title: 'All Trackers',
        href: '/dashboard/trackers/all',
      },
      {
        linkId: 'link-2',
        title: 'New Tracker',
        href: '/dashboard/trackers/new',
      },
    ],
  },
];

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className='mb-4'>
        <DashNav items={navItems} />
      </div>

      <div className='flex space-x-2 flex-col'>
        <div>{children}</div>
      </div>
    </div>
  );
}
