import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

let httpLink: HttpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include',
});

let wsLink: GraphQLWsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:5000/graphql',
  }),
);

const authLink: ApolloLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

httpLink = authLink.concat(httpLink) as HttpLink;
wsLink = authLink.concat(wsLink) as GraphQLWsLink;

const splitLink: ApolloLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client: ApolloClient<any> = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
