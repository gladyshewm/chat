import React from 'react';
import './App.css';
import AppRouter from './AppRouter';
import { AuthProvider } from '../hoc/Auth/AuthProvider';

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  );
};

export default App;
