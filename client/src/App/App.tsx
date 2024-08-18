import React from 'react';
import './App.css';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './providers/AuthProvider/AuthProvider';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <div className="App">
          <AppRouter />
        </div>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
