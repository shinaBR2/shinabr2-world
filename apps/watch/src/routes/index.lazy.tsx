import React, { useEffect } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { WatchUI, UniversalUI } from 'ui';
import { Auth, watchQueryHooks } from 'core';

const { Homepage } = WatchUI;
const { Dialogs } = UniversalUI;
const { LoginDialog } = Dialogs;

const Index = () => {
  const authContext = Auth.useAuthContext();
  const { isSignedIn, isLoading, signIn, getAccessToken } = authContext;
  // const data = watchQueryHooks.useLoadVideos({
  //   getAccessToken,
  // });

  useEffect(() => {
    console.log('Auth state changed:', {
      isSignedIn,
      isLoading,
    });
  }, [isSignedIn, isLoading]);

  // console.log(`watch data`, data);
  console.log(`isLoading`, isLoading);
  console.log(`isSignedIn`, isSignedIn);

  if (!isSignedIn && !isLoading) {
    return <LoginDialog onAction={signIn} />;
  }

  return <Homepage />;
};

export const Route = createLazyFileRoute('/')({
  component: Index,
});
