import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '~/components/ui/select';

import { cn } from '~/lib/utils';
import { useField } from 'remix-validated-form';
import { motion } from 'framer-motion';
import { motionCardItem } from '~/lib/framer';

interface SelectInputCardProps {
  className?: string;
  cardName: string;
  id: string;
  cardDescription: string;
  defaultValue?: string;
  trackers: {
    id: string;
    name: string;
  }[];
}

export function SelectTrackerInputCard({
  className,
  cardName,
  id,
  cardDescription,
  trackers,
  defaultValue,
}: SelectInputCardProps) {
  //? the useField hook is from remix-validated-form and is used to get the props for the select input field, it matches the id of the input field to the id of the field in the validation schema
  const { error, getInputProps: selectProps } = useField('id') as any;
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
              <Select {...selectProps({ id: id })} defaultValue={defaultValue}>
                <SelectTrigger className='w-[250px]'>
                  <SelectValue placeholder='Select a tracker' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Trackers</SelectLabel>
                    <SelectItem value=''>N/A</SelectItem>
                    {trackers && (
                      <>
                        {trackers.map((tracker) => (
                          <SelectItem
                            key={tracker.id}
                            value={tracker.id}
                            className='capitalize'
                          >
                            {tracker.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
