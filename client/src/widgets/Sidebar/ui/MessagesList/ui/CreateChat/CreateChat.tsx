import { useState } from 'react';
import './CreateChat.css';
import { AnimatePresence } from 'framer-motion';
import { AddChatParticipants } from './AddChatParticipants/AddChatParticipants';
import { AddChatDescription } from './AddChatDescription/AddChatDescription';
import SidebarMotionSlide from '../../../SidebarMotionSlide/SidebarMotionSlide';
import SidebarMotionScale from '../../../SidebarMotionScale/SidebarMotionScale';
import { UserWithAvatar } from '@shared/types';

interface CreateChatProps {
  setIsCreateChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateChat = ({ setIsCreateChat }: CreateChatProps) => {
  const [isChatDescription, setIsChatDescription] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserWithAvatar[]>([]);

  return (
    <AnimatePresence mode="wait">
      {isChatDescription && selectedUsers.length ? (
        <SidebarMotionSlide key="chatDescription" style={{ height: '100%' }}>
          <AddChatDescription
            setIsCreateChat={setIsCreateChat}
            setIsChatDescription={setIsChatDescription}
            selectedUsers={selectedUsers}
          />
        </SidebarMotionSlide>
      ) : (
        <SidebarMotionScale key="chatParticipants" style={{ height: '100%' }}>
          <AddChatParticipants
            setIsCreateChat={setIsCreateChat}
            setIsChatDescription={setIsChatDescription}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </SidebarMotionScale>
      )}
    </AnimatePresence>
  );
};

export default CreateChat;
