import { SignedIn, SignedOut, UserButton } from '@clerk/remix';
import { NavLink } from '@remix-run/react';
import ThemeToggle from './ThemeToggle';

export default function NavBar() {
  return (
    <div className='flex justify-between mx-4 my-2'>
      <div className='p-4'>
        <NavLink to='/' className='text-2xl uppercase'>
          Budgetly
        </NavLink>
      </div>

      <div className='flex flex-row space-x-4 items-center'>
        <SignedOut>
          <NavLink
            to='/sign-in'
            className='uppercase font-bold group transition duration-300 ease-in-out'
          >
            Login/SignUp
            <span className='block max-w-0 group-hover:max-w-full transition-all duration-500 ease-out h-0.5 bg-primary/70'></span>
          </NavLink>
        </SignedOut>
        <SignedIn>
          <div className='flex flex-row items-center space-x-4'>
            <NavLink
              to='/dashboard'
              className='uppercase font-bold group transition duration-300 ease-in-out'
            >
              Dashboard
              <span className='block max-w-0 group-hover:max-w-full transition-all duration-500 ease-out h-0.5 bg-primary/70'></span>
            </NavLink>
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                elements: {
                  userButtonPopoverCard:
                    'bg-background dark:bg-background border-border dark:border-border',
                  userPreviewMainIdentifier:
                    'text-foreground dark:text-foreground',
                  userPreviewSecondaryIdentifier:
                    'text-foreground dark:text-foreground',
                  userButtonPopoverActionButtonIcon__manageAccount:
                    'text-foreground dark:text-foreground',
                  userButtonPopoverActionButtonIcon__signOut:
                    'text-foreground dark:text-foreground',
                  userButtonPopoverActionButtonText:
                    'text-foreground dark:text-foreground',
                  // userButtonPopoverFooter:
                  //   'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50',
                },
              }}
            />
          </div>
        </SignedIn>
        <div className='p-2'>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
