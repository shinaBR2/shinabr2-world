import crypto from 'crypto';
import { verifyRegistrationResponse } from '@simplewebauthn/server';

import pw from 'a-promise-wrapper';
import { onRequest } from '../singleton';
import {
  dbAddDoc,
  dbGetRef,
  dbRead,
  dbUpdateDoc,
  deleteDoc,
} from '../singleton/db';
import { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';
import { generateOptions, saveNewPasskey, verify } from './passkeyHelpers';

const ORIGIN = 'http://localhost';
const DOMAIN = 'localhost';

// @ts-ignore
const generatePasskeyOptions = onRequest(async (req, res) => {
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
const verifyRegistration = onRequest(async (req, res) => {
  try {
    const { userId, credential: userCredential } = req.body;
    const { isVerified, verification, user } = await verify(
      userId,
      userCredential
    );

    if (!isVerified) {
      return res.status(400).json({ error: 'Verification failed' });
    }

    // @ts-ignore
    await saveNewPasskey(user, verification);

    return res.json({
      success: true,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Error in registration verification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export { generatePasskeyOptions, verifyRegistration };
