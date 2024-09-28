import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider';

export const useAuth = (): React.ContextType<typeof AuthContext> => {
  return useContext(AuthContext);
};
