import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { formatDate } from '~/lib/formatDate';
import { motionCardItem } from '~/lib/framer';

import { cn } from '~/lib/utils';

type DataCardProps = {
  className?: string;
  cardName: string;
  cardDescription: string;
  content?: string;
  date?: Date;
};

export function DataCard({
  className,
  cardName,
  cardDescription,
  content,
  date,
}: DataCardProps) {
  return (
    <motion.div variants={motionCardItem}>
      <Card className={cn('w-[380px]', className)}>
        <CardHeader>
          <CardTitle>{cardName}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className=' flex items-center space-x-4 rounded-md border p-4 bg-background'>
            <div className='flex-1 space-y-1 '>
              <p className='text-sm font-medium leading-none capitalize '>
                {content ? content : date ? formatDate(date.toISOString()) : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default DataCard;
