import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

import { cn } from '~/lib/utils';

import { useField } from 'remix-validated-form';
import { motion } from 'framer-motion';
import { motionCardItem } from '~/lib/framer';

interface InputCardProps {
  className?: string;
  cardName: string;
  name: string;
  type: string;
  cardDescription: string;
  placeholder?: string;
  defaultValue?: string;
}

export function InputCard({
  className,
  cardName,
  name,
  type,
  cardDescription,
  placeholder,
  defaultValue,
}: InputCardProps) {
  const { error, getInputProps } = useField(name);

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
              <Input
                {...getInputProps({ id: name })}
                placeholder={placeholder}
                type={type}
                required
                defaultValue={defaultValue}
              />
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
