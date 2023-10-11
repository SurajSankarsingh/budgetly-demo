import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useField } from 'remix-validated-form';
import { useAtom } from 'jotai';
import { targetDateAtom } from '~/lib/store';
import { Label } from './ui/label';
import { motion } from 'framer-motion';
import { motionCardItem } from '~/lib/framer';

interface DateInputCardProps {
  className?: string;
  cardName: string;
  name: string;
  cardDescription: string;
}

export function DateInputCard({
  className,
  cardName,
  name,
  cardDescription,
}: DateInputCardProps) {
  const { error, getInputProps: dateProps } = useField(name) as any;
  const [date, setDate] = useAtom(targetDateAtom);

  return (
    <motion.div variants={motionCardItem}>
      <Card className={cn('w-[400px]', className)}>
        <CardHeader>
          <CardTitle>{cardName}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor={name}>{cardName}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[280px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    {...dateProps({ id: name })}
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          {error && (
            <span className='text-red-500 font-bold text-sm'>{error}</span>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
