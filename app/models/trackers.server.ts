import { getDB } from '~/utils';

const dbErrorMessage = 'There was an error connecting to the database.';

const dataErrorMessage = 'There was an error retrieving the data.';

export interface Tracker {
  id: string;
  user_id: string;
  name: string;
  description: string;
  target_date: Date;
  status: string;
  target_amount: number;
  created_at: string;
  updated_at: string;
}

export async function getIncompleteTrackerNames(request: any, userId: string) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('tracker')
    .select('name, id')
    .match({ user_id: userId })
    .eq('status', 'incomplete');

  if (!data) {
    return { message: dataErrorMessage };
  }

  return data;
}

export async function getTrackers(request: any, userId: string) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('tracker')
    .select('*')
    .match({ user_id: userId });

  if (!data) {
    return { message: dataErrorMessage };
  }

  return data;
}

export async function getTracker(
  request: any,
  userId: string,
  trackerId: string | undefined
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('tracker')
    .select('*')
    .match({ user_id: userId, id: trackerId });

  if (!data) {
    return { message: dataErrorMessage };
  }

  return data[0];
}

export async function createTracker(
  request: any,
  name: string,
  description: string,
  target_amount: number,
  target_date: Date,
  userId: string
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db.from('tracker').insert([
    {
      name,
      description,
      target_amount,
      target_date,
      status: 'incomplete',
      user_id: userId,
    },
  ]);

  if (!data) {
    return { message: dataErrorMessage };
  }

  return null;
}

export async function updateTracker(
  request: any,
  name: string,
  description: string,
  target_amount: number,
  target_date: Date,
  status: string,
  userId: string,
  trackerId: string
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('tracker')
    .update({
      name: name,
      description: description,
      target_amount: target_amount,
      target_date: target_date,
      status: status,
    })
    .match({ user_id: userId })
    .eq('id', trackerId);

  if (!data) {
    return { message: dataErrorMessage };
  }

  return null;
}

export async function deleteTracker(
  request: any,
  userId: string,
  trackerId: string
) {
  const db = await getDB(request);
  if (!db) {
    return { message: dbErrorMessage };
  }

  const { data } = await db
    .from('tracker')
    .delete()
    .match({ user_id: userId })
    .eq('id', trackerId);

  if (!data) {
    return { message: dataErrorMessage };
  }

  return null;
}
