import { createContext, useContext, ReactNode } from 'react';
import { ChatWithoutMessages } from '@shared/types';

interface ChatContextType {
  chat: ChatWithoutMessages | null;
  updateChat: (newChat: ChatWithoutMessages) => void;
  /* notification: string | null;
  setNotification: (message: string | null) => void; */
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  chat: ChatWithoutMessages;
  setChat: (chat: ChatWithoutMessages) => void;
}

export const ChatProvider = ({
  children,
  chat,
  setChat,
}: ChatProviderProps) => {
  // const [notification, setNotification] = useState<string | null>(null);

  const updateChat = (newChat: ChatWithoutMessages) => {
    setChat(newChat);
  };

  return (
    <ChatContext.Provider
      value={{ updateChat, chat /* notification, setNotification */ }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
