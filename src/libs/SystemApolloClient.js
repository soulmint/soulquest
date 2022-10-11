import { useMemo } from 'react';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

let systemApolloClient;

const GRAPHQL_ENDPOINT_URL = process.env.GRAPHQL_ENDPOINT_SYSTEM_URL;
const GRAPHQL_API_TOKEN = process.env.GRAPHQL_ENDPOINT_SYSTEM_API_TOKEN;

const httpLink = createHttpLink({
  useGETForQueries: true,
  uri: GRAPHQL_ENDPOINT_URL
});

const authLink = setContext((_, { headers }) => {
  let token = GRAPHQL_API_TOKEN !== undefined ? GRAPHQL_API_TOKEN : false;
  if (token) {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  }
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = systemApolloClient ?? createApolloClient();

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
  if (!systemApolloClient) systemApolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
