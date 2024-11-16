import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';
import { webcrypto } from 'crypto';
import {
  generateRegistrationOptions,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { dbAddDoc, dbRead, dbUpdateDoc } from '../singleton/db';
import { getUser, getUserPasskeys } from './userHelpers';
import { Passkey, UserModel } from './types';
import { ORIGIN, RP_ID, RP_NAME } from './config';

// @ts-ignore
if (!global.crypto) global.crypto = webcrypto;

const setCurrentRegistrationOptions = async (
  userId: string,
  options: PublicKeyCredentialCreationOptionsJSON
) => {
  await dbUpdateDoc(`users/${userId}`, {
    passkeyRegistrationOptions: options,
  });
};

const generateOptions = async (userId: string) => {
  // (Pseudocode) Retrieve the user from the database
  // after they've logged in
  const userSnapshot = await dbRead(`users/${userId}`);

  // @ts-ignore
  if (!userSnapshot.exists) {
    return undefined;
  }
  // @ts-ignore
  const user = userSnapshot.data();
  // console.log('user data', user);
  // console.log('user data key', user.ref.id);

  // const user: UserModel = getUserFromDB(loggedInUserId);
  // (Pseudocode) Retrieve any of the user's previously-
  // registered authenticators
  const userPasskeys = await getUserPasskeys(userId);
  console.log('userPasskeys', userPasskeys);

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: user.username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: 'none',
    // Prevent users from re-registering existing authenticators
    excludeCredentials: userPasskeys.map(passkey => ({
      id: passkey.id,
      // Optional
      transports: passkey.transports,
    })),
    // See "Guiding use of authenticators via authenticatorSelection" below
    authenticatorSelection: {
      // Defaults
      residentKey: 'preferred',
      userVerification: 'preferred',
      // Optional
      authenticatorAttachment: 'platform',
    },
  });

  // (Pseudocode) Remember these options for the user
  setCurrentRegistrationOptions(userId, options);

  return options;
};

const verify = async (userId: string, credential: any) => {
  let isVerified = false;
  const userSnapshot = await getUser(userId);

  // @ts-ignore
  if (!userSnapshot.exists) {
    return {
      isVerified,
    };
  }

  // @ts-ignore
  const user = userSnapshot.data();
  console.log('user data', user);
  const { passkeyRegistrationOptions: currentOptions } = user;

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: currentOptions.challenge,
      expectedOrigin: [ORIGIN, `${ORIGIN}:3003`],
      expectedRPID: [RP_ID, `${RP_ID}:3003`],
    });
  } catch (error) {
    console.error(error);
    return {
      isVerified,
    };
  }

  return {
    isVerified: verification.verified,
    verification,
    user,
  };
};

const saveNewPasskey = async (
  firebaseUserId: string,
  user: UserModel,
  verification: VerifiedRegistrationResponse
) => {
  const { passkeyRegistrationOptions } = user;
  const { registrationInfo } = verification;

  const {
    // @ts-ignore
    credential,
    // @ts-ignore
    credentialDeviceType: deviceType,
    // @ts-ignore
    credentialBackedUp: backedUp,
  } = registrationInfo;

  const newPasskey: Passkey = {
    // `user` here is from Step 2
    user,
    // Created by `generateRegistrationOptions()` in Step 1
    webAuthnUserID: passkeyRegistrationOptions.user.id,
    // A unique identifier for the credential
    id: credential.id,
    // The public key bytes, used for subsequent authentication signature verification
    publicKey: credential.publicKey,
    // The number of times the authenticator has been used on this site so far
    counter: credential.counter,
    // How the browser can talk with this credential's authenticator
    transports: credential.transports,
    // Whether the passkey is single-device or multi-device
    deviceType,
    // Whether the passkey has been backed up in some way
    backedUp,
  };

  await dbAddDoc(`passkeys/${firebaseUserId}/items`, newPasskey);
};

export { generateOptions, verify, saveNewPasskey };
