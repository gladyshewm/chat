import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './Sidebar.css';
import { DrawOutline } from '@shared/ui';
import { ProfileSettings } from './ProfileSettings';
import { MessagesList } from './MessagesList';
import SidebarMotionSlide from './SidebarMotionSlide/SidebarMotionSlide';
import SidebarMotionScale from './SidebarMotionScale/SidebarMotionScale';

const Sidebar = () => {
  const [isProfileSettings, setIsProfileSettings] = useState(false);

  return (
    <DrawOutline orientation="vertical" position="right" strokeWidth={2}>
      <div className="sidebar">
        <AnimatePresence initial={false} mode="wait">
          {isProfileSettings ? (
            <SidebarMotionSlide
              className="sidebar__profile-settings"
              key="profile"
            >
              <ProfileSettings setIsProfileSettings={setIsProfileSettings} />
            </SidebarMotionSlide>
          ) : (
            <SidebarMotionScale
              className="sidebar__messages-list"
              key="messages"
            >
              <MessagesList setIsProfileSettings={setIsProfileSettings} />
            </SidebarMotionScale>
          )}
        </AnimatePresence>
      </div>
    </DrawOutline>
  );
};

export default Sidebar;
