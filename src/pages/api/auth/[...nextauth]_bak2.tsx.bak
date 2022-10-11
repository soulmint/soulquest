import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import { saveSocialData } from '../../../hooks/User/useSocial';
import {
  isExistsUser,
  authLogin,
  refreshAccessToken,
  createUser,
  getTokenState
} from '../../../hooks/User/useUser';
import { utils } from 'ethers';

export const authOptions: NextAuthOptions = {
  providers: [
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
      name: 'BSC',
      credentials: {},
      authorize: async (credentials: any) => {
        try {
          const nonce = '0x' + credentials?.csrfToken;
          const address = utils.verifyMessage(
            nonce,
            credentials?.signedMessage
          );
          if (address.toLowerCase() != credentials?.address?.toLowerCase())
            return null;
          const user = {
            email: address,
            name: address
          };
          console.log('authorize user', user);

          return user;
        } catch (e) {
          return null;
        }
      }
    })
  ],
  pages: {
    error: '/_error'
  },
  session: {
    strategy: 'jwt', // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 1200 // 10 minutes
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
        console.log('wallet connected');
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
          token['userProfile'] = {
            followersCount: profile.followers_count,
            twitterHandle: profile.screen_name,
            followingCount: profile.friends_count,
            userID: profile.id
          };
        }
        if (account) {
          token['credentials'] = {
            authToken: account.oauth_token,
            authSecret: account.oauth_token_secret
          };
        }
        const userName = profile?.screen_name;
        await saveSocialData({
          name: token.name,
          username: userName,
          user_created: token.sud
        });
      }

      // Persist the OAuth access_token to the token right after signin
      if (account && user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
      } else {
        const { needRefresh } = getTokenState(token.access_token);
        console.log('needRefresh', needRefresh);
        if (needRefresh) {
          const { access_token, refresh_token } = await refreshAccessToken(
            token.refresh_token
          );
          token.access_token = access_token;
          token.refresh_token = refresh_token;
        }
      }

      console.log('====================================');
      console.log('2. token', token);
      console.log('====================================');
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.id = token.sud;
      session.access_token = token.access_token;

      return session;
    }
  }
};

export default async function auth(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return await NextAuth(req, res, authOptions);
}
