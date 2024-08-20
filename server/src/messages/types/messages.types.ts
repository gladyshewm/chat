export type MessageData = {
  message_id: string;
  chat_id: string;
  user_uuid: string;
  content: string;
  created_at: string;
  is_read: boolean;
  profiles: {
    name: string;
    avatar_url: string;
  };
};
