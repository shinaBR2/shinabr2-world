import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
  Base64URLString,
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/types';
import crypto from 'crypto';
import { webcrypto } from 'crypto';
import {
  generateRegistrationOptions,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { dbAddDoc, dbRead, dbUpdateDoc } from '../singleton/db';

type UserModel = {
  id: string;
  username: string;
  passkeyOptions: PublicKeyCredentialCreationOptionsJSON;
};

/**
 * It is strongly advised that credentials get their own DB
 * table, ideally with a foreign key somewhere connecting it
 * to a specific UserModel.
 *
 * "SQL" tags below are suggestions for column data types and
 * how best to store data received during registration for use
 * in subsequent authentications.
 */
type Passkey = {
  // SQL: Store as `TEXT`. Index this column
  id: Base64URLString;
  // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
  //      Caution: Node ORM's may map this to a Buffer on retrieval,
  //      convert to Uint8Array as necessary
  publicKey: Uint8Array;
  // SQL: Foreign Key to an instance of your internal user model
  user: UserModel;
  // SQL: Store as `TEXT`. Index this column. A UNIQUE constraint on
  //      (webAuthnUserID + user) also achieves maximum user privacy
  webAuthnUserID: Base64URLString;
  // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
  counter: number;
  // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
  // Ex: 'singleDevice' | 'multiDevice'
  deviceType: CredentialDeviceType;
  // SQL: `BOOL` or whatever similar type is supported
  backedUp: boolean;
  // SQL: `VARCHAR(255)` and store string array as a CSV string
  // Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
  transports?: AuthenticatorTransportFuture[];
};

/**
 * Human-readable title for your website
 */
const rpName = 'SWorld';
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
const rpID = 'localhost';
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
const origin = `https://${rpID}`;

const getUserPasskeys = async (userId: string): Promise<Passkey[]> => {
  const existingPasskeysSnapshot = await dbRead(`passkeys/${userId}/items`);

  // @ts-ignore
  if (!existingPasskeysSnapshot.exists) {
    return [];
  }
  // @ts-ignore
  const existingPasskeys = existingPasskeysSnapshot.data();

  console.log('existingPasskeys', existingPasskeys);
  return existingPasskeys;
};

const getUser = async (userId: string) => {
  return await dbRead(`users/${userId}`);
};

const setCurrentRegistrationOptions = async (
  userId: string,
  options: PublicKeyCredentialCreationOptionsJSON
) => {
  await dbUpdateDoc(`users/${userId}`, {
    passkeyOptions: options,
  });
};

const generateOptions = async (userId: string) => {
  // @ts-ignore
  if (!global.crypto) global.crypto = webcrypto;
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
  const userPasskeys: Passkey[] = await getUserPasskeys(userId);
  console.log('userPasskeys', userPasskeys);

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
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

  console.log('userSnapshot', userSnapshot);

  // @ts-ignore
  console.log('userSnapshot data', userSnapshot.data());

  // @ts-ignore
  if (!userSnapshot.exists) {
    return {
      isVerified,
    };
  }

  // @ts-ignore
  const user = userSnapshot.data();
  const { passkeyOptions: currentOptions } = user;

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: currentOptions.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
  } catch (error) {
    console.error(error);
    return {
      isVerified,
    };
  }

  return {
    isVerified,
    verification,
    user,
  };
};

const saveNewPasskey = async (
  user: UserModel,
  verification: VerifiedRegistrationResponse
) => {
  const { passkeyOptions } = user;
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
    webAuthnUserID: passkeyOptions.user.id,
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

  await dbAddDoc(`passkeys/${user.id}`, newPasskey);
};

export { generateOptions, verify, saveNewPasskey };
