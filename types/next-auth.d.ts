import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends Record<string, unknown> {
    id: string | unknown;
    access_token: string | unknown;
    refresh_token: string | unknown;
    error: string;
    user: {
      id: string;
      access_token: string;
      refresh_token: string;
      /** The user's postal address. */
      address: string;
    } & DefaultSession['user'];
  }

  interface User extends Record<string, unknown>, DefaultUser {
    /** The user's postal address. */
    access_token: string | unknown;
    refresh_token: string | unknown;
  }
}
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends Record<string, unknown>, DefaultJWT {
    /** OpenID ID Token */
    idToken?: string;
    error: string;
    access_tooken: unknown;
    refresh_token: unknown;
  }
}
