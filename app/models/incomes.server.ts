import { getDB } from '~/utils';

const dbErrorMessage = 'There was an error connecting to the database.';

const dataErrorMessage = 'There was an error retrieving the data.';

export interface Income {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export async function getIncomes(request: any, userId: string) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('income')
    .select('*')
    .match({ user_id: userId });

  if (!data) {
    return { message: dataErrorMessage };
  }

  return data;
}

export async function getIncome(
  request: any,
  userId: string,
  incomeId: string | undefined
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('income')
    .select('*')
    .match({ user_id: userId, id: incomeId });

  if (!data) {
    return { message: dataErrorMessage };
  }

  return data[0];
}

export async function createIncome(
  request: any,
  name: string,
  description: string,
  amount: number,
  userId: string
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('income')
    .insert({
      name: name,
      description: description,
      amount: amount,
      user_id: userId,
    })
    .single();

  if (!data) {
    return { message: dataErrorMessage };
  }

  return null;
}

export async function updateIncome(
  request: any,
  name: string,
  description: string,
  amount: number,
  userId: string,
  incomeId: string
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('income')
    .update({
      name: name,
      description: description,
      amount: amount,
    })
    .match({ user_id: userId })
    .eq('id', incomeId);

  if (!data) {
    return { message: dataErrorMessage };
  }

  return null;
}

export async function deleteIncome(
  request: any,
  userId: string,
  incomeId: string
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('income')
    .delete()
    .match({ user_id: userId })
    .eq('id', incomeId);

  if (!data) {
    return { message: dataErrorMessage };
  }

  return null;
}
