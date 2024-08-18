import { useContext } from 'react';
import { ProfileContext } from '../ProfileProvider/ProfileContext';

export const useProfile = () => {
  return useContext(ProfileContext);
};
