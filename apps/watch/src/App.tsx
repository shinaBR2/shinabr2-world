import React from 'react';
import { WatchUI, UniversalUI } from 'ui';

const { Homepage } = WatchUI;
const ThemeProvider = UniversalUI.Minimalism.UniversalMinimalismThemeProvider;

const App = () => {
  return (
    <ThemeProvider>
      <Homepage />
    </ThemeProvider>
  );
};

export default App;
