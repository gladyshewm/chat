import './App.css';
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './hoc/AuthProvider';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
