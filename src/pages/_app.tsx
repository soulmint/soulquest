import '../../styles/globals.css';
import React from 'react';
import { useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
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
import { getTokenState } from '../hooks/User/useUser';
import { useDispatch } from 'react-redux';
import { setId, setToken, logOut } from 'src/store/user/operations';

const MyApp = function MyApp({ Component, pageProps: pageProps }: AppProps) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  useEffect(() => {
    try {
      if (session?.error === 'RefreshAccessTokenError') {
        logOut(dispatch);
      }
      if (session && session.access_token) {
        const { needRefresh } = getTokenState(session.access_token);
        if (needRefresh) {
          logOut(dispatch);
        } else {
          //set user id for user's state
          setId(dispatch, session.user_id);
          //set user token for user's state
          setToken(dispatch, session.access_token);
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(e);
      }
    }

    // return () => {};
  }, [session]);

  return (
    <Providers>
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
