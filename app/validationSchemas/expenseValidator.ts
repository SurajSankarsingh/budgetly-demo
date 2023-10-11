import { z } from 'zod';
import { withZod } from '@remix-validated-form/with-zod';

export const expenseValidator = withZod(
  z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    description: z
      .string()
      .min(5, 'Description must be at least 5 characters')
      .max(100, 'Description must be less than 100 characters'),
    amount: z.coerce
      .number()
      .min(0, 'Amount must be at least 0')
      .max(1_000_000_000, 'Amount must be less than 1,000,000, 000'),
    id: z.string(),
  })
);
