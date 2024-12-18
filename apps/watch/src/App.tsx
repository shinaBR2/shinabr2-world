import React from 'react';
import { WatchUI, UniversalUI } from 'ui';

const { Homepage } = WatchUI;
const { UniversalMinimalismThemeProvider } = UniversalUI.Minimalism;

const App = () => {
  return (
    <UniversalMinimalismThemeProvider>
      <Homepage />
    </UniversalMinimalismThemeProvider>
  );
};

export default App;
