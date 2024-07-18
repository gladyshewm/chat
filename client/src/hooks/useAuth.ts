import React, { useContext } from 'react';
import { AuthContext } from '../hoc/Auth/AuthContext';

const useAuth = (): React.ContextType<typeof AuthContext> => {
  return useContext(AuthContext);
};

export default useAuth;
