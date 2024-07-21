import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';
import {
  messagesListVariants,
  profileSettingsVariants,
  TWEEN_TRANSITION,
} from '../../motion';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import MessagesList from './MessagesList/MessagesList';
import DrawOutline from '../DrawOutline/DrawOutline/DrawOutline';

const Sidebar = () => {
  const [isProfileSettings, setIsProfileSettings] = useState(false);

  return (
    <DrawOutline orientation="vertical" position="right" strokeWidth={2}>
      <div className="sidebar">
        <AnimatePresence initial={false} mode="wait">
          {isProfileSettings ? (
            <motion.div
              className="sidebar__profile-settings"
              key="profile"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={profileSettingsVariants}
              transition={TWEEN_TRANSITION}
            >
              <ProfileSettings setIsProfileSettings={setIsProfileSettings} />
            </motion.div>
          ) : (
            <motion.div
              className="sidebar__messages-list"
              key="messages"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={messagesListVariants}
              transition={TWEEN_TRANSITION}
            >
              <MessagesList setIsProfileSettings={setIsProfileSettings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DrawOutline>
  );
};

export default Sidebar;
