export type AuthData = null;

// getAuthData throws an error until an auth handler is added
export function getAuthData(): AuthData | null {
    throw new Error("authData cannot be called when there are no auth handlers.")
}
