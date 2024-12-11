import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Auth } from 'core';
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });
// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_HASURA_GRAPHQL_URL,
  redirectUri: window.location.origin,
};

// test PR

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth.AuthProvider config={auth0Config}>
      <RouterProvider router={router} />
    </Auth.AuthProvider>
  </React.StrictMode>
);
