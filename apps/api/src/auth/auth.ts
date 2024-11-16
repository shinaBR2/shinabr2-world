import crypto from 'crypto';
import { verifyRegistrationResponse } from '@simplewebauthn/server';

import pw from 'a-promise-wrapper';
import { onRequestWithCors } from '../singleton';
import {
  dbAddDoc,
  dbGetRef,
  dbRead,
  dbUpdateDoc,
  deleteDoc,
} from '../singleton/db';
import { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';
import { generateOptions, saveNewPasskey, verify } from './passkeyHelpers';

const ORIGIN = 'http://localhost:3003';
const DOMAIN = 'localhost';

// @ts-ignore
const generatePasskeyOptions = onRequestWithCors(async (req, res) => {
  try {
    const { userId } = req.body;
    const options = await generateOptions(userId);

    if (!options) {
      console.error('Failed to generate options:');
      return res.status(500).json({ error: 'Failed to generate options' });
    }

    return res.json(options);
  } catch (error) {
    console.error('Error generating registration options:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// @ts-ignore
const verifyRegistration = onRequestWithCors(async (req, res) => {
  try {
    // @ts-ignore
    const { userId: firebaseUserId, credential: userCredential } = req.body;
    const { isVerified, verification, user } = await verify(
      firebaseUserId,
      userCredential
    );

    if (!isVerified) {
      // @ts-ignore
      return res.status(400).json({ error: 'Verification failed' });
    }

    // @ts-ignore
    await saveNewPasskey(firebaseUserId, user, verification);

    // @ts-ignore
    return res.json({
      success: true,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Error in registration verification:', error);
    // @ts-ignore
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export { generatePasskeyOptions, verifyRegistration };
