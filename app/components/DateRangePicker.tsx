import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { endDateAtom, startDateAtom } from '~/lib/store';
import { useAtom } from 'jotai';

export function DateRangePicker() {
  const [startDate, setStartDate] = useAtom<Date>(startDateAtom);
  const [endDate, setEndDate] = useAtom<Date>(endDateAtom);

  return (
    <div className='flex flex-col md:flex-row space-y-2 md:space-x-4 md:space-y-0'>
      <div>
        <h2 className='capitalize pb-2'>Start Date: </h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {startDate ? (
                format(startDate, 'PPP')
              ) : (
                <span>Pick a start date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              disabled={{ after: endDate }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <h2 className='capitalize pb-2'>End Date: </h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !endDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {endDate ? format(endDate, 'PPP') : <span>Pick a end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              disabled={{ before: startDate }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
