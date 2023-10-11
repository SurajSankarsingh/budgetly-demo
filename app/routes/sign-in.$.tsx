import { SignIn } from '@clerk/remix';
import { NavLink } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='space-y-4'>
        <NavLink to='/'>
          <Button className='text-md font-semibold'>
            <ArrowLeft className='mr-2' />
            Home
          </Button>
        </NavLink>
        <SignIn
          routing={'path'}
          path={'/sign-in'}
          signUpUrl={'/sign-up'}
          afterSignInUrl={'/dashboard'}
          appearance={{
            elements: {
              card: 'bg-background border-border dark:bg-card dark:border-border items-center',
              headerTitle: 'dark:text-foreground text-foreground',
              headerSubtitle: 'dark:text-foreground text-foreground',
              socialButtonsBlockButton:
                'bg-primary dark:bg-primary dark:text-foreground text-foreground hover:bg-primary/90 dark:hover:bg-primary/90',
              socialButtonsBlockButtonText__google:
                'dark:text-primary-foreground font-medium text-background',
              socialButtonsBlockButtonArrow__google:
                'dark:text-primary-foreground font-medium text-background',
              dividerLine: 'bg-accent-foreground dark:bg-accent',
              dividerText: 'dark:text-foreground text-foreground',
              formFieldLabel: 'dark:text-foreground text-foreground',
              formFieldInput:
                'border-ring dark:border-ring dark:text-foreground text-foreground',
              formFieldInput__identifier:
                'dark:text-foreground text-foreground',
              formFieldInput__password:
                'dark:text-primary-foreground text-foreground',
              formButtonPrimary:
                'bg-primary dark:bg-primary dark:text-primary-foreground text-background hover:bg-primary/90 dark:hover:bg-primary/90',
              footerActionText: 'dark:text-foreground text-foreground',
              footerActionLink:
                'dark:text-primary text-primary hover:text-primary/90 dark:hover:text-primary/90',
              identityPreviewText: 'dark:text-foreground text-foreground',
            },
          }}
        />
      </div>
    </div>
  );
}
