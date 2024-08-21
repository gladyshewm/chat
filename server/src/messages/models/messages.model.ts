export type Profile = {
  name: string;
  avatar_url: string;
};

export type MessageData = {
  message_id: string;
  chat_id: string;
  user_uuid: string;
  content: string;
  created_at: Date;
  is_read: boolean;
  profiles: Profile;
};
