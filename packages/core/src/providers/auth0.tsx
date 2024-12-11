import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Auth0Provider, useAuth0, User } from '@auth0/auth0-react';

interface AuthContextValue {
  isSignedIn: boolean;
  isLoading: boolean;
  user: User | null;
  isAdmin: boolean;
  signIn: () => void;
  signOut: () => void;
  getAccessToken: () => Promise<string>;
}

interface Auth0Config {
  domain: string;
  clientId: string;
  audience: string;
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
  const [isAdmin, setIsAdmin] = useState(false);

  const user: User | null = auth0User
    ? {
        id: auth0User.sub!,
        email: auth0User.email,
        name: auth0User.name,
        picture: auth0User.picture,
      }
    : null;

  useEffect(() => {
    const getCustomClaims = async () => {
      try {
        // Get the access token
        const token = await getAccessTokenSilently();

        // Decode the JWT token
        // Note: This is safe because JWTs are meant to be decoded client-side
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));

        // Access your custom claims
        // Replace 'https://your-api.com' with your actual audience URL
        const namespace = 'https://hasura.io/jwt/claims';

        const role = tokenPayload[namespace]['x-hasura-default-role'];

        return { role };
      } catch (error) {
        console.error('Error getting token claims:', error);
        return null;
      }
    };

    const fetchClaims = async () => {
      const claims = await getCustomClaims();
      if (claims) {
        console.log('User role:', claims.role);
        if (claims.role == 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    };

    fetchClaims();
  }, []);

  const contextValue: AuthContextValue = {
    isSignedIn,
    isLoading,
    user,
    isAdmin,
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
      domain={config.domain}
      clientId={config.clientId}
      authorizationParams={{
        audience: config.audience,
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
