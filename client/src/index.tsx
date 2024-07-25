import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App/App';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
);
