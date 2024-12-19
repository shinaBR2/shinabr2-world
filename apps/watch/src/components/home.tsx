import { Auth, watchQueryHooks } from 'core';
import React from 'react';
import { WatchUI } from 'ui';
const { Homepage } = WatchUI;

const Home = () => {
  const authContext = Auth.useAuthContext();
  const { getAccessToken } = authContext;
  const data = watchQueryHooks.useLoadVideos({
    getAccessToken,
  });

  console.log('home data', data);

  return <Homepage />;
};

export { Home };
