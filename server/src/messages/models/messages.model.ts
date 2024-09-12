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
  has_files: boolean;
  attached_files?: AttachedFile[];
};

export type AttachedFile = {
  file_id: string;
  file_url: string;
  file_name: string;
  file_path: string;
  buffer: Buffer;
  mimetype: string;
};

export type AttachedFileInput = Omit<AttachedFile, 'file_id'>;
