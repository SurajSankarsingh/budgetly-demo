import { useIsSubmitting } from 'remix-validated-form';
import { Button } from './ui/button';
import { SendHorizontal, CircleDashed } from 'lucide-react';

type SubmitButtonProps = {
  name: string;
};

export const SubmitButton = ({ name }: SubmitButtonProps) => {
  const isSubmitting = useIsSubmitting();
  return (
    <>
      {name === 'update' ? (
        <Button
          variant='outline'
          type='submit'
          disabled={isSubmitting}
          className='font-bold text-md'
        >
          {isSubmitting ? 'Updating...' : 'Update'}
          {isSubmitting ? (
            <CircleDashed
              className={`ml-2 w-4 h-4 animate-spin ${
                isSubmitting ? 'hover:animate-spin' : ''
              }`}
            />
          ) : (
            <SendHorizontal className='ml-2 w-4 h-4 hover:animate-ping' />
          )}
        </Button>
      ) : (
        <Button
          variant='outline'
          type='submit'
          disabled={isSubmitting}
          className='font-bold text-md'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
          {isSubmitting ? (
            <CircleDashed
              className={`ml-2 w-4 h-4 animate-spin ${
                isSubmitting ? 'hover:animate-spin' : ''
              }`}
            />
          ) : (
            <SendHorizontal className='ml-2 w-4 h-4 hover:animate-ping' />
          )}
        </Button>
      )}
    </>
  );
};
