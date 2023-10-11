import { Form, useNavigation } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

type DeleteDialogProps = {
  name: string;
};

export function DeleteDialog({ name }: DeleteDialogProps) {
  const navigation = useNavigation();

  const text =
    navigation.state === 'submitting'
      ? 'Deleting...'
      : navigation.state === 'loading'
      ? 'Deleted!'
      : 'Delete';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Delete</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete {name}</DialogTitle>
          <DialogDescription>
            {`This action cannot be undone. This will permanently delete your ${name} from our servers.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Form method='post'>
            <Button type='submit'>{text}</Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
