---
slug: auth0-with-hasura
title: Auth0 with Hasura
authors: [ShinaBR2]
tags: [Auth0, Authentication, Authorization]
---

# Building Flexible Authentication with Auth0 and Hasura in a Monorepo

When integrating Auth0 with Hasura in a monorepo structure, what seems straightforward at first can quickly become complex. In this article, I'll share my journey of implementing single sign-on (SSO) with Auth0 and Hasura GraphQL API, focusing on creating a flexible and maintainable authentication system.

## The Challenge

While Hasura's official documentation provides a solid starting point, I encountered several challenges that required deeper understanding and customization:

1. Our `users` table structure differed from the standard guide, requiring careful consideration of how to handle user identification.
2. The monorepo architecture added complexity but ultimately led to better modularity.
3. The integration between Auth0 and Hasura needed careful attention to detail, particularly regarding JWT tokens and custom claims.

## Rethinking User Authentication Design

### The Traditional Approach

Hasura's default guide suggests using permissions like this:

```sql
{"id": {"_eq": "X-Hasura-User-Id"}}
```

This approach directly maps the database's primary key to Auth0's user ID. While simple, it creates a tight coupling between our database and authentication provider.

### A More Flexible Solution

Instead, I advocate for a more flexible approach:

```sql
{"auth0_id": {"_eq": "X-Hasura-User-Id"}}
```

This design follows an important principle: our database structure should be independent of external services. Here's why this matters:

1. Our database maintains its own identity system via primary keys
2. Authentication provider details become attributes of our user records
3. Switching providers (e.g., from Auth0 to Okta) only requires adding a new identifier field
4. Our application's core data model remains stable regardless of authentication changes

## Implementing Provider-Agnostic Authentication in a Monorepo

### Architecture Overview

In a monorepo, we need to balance sharing code with maintaining flexibility. Here's how I structured the authentication system:

1. Core authentication logic lives in `packages/core`
2. Individual apps in `apps/*` remain provider-agnostic
3. Environment variables are handled at the app level (a Turborepo requirement)

### The Authentication Provider Implementation

Here's a clean implementation that abstracts away Auth0-specific details:

```typescript
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const AuthContextProvider = ({ children }) => {
  const auth0Data = useAuth0();

  // Transform Auth0-specific data into our standardized format
  const contextValue = {
    // Our standard auth context value
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
        audience: config.audience, // Critical for custom claims
        redirect_uri: window.location.origin,
      }}
    >
      <AuthContextProvider>{children}</AuthContextProvider>
    </Auth0Provider>
  );
};

export { AuthProvider, useAuthContext };
```

This design provides several benefits:

1. Apps only interact with a generic `AuthProvider` and `useAuthContext`
2. Auth0-specific dependencies stay contained in `packages/core`
3. Switching providers only requires changing the core implementation, not application code

## Critical Insights: The Auth0-Hasura Connection

The interaction between Auth0 and Hasura requires careful attention to detail. Here's a key insight I discovered: the `audience` field in Auth0Provider configuration is crucial for custom claims to work properly.

![Auth Architecture](https://hasura.io/docs/2.0/assets/images/auth-jwt-overview-diagram-1bc36ac6c078e8138c6932512e70f610.png)

Even if the Auth0 setup includes custom claims in the post-login event, without the correct `audience` configuration, these claims won't appear in the JWT token. This subtle requirement isn't immediately obvious from the documentation but is essential for proper authorization in Hasura.

## Lessons Learned

1. Design database schema to be authentication-provider-agnostic
2. Use abstraction layers in the monorepo to isolate authentication implementation details
3. Pay special attention to JWT token configuration, particularly the `audience` field

By following these principles, I made a flexible authentication system that's easier to maintain and adapt as the application grows or requirements change.
