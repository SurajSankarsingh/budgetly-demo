import { AlertCircle, FileWarning, Terminal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

type ErrorAlertProps = {
  name: string;
  message: string;
};

export function ErrorAlert({ name, message }: ErrorAlertProps) {
  return (
    <Alert
      variant='destructive'
      className='text-red-500 text-md border-red-500 border-2'
    >
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>{name}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
