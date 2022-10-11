import { useMemo } from 'react';
import BrowserPersistence from '../utils/simplePersistence';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

let apolloClient;
const GRAPHQL_ENDPOINT_URL = process.env.GRAPHQL_ENDPOINT_URL;

const httpLink = createHttpLink({
  useGETForQueries: true,
  uri: GRAPHQL_ENDPOINT_URL
});

const authLink = setContext((_, { headers }) => {
  const localStorage = new BrowserPersistence();
  const user = localStorage.getItem('user');
  const token = user && user.access_token ? user.access_token : null;
  if (token) {
    headers = {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    };
  }

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers
    }
  };
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
