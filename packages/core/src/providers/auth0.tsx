import React, { createContext, FC, useContext } from 'react';
import { Auth0Provider, useAuth0, User } from '@auth0/auth0-react';

interface AuthContextValue {
  isSignedIn: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  getAccessToken: () => Promise<string>;
}

interface Auth0Config {
  domain: string;
  clientId: string;
}

interface Props {
  config: Auth0Config;
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    isAuthenticated: isSignedIn,
    isLoading,
    loginWithRedirect,
    logout,
    user: auth0User,
    getAccessTokenSilently,
  } = useAuth0();

  const user: User | null = auth0User
    ? {
        id: auth0User.sub!,
        email: auth0User.email,
        name: auth0User.name,
        picture: auth0User.picture,
      }
    : null;

  const contextValue: AuthContextValue = {
    isSignedIn,
    isLoading,
    user,
    signIn: loginWithRedirect,
    signOut: () =>
      logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      }),
    getAccessToken: getAccessTokenSilently,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const AuthProvider: FC<Props> = ({ config, children }) => {
  return (
    <Auth0Provider
      domain="shinabr2.auth0.com"
      clientId="bre1WKbhAHHtaaxOm1OsK62QLN2Zr968"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <AuthContextProvider>{children}</AuthContextProvider>
    </Auth0Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuthContext };
