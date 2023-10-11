import { getDB } from '~/utils';
import { tr } from 'date-fns/locale';

const dbErrorMessage = 'There was an error connecting to the database.';

const dataErrorMessage = 'There was an error retrieving the data.';

export interface Expense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  description: string;
  created_at: string;
  updated_at: string;
  tracker_id?: {
    id: string;
    name: string;
  };
}

export async function getExpenses(request: any, userId: string) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('expense')
    .select(`*, tracker_id:tracker_id(id, name)`)
    .match({ user_id: userId });

  if (!data) {
    return { message: dataErrorMessage };
  }

  return data;
}

export async function getExpensesByTracker(
  request: any,
  userId: string,
  trackerId: string | undefined
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('expense')
    .select('amount')
    .match({ user_id: userId, tracker_id: trackerId });

  if (!data) {
    return { message: dataErrorMessage };
  }

  return data;
}

export async function getExpense(
  request: any,
  userId: string,
  expenseId: string | undefined
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('expense')
    .select(`*, tracker_id:tracker_id(id, name)`)
    .match({ user_id: userId, id: expenseId });

  if (!data) {
    return { message: dataErrorMessage };
  }

  return data[0];
}

export async function createExpense(
  request: any,
  name: string,
  description: string,
  amount: number,
  userId: string,
  trackerId: string | null
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('expense')
    .insert({
      name: name,
      description: description,
      amount: amount,
      user_id: userId,
      tracker_id: trackerId ? trackerId : null,
    })
    .single();

  if (!data) {
    return { message: dataErrorMessage };
  }

  return null;
}

export async function updateExpense(
  request: any,
  name: string,
  description: string,
  amount: number,
  userId: string,
  expenseId: string,
  trackerId: string | null
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('expense')
    .update({
      name: name,
      description: description,
      amount: amount,
      tracker_id: trackerId ? trackerId : null,
    })
    .match({ user_id: userId })
    .eq('id', expenseId);

  if (!data) {
    return { message: dataErrorMessage };
  }

  return null;
}

export async function deleteExpense(
  request: any,
  userId: string,
  expenseId: string
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('expense')
    .delete()
    .match({ user_id: userId })
    .eq('id', expenseId);

  if (!data) {
    return { message: dataErrorMessage };
  }

  return null;
}
