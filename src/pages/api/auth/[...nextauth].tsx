import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
// import GithubProvider from 'next-auth/providers/github';
// import FacebookProvider from 'next-auth/providers/facebook';
import TwitterProvider from 'next-auth/providers/twitter';

import {
  isExistsUser,
  authLogin,
  refreshAccessToken,
  createUser,
  getTokenState
} from '../../../hooks/User/useUser';
import { utils } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const providers = [
    GoogleProvider({
      clientId: `${process.env.GOOGLE_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
      checks: 'none'
    }),
    TwitterProvider({
      clientId: `${process.env.TWITTER_CONSUMER_KEY}`,
      clientSecret: `${process.env.TWITTER_CONSUMER_SECRET}`
    }),
    CredentialsProvider({
      name: 'SOULMINT',
      credentials: {},
      authorize: async (credentials: any) => {
        try {
          const nonce = '0x' + credentials?.csrfToken;
          let message = process.env.CONNECT_WALLET_WELCOME_MSG;
          message = `${message}\n\nAddress:\n${credentials?.address}\n\nNonce:\n${nonce}`;

          const address = utils.verifyMessage(
            message,
            credentials?.signedMessage
          );

          if (address.toLowerCase() != credentials?.address?.toLowerCase()) {
            return null;
          }

          const user = {
            email: address,
            name: address
          };
          // console.log('authorize user', user);
          return user;
        } catch (e) {
          return null;
        }
      }
    })
  ];

  const isDefaultSigninPage =
    req.method === 'GET' && req.query.nextauth.includes('signin');

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: 'jwt', // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 24 * 60 * 60 // 1day
    },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        const emailUser = user?.email || '';
        if (
          account?.provider === 'credentials' &&
          email &&
          profile &&
          credentials
        ) {
          // console.log('wallet connected');
        }
        const checkUser = await isExistsUser(emailUser);
        if (!checkUser?.id) {
          const CreateUser = await createUser({
            email: user.email,
            password: process.env.SM_USER_PASSWORD,
            role: {
              id: process.env.SM_USER_ROLE_ID,
              name: 'Soulmint Users',
              app_access: true,
              icon: 'supervised_user_circle',
              admin_access: false,
              enforce_tfa: false
            },
            provider: 'default',
            status: 'active'
          });
          checkUser.id = CreateUser.id;
        }
        //connect to directus create user & get access token
        const directusToken = await authLogin({
          email: user.email,
          password: process.env.SM_USER_PASSWORD
        });
        user.access_token = directusToken.auth_login.access_token;
        user.refresh_token = directusToken.auth_login.refresh_token;
        user.id = checkUser.id;

        return true;
      },
      async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
      async jwt({ token, user, account, profile }) {
        if (account?.provider === 'twitter') {
          if (profile) {
            token['twUserProfile'] = {
              followersCount: profile.followers_count,
              screenName: profile.screen_name,
              followingCount: profile.friends_count,
              userId: profile.id
            };
          }
          if (account) {
            token['credentials'] = {
              authToken: account.oauth_token,
              authSecret: account.oauth_token_secret
            };
          }
        }

        // Persist the OAuth access_token to the token right after signin
        if (account && user) {
          token.access_token = user.access_token;
          token.refresh_token = user.refresh_token;
          token.id = user.id;
          token.provider = account.provider;
        } else {
          if (token.access_token) {
            const { needRefresh } = getTokenState(token.access_token);
            // console.log('needRefresh', needRefresh);
            if (needRefresh) {
              const { access_token, refresh_token, error } =
                await refreshAccessToken(token.refresh_token);
              token.access_token = access_token;
              token.refresh_token = refresh_token;
              token.error = error ? error : null;
            }
          }
        }

        return token;
      },
      async session({ session, token }) {
        // Send properties to the client, like an access_token from a provider.
        session.id = token.id;
        session.access_token = token.access_token;
        session.provider = token.provider;
        session.twUserProfile = token.twUserProfile;
        session.credentials = token.credentials;
        session.error = token.error;
        return session;
      }
    }
  });
}
