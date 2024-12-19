import React from 'react';
import { Auth, Query } from 'core';
import { WatchUI, UniversalUI } from 'ui';

const { Homepage } = WatchUI;
const ThemeProvider = UniversalUI.Minimalism.UniversalMinimalismThemeProvider;

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_HASURA_GRAPHQL_URL,
  redirectUri: window.location.origin,
};
const queryConfig = {
  hasuraUrl: import.meta.env.VITE_HASURA_GRAPHQL_URL,
};

const App = () => {
  return (
    <Auth.AuthProvider config={auth0Config}>
      <Query.QueryProvider config={queryConfig}>
        <ThemeProvider>
          <Homepage />
        </ThemeProvider>
      </Query.QueryProvider>
    </Auth.AuthProvider>
  );
};

export default App;
