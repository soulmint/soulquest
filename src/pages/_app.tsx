import '../../styles/globals.css';
import React from 'react';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { appWithTranslation } from 'next-i18next';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/apolloClient';
import { Provider } from 'react-redux';
import { useStore } from 'src/store/redux';
import dynamic from 'next/dynamic';
const FullPageLoader = dynamic(
  () => import('../components/organisms/FullPageLoader')
);
const Toast = dynamic(() => import('../components/organisms/Toast'));
const Providers = dynamic(() => import('../utils/providers'));
import BrowserPersistence from '../utils/simplePersistence';
import { getTokenState } from '../hooks/User/useUser';

const MyApp = function MyApp({
  Component,
  pageProps: { session: Session, ...pageProps }
}: AppProps) {
  const store = useStore();
  const localStorage = new BrowserPersistence();
  const { data: session } = useSession();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(async () => {
    if (session?.error === 'RefreshAccessTokenError') {
      localStorage.removeItem('user');
      return await signOut();
    }

    if (session && session.access_token) {
      const { needRefresh } = getTokenState(session.access_token);
      if (needRefresh) {
        //clean user data from local storage
        localStorage.removeItem('user');
        //trigger to re-login to refresh access_token
        return await signOut();
      } else {
        setAccessToken(session.access_token);
      }
    }

    // return () => {};
  }, [session, store]);

  useEffect(() => {
    if (session) {
      //saving for other contexts
      const userData = {
        ...session.user,
        id: session.id,
        access_token: accessToken
      };
      //save user data to local storage to use on other contexts
      localStorage.setItem('user', userData);
      // console.log('USER:', localStorage.getItem('user'));
    }
    // return () => {};
  }, [accessToken, session]);

  return (
    <Providers>
      <Head>
        <title>SoulMint - The 1st SoulBound</title>
      </Head>
      <Component {...pageProps} />
    </Providers>
  );
};

const SoulMintApp = ({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) => {
  const apolloClient = useApollo(
    pageProps.initialApolloState ? pageProps.initialApolloState : null
  );
  const store = useStore();

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider attribute="class">
        <Provider store={store}>
          <FullPageLoader />
          <SessionProvider session={session}>
            <MyApp Component={Component} pageProps={pageProps} router={null} />
            <Toast />
          </SessionProvider>
        </Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default appWithTranslation(SoulMintApp);
