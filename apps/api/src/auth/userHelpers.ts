import { dbRead } from '../singleton/db';
import { Passkey } from './types';

const getUserPasskeys = async (userId: string): Promise<Passkey[]> => {
  const existingPasskeysSnapshot = await dbRead(`passkeys/${userId}/items`);

  // @ts-ignore
  if (!existingPasskeysSnapshot.exists) {
    return [];
  }
  // @ts-ignore
  const existingPasskeys = existingPasskeysSnapshot.data();

  return existingPasskeys;
};

const getUser = async (userId: string) => {
  return await dbRead(`users/${userId}`);
};

export { getUser, getUserPasskeys };
