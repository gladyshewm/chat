import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import MessagesList from './MessagesList/MessagesList';
import DrawOutline from '../DrawOutline/DrawOutline/DrawOutline';

const Sidebar = () => {
  const [isProfileSettings, setIsProfileSettings] = useState(false);

  const messagesListVariants = {
    hidden: { scale: 0.95, opacity: 0.8 },
    visible: { scale: 1, opacity: 1 },
  };

  const profileSettingsVariants = {
    hidden: { x: '10%' },
    visible: { x: 0 },
  };

  const transition = {
    type: 'tween',
    duration: 0.08,
    ease: 'linear',
  };

  return (
    <DrawOutline orientation="vertical" position="right" strokeWidth={2}>
      <div className="sidebar" style={{ overflow: 'hidden' }}>
        <AnimatePresence initial={false} mode="wait">
          {isProfileSettings ? (
            <motion.div
              key="profile"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={profileSettingsVariants}
              transition={transition}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
              }}
            >
              <ProfileSettings setIsProfileSettings={setIsProfileSettings} />
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={messagesListVariants}
              transition={transition}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
              }}
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
