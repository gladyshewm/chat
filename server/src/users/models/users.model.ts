export type UserWithAvatarData = {
  uuid: string;
  name: string;
  avatar_url: string;
};

export type UserData = {
  uuid: string;
  name: string;
  avatar_url?: string;
};

export type AvatarInfoData = {
  url: string;
  name: string;
  created_at: Date;
};
