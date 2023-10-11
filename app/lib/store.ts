import { atom } from 'jotai';
import { addDays } from 'date-fns';

const firstDate = new Date();

export const startDateAtom = atom(
  new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)
);

export const endDateAtom = atom(
  addDays(new Date(firstDate.getFullYear(), firstDate.getMonth()), 30)
);

export const targetDateAtom = atom(new Date());
