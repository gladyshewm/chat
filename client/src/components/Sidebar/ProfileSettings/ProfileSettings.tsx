import React, { FC, useState } from 'react';
import { ApolloError } from '@apollo/client';
import { User } from '../../../hoc/AuthProvider';
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';
import ProfileInfo from './ProfileInfo';
import { AnimatePresence, motion } from 'framer-motion';

interface ProfileSettingsProps {
  user: User | null;
  logout: () => Promise<void>;
  avatarUrl: string | null;
  setAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>;
  errorQueryAvatar: ApolloError | undefined;
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({
  user,
  logout,
  avatarUrl,
  setAvatarUrl,
  errorQueryAvatar,
  setIsProfileSettings,
}) => {
  const [isProfileInfo, setIsProfileInfo] = useState(true);
  const navigate = useNavigate();

  const handleBackClick = () => {
    setIsProfileSettings(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.log(error);
    }
  };

  const profileInfoVariants = {
    hidden: { scale: 0.95, opacity: 0.8 },
    visible: { scale: 1, opacity: 1 },
  };

  const editProfileVariants = {
    hidden: { x: '10%' },
    visible: { x: 0 },
  };

  const transition = {
    type: 'tween',
    duration: 0.08,
    ease: 'linear',
  };

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        {isProfileInfo ? (
          <motion.div
            key="profileInfo"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={profileInfoVariants}
            transition={transition}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
          >
            <ProfileInfo
              user={user}
              avatarUrl={avatarUrl}
              errorQueryAvatar={errorQueryAvatar}
              handleBackClick={handleBackClick}
              setIsProfileInfo={setIsProfileInfo}
              logout={handleLogout}
            />
          </motion.div>
        ) : (
          <motion.div
            key="editProfile"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={editProfileVariants}
            transition={transition}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
          >
            <EditProfile
              user={user}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              errorQueryAvatar={errorQueryAvatar}
              setIsProfileInfo={setIsProfileInfo}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileSettings;
