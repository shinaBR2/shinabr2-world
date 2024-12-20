import { Auth, watchQueryHooks } from 'core';
import React, { useState } from 'react';
import { WatchUI } from 'ui';
const { Homepage } = WatchUI;

const Home = () => {
  const authContext = Auth.useAuthContext();
  const { getAccessToken } = authContext;
  const videoResult = watchQueryHooks.useLoadVideos({
    getAccessToken,
  });
  const [settingOpen, toggleSetting] = useState<boolean>(false);

  console.log('home data', videoResult);
  const homeProps = {
    settingOpen,
    toggleSetting,
    videoResult,
  };

  return <Homepage {...homeProps} />;
};

export { Home };
