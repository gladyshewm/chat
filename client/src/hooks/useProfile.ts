import { useContext } from 'react';
import { ProfileContext } from '../hoc/Profile/ProfileContext';

export const useProfile = () => {
  return useContext(ProfileContext);
};
