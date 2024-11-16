import { onRequestWithCors } from '../singleton';
// import { generateOptions, verify } from './registrationPasskeyHelpers';
import * as registrationHelpers from './registrationPasskeyHelpers';
import * as authenticationHelpers from './authenticationPasskeyHelpers';
import { saveNewPasskey } from './userHelpers';

// @ts-ignore
const generatePasskeyRegistrationOptions = onRequestWithCors(
  async (req, res) => {
    try {
      // @ts-ignore
      const { userId } = req.body;
      const options = await registrationHelpers.generateOptions(userId);

      if (!options) {
        console.error('Failed to generate options:');
        // @ts-ignore
        return res.status(500).json({ error: 'Failed to generate options' });
      }

      // @ts-ignore
      return res.json(options);
    } catch (error) {
      console.error('Error generating registration options:', error);
      // @ts-ignore
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// @ts-ignore
const verifyPasskeyRegistration = onRequestWithCors(async (req, res) => {
  try {
    // @ts-ignore
    const { userId: firebaseUserId, credential: userCredential } = req.body;
    const { isVerified, verification, user } = await registrationHelpers.verify(
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

const generatePasskeyAuthenticationOptions = onRequestWithCors(
  async (req, res) => {
    try {
      // @ts-ignore
      const { userId } = req.body;
      const options = await authenticationHelpers.generateOptions(userId);

      if (!options) {
        console.error('Failed to generate options:');
        // @ts-ignore
        return res.status(500).json({ error: 'Failed to generate options' });
      }

      // @ts-ignore
      return res.json(options);
    } catch (error) {
      console.error('Error generating authentication options:', error);
      // @ts-ignore
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

const verifyPasskeyAuthentication = onRequestWithCors(async (req, res) => {
  try {
    // @ts-ignore
    const { userId: firebaseUserId, credential: userCredential } = req.body;
    const { isVerified } = await authenticationHelpers.verify(
      firebaseUserId,
      userCredential
    );

    if (!isVerified) {
      // @ts-ignore
      return res.status(400).json({ error: 'Verification failed' });
    }

    // @ts-ignore
    return res.json({
      success: true,
      message: 'Authentication successful',
    });
  } catch (error) {
    console.error('Error in authentication verification:', error);
    // @ts-ignore
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export {
  generatePasskeyRegistrationOptions,
  verifyPasskeyRegistration,
  generatePasskeyAuthenticationOptions,
  verifyPasskeyAuthentication,
};
