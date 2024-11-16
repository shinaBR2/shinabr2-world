import * as React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { startRegistration } from '@simplewebauthn/browser';
// @ts-ignore
import { createLazyFileRoute } from '@tanstack/react-router';
import { GameUI } from 'ui';
import { useState } from 'react';

const { Dialogs, Containers } = GameUI.Minimalism;
const { HomeContainer } = Containers;

const arrayBufferToBase64 = buffer => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

const base64ToArrayBuffer = (base64: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const isWebAuthnSupported = () => {
  return window?.PublicKeyCredential !== undefined;
};

const Home = () => {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const gameList = [
    {
      id: '1',
      url: '/bobble-dungeon',
      name: 'Bobble dungeon',
      slug: 'bobble-dungeon',
      description: 'Ride the Dungeons with just a bubble shooter.',
      imageUrl: '/assets/bobble-dungeon/bobble_dungeon_intro.png',
    },
    {
      id: '2',
      url: '/evil-minds',
      name: 'Evil Minds',
      slug: 'evil-minds',
      description: 'Who is the next victim?',
      imageUrl: '/assets/evil-minds/intro.png',
    },
  ];

  const { mutateAsync: registerMutate, data: registerOptions } = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const url =
        'http://127.0.0.1:5001/my-world-dev/asia-south1/auth-generatePasskeyOptions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      });
      console.log('request called');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
  const { mutateAsync: verifyMutate, data: verifiedData } = useMutation({
    mutationFn: async ({
      userId,
      credential,
    }: {
      userId: string;
      credential: any;
    }) => {
      const url =
        'http://127.0.0.1:5001/my-world-dev/asia-south1/auth-verifyRegistration';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          credential,
        }),
      });
      console.log('request verify called');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  console.log('registration data', registerOptions);

  const registerPasskey = async () => {
    try {
      setStatus('Starting registration...');
      setError('');
      const resp = await registerMutate({ userId: 'master' });
      console.log('resp', resp);

      let attResp;
      try {
        // Pass the options to the authenticator and wait for a response
        attResp = await startRegistration({ optionsJSON: resp });
      } catch (error) {
        console.log('error', error);
        // Some basic error handling
        if (error.name === 'InvalidStateError') {
          elemError.innerText =
            'Error: Authenticator was probably already registered by user';
        } else {
          elemError.innerText = error;
        }

        throw error;
      }
      console.log('attResp', attResp);

      const verifyResp = await verifyMutate({
        userId: 'master',
        credential: attResp,
      });

      console.log('verifyResp', verifyResp);

      // localStorage.setItem('savedCredentials', JSON.stringify(registerOptions));

      // 5. Send to server (in real implementation)
      // await fetch('/api/register-passkey', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     credentialId,
      //     clientDataJSON,
      //     attestationObject,
      //   }),
      // });

      setStatus('Registration successful!');
    } catch (err) {
      setError(`Registration failed: ${err.message}`);
    }
  };

  const authenticatePasskey = async () => {
    try {
      setStatus('Starting authentication...');
      setError('');

      // 1. Get challenge from server (in real implementation)
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // 2. Create credential request options
      const publicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        userVerification: 'required',
        timeout: 60000,
      };

      // 3. Get credentials
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      // 4. Format assertion for sending to server
      const credentialId = arrayBufferToBase64(assertion.rawId);
      const clientDataJSON = arrayBufferToBase64(
        assertion.response.clientDataJSON
      );
      const authenticatorData = arrayBufferToBase64(
        assertion.response.authenticatorData
      );
      const signature = arrayBufferToBase64(assertion.response.signature);

      // 5. Send to server (in real implementation)
      // await fetch('/api/authenticate-passkey', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     credentialId,
      //     clientDataJSON,
      //     authenticatorData,
      //     signature,
      //   }),
      // });

      setStatus('Authentication successful!');
    } catch (err) {
      setError(`Authentication failed: ${err.message}`);
    }
  };

  return (
    <>
      <HomeContainer gameList={gameList} />
      <div>
        <div className="space-y-2">
          <button
            onClick={registerPasskey}
            disabled={!isWebAuthnSupported()}
            className="w-full"
          >
            Register Passkey
          </button>

          <button
            onClick={authenticatePasskey}
            disabled={!isWebAuthnSupported()}
            className="w-full"
          >
            Authenticate with Passkey
          </button>
        </div>
      </div>
      <div>
        <div>Status: {status}</div>
      </div>
    </>
  );
};

export const Route = createLazyFileRoute('/')({
  component: Home,
});
