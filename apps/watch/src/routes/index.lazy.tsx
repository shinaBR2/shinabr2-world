import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { WatchUI, UniversalUI } from 'ui';
import { Auth } from 'core';
import { Home } from '../components/home';

const { Homepage } = WatchUI;
const { Dialogs } = UniversalUI;
const { LoginDialog } = Dialogs;

const Index = () => {
  const authContext = Auth.useAuthContext();
  const { isSignedIn, isLoading, signIn } = authContext;

  console.log(`isLoading`, isLoading);
  console.log(`isSignedIn`, isSignedIn);

  if (!isSignedIn) {
    return <LoginDialog onAction={signIn} />;
  }

  return <Home />;
};

export const Route = createLazyFileRoute('/')({
  component: Index,
});
