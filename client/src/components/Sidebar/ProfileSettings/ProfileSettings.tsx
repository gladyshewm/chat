import React, { FC, useState } from 'react';
import EditProfile from './EditProfile/EditProfile';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import { AnimatePresence, motion } from 'framer-motion';

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
              handleBackClick={handleBackClick}
              setIsProfileInfo={setIsProfileInfo}
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
            <EditProfile setIsProfileInfo={setIsProfileInfo} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileSettings;
