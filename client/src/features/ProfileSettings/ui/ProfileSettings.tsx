import React, { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './ProfileSettings.css';
import EditProfile from './EditProfile/EditProfile';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import { editProfileVariants, profileInfoVariants } from './motion';
import { TWEEN_TRANSITION } from '@shared/constants/motion';

interface ProfileSettingsProps {
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({
  setIsProfileSettings,
}) => {
  const [isProfileInfo, setIsProfileInfo] = useState(true);

  const handleBackClick = () => {
    setIsProfileSettings(false);
  };

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        {isProfileInfo ? (
          <motion.div
            className="profile-settings__container"
            key="profileInfo"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={profileInfoVariants}
            transition={TWEEN_TRANSITION}
          >
            <ProfileInfo
              handleBackClick={handleBackClick}
              setIsProfileInfo={setIsProfileInfo}
            />
          </motion.div>
        ) : (
          <motion.div
            className="profile-settings__container"
            key="editProfile"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={editProfileVariants}
            transition={TWEEN_TRANSITION}
          >
            <EditProfile setIsProfileInfo={setIsProfileInfo} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileSettings;
