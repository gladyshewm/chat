import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './ProfileSettings.css';
import EditProfile from './EditProfile/EditProfile';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import SidebarMotionScale from '../../SidebarMotionScale/SidebarMotionScale';
import SidebarMotionSlide from '../../SidebarMotionSlide/SidebarMotionSlide';

interface ProfileSettingsProps {
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileSettings = ({ setIsProfileSettings }: ProfileSettingsProps) => {
  const [isProfileInfo, setIsProfileInfo] = useState(true);

  const handleBackClick = () => {
    setIsProfileSettings(false);
  };

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        {isProfileInfo ? (
          <SidebarMotionScale
            className="profile-settings__container"
            key="profileInfo"
          >
            <ProfileInfo
              handleBackClick={handleBackClick}
              setIsProfileInfo={setIsProfileInfo}
            />
          </SidebarMotionScale>
        ) : (
          <SidebarMotionSlide
            className="profile-settings__container"
            key="editProfile"
          >
            <EditProfile setIsProfileInfo={setIsProfileInfo} />
          </SidebarMotionSlide>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileSettings;
