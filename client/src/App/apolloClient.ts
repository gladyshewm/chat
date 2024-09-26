import { ApolloClient, InMemoryCache, split, ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { onError } from '@apollo/client/link/error';

let uploadLink = createUploadLink({
  uri: process.env.REACT_APP_API_HTTP_URL || 'http://localhost:5000/graphql',
  credentials: 'include',
});

let wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_API_WS_URL || 'ws://localhost:5000/graphql',
    connectionParams: () => {
      const accessToken = localStorage.getItem('accessToken');
      return {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      };
    },
    retryAttempts: 5,
    on: {
      error: (error) => {
        console.error('WebSocket error', error);
      },
    },
  }),
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('accessToken');
  operation.setContext({
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : '',
      'apollo-require-preflight': 'true',
    },
  });
  return forward(operation);
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;

    if (headers) {
      const newAccessToken = headers.get('X-New-Access-Token');
      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
      }
    }

    return response;
  });
});

uploadLink = ApolloLink.from([errorLink, authLink, afterwareLink, uploadLink]);

const splitLink: ApolloLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink,
);

export const apolloClient: ApolloClient<any> = new ApolloClient({
  link: splitLink,
  // defaultOptions: {}, TODO:
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          userChats: {
            merge(existing = [], incoming) {
              const mergedChats = [...existing, ...incoming].filter(
                (chat, index, self) =>
                  index ===
                  self.findIndex((c) => c.__ref === chat.__ref),
              );
              return mergedChats;
            },
          },
        },
      },
      Subscription: {
        fields: {
          userChats: {
            merge(existing = [], incoming) {
              const mergedChats = [...existing, ...incoming].filter(
                (chat, index, self) =>
                  index ===
                  self.findIndex((c) => c.__ref === chat.__ref),
              );
              return mergedChats;
            },
          },
        },
      },
      ChatWithoutMessages: {
        keyFields: ['id'],
        fields: {
          participants: {
            merge(existing = [], incoming) {
              const mergedParticipants = [...existing, ...incoming].filter(
                (participant, index, self) =>
                  index ===
                  self.findIndex((p) => p.__ref === participant.__ref),
              );
              return mergedParticipants;
            },
          },
        },
      },
      UserWithAvatar: {
        keyFields: ['id'],
      },
    },
  }),
  credentials: 'include',
});
