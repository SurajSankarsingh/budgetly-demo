import { cn } from '~/lib/utils';
import { NavLink } from '@remix-run/react';
import clsx from 'clsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from '~/components/ui/sheet';
import { Button } from './ui/button';
import { ChevronRightSquare } from 'lucide-react';

interface NavLinkProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    id: string;
    title: string;
    href: string;
    icon: React.ReactComponentElement<any>;
    style: string;
    links?: {
      linkId: string;
      title: string;
      href: string;
    }[];
  }[];
}

export default function DashNav({ className, items, ...props }: NavLinkProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' className='ml-4'>
          <ChevronRightSquare />
          <span className='pl-2 font-semibold'>Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='bg-background'>
        <SheetHeader className='uppercase font-semibold text-2xl'>
          Budgetly
        </SheetHeader>
        <nav
          className={cn(
            'min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased',
            className
          )}
          {...props}
        >
          <div className='flex flex-col top-0 left-0 w-full h-full'>
            <div className='overflow-y-auto overflow-x-hidden flex-grow'>
              {items.map((item) => (
                <Accordion
                  key={item.id}
                  type='single'
                  collapsible
                  className='hover:bg-background/80 hover:border-primary w-full'
                >
                  <AccordionItem value={item.id}>
                    <AccordionTrigger>
                      <span
                        className={clsx(
                          'inline-flex justify-center items-center ml-4 font-semibold',
                          item.style
                        )}
                      >
                        {item.icon}
                        <span className='ml-2 text-sm tracking-wide truncate font-serif'>
                          {item.title}
                        </span>
                      </span>
                    </AccordionTrigger>
                    {item.links?.map((link) => (
                      <AccordionContent key={link.linkId}>
                        <NavLink
                          to={link.href}
                          className='flex flex-col items-center hover:text-primary text-md text-'
                        >
                          {link.title}
                        </NavLink>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
