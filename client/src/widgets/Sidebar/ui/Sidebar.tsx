import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';
import { DrawOutline } from '@shared/ui';
import { MessagesList, ProfileSettings } from '@features';
import { messagesListVariants, profileSettingsVariants } from './motion';
import { TWEEN_TRANSITION } from '@shared/constants/motion';

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
