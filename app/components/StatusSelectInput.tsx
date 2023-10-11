import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { cn } from '~/lib/utils';
import { motion } from 'framer-motion';
import { motionCardItem } from '~/lib/framer';

interface StatusSelectInputProps {
  className?: string;
  cardName: string;
  cardDescription: string;
  name: string;
}

export function StatusSelectInput({
  className,
  cardName,
  cardDescription,
  name,
}: StatusSelectInputProps) {
  return (
    <motion.div variants={motionCardItem}>
      <Card className={cn('w-[400px]', className)}>
        <CardHeader>
          <CardTitle>{cardName}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'></div>
            <Select name={name} defaultValue='incomplete'>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select a status' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value='incomplete'>Incomplete</SelectItem>
                  <SelectItem value='complete'>Complete</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
