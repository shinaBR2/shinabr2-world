import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Auth, Query } from 'core';
import { UniversalUI } from 'ui';
import React from 'react';

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

export const Route = createRootRoute({
  component: () => (
    <Auth.AuthProvider config={auth0Config}>
      <Query.QueryProvider config={queryConfig}>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </Query.QueryProvider>
    </Auth.AuthProvider>
  ),
});
