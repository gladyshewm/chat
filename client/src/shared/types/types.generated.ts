export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AttachedFile = {
  __typename?: 'AttachedFile';
  fileId: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: UserInfo;
};

export type AvatarInfo = {
  __typename?: 'AvatarInfo';
  createdAt: Scalars['Date']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ChangeCredentialsInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type Chat = {
  __typename?: 'Chat';
  id: Scalars['ID']['output'];
  messages: Array<Message>;
  name?: Maybe<Scalars['String']['output']>;
  participants: Array<UserWithAvatar>;
};

export type ChatWithoutMessages = {
  __typename?: 'ChatWithoutMessages';
  createdAt: Scalars['Date']['output'];
  groupAvatarUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isGroupChat: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  participants: Array<UserWithAvatar>;
  userUuid: Scalars['ID']['output'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Info = {
  __typename?: 'Info';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type LoginUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Message = {
  __typename?: 'Message';
  attachedFiles: Array<Maybe<AttachedFile>>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  chatId: Scalars['ID']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  hasFiles: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
  userName: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Добавление пользователя в чат.
   * Только создатель чата может добавлять новых участников.
   */
  addUserToChat: ChatWithoutMessages;
  changeCredentials: UserInfo;
  /**
   * Создание чата.
   * Возвращаемый список участников содержит ID текущего пользователя (создателя).
   */
  createChat: ChatWithoutMessages;
  createUser: AuthPayload;
  deleteAvatar?: Maybe<Scalars['String']['output']>;
  /**
   * Групповой чат удаляет создатель для всех.
   *
   * Одиночный чат помечается флагом is_deleted в таблице party
   * у пользователя, который удалил чат.
   */
  deleteChat: Scalars['Boolean']['output'];
  /**
   * Удаление аватара чата.
   * Возвращаемая строка содержит URL нового аватара.
   */
  deleteChatAvatar?: Maybe<Scalars['String']['output']>;
  deleteUser: Scalars['Boolean']['output'];
  logInUser: AuthPayload;
  logOutUser: Scalars['Boolean']['output'];
  refreshToken: AuthPayload;
  /**
   * Удаление пользователя из чата.
   * Только создатель чата может удалять участников.
   */
  removeUserFromChat: ChatWithoutMessages;
  sendMessage: Message;
  sendTypingStatus: TypingFeedback;
  uploadAvatar: AvatarInfo;
  uploadChatAvatar: Scalars['String']['output'];
};


export type MutationAddUserToChatArgs = {
  chatId: Scalars['ID']['input'];
  userUuid: Scalars['ID']['input'];
};


export type MutationChangeCredentialsArgs = {
  credentials: ChangeCredentialsInput;
};


export type MutationCreateChatArgs = {
  avatar?: InputMaybe<Scalars['Upload']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  participantsIds: Array<Scalars['ID']['input']>;
};


export type MutationCreateUserArgs = {
  createInput: CreateUserInput;
};


export type MutationDeleteAvatarArgs = {
  avatarUrl: Scalars['String']['input'];
};


export type MutationDeleteChatArgs = {
  chatId: Scalars['ID']['input'];
};


export type MutationDeleteChatAvatarArgs = {
  avatarUrl: Scalars['String']['input'];
  chatId: Scalars['ID']['input'];
};


export type MutationLogInUserArgs = {
  loginInput: LoginUserInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRemoveUserFromChatArgs = {
  chatId: Scalars['ID']['input'];
  userUuid: Scalars['ID']['input'];
};


export type MutationSendMessageArgs = {
  attachedFiles?: InputMaybe<Array<Scalars['Upload']['input']>>;
  chatId: Scalars['ID']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSendTypingStatusArgs = {
  chatId: Scalars['ID']['input'];
  isTyping: Scalars['Boolean']['input'];
  userName: Scalars['String']['input'];
};


export type MutationUploadAvatarArgs = {
  image: Scalars['Upload']['input'];
};


export type MutationUploadChatAvatarArgs = {
  chatId: Scalars['ID']['input'];
  image: Scalars['Upload']['input'];
};

export type Query = {
  __typename?: 'Query';
  chatAllAvatars: Array<Maybe<AvatarInfo>>;
  /** Запрос чата по ID (участники чата включают текущего пользователя) */
  chatById?: Maybe<ChatWithoutMessages>;
  /** Список сообщений для определённого чата */
  chatMessages?: Maybe<Array<Message>>;
  /** Запрос одиночного чата с указанным пользователем */
  chatWithUser?: Maybe<ChatWithoutMessages>;
  /** Поиск сообщения в чате по строке query */
  findMessages?: Maybe<Array<Message>>;
  /** Поиск пользователей (не включая текущего пользователя) */
  findUsers: Array<Maybe<UserWithAvatar>>;
  user?: Maybe<UserWithToken>;
  userAllAvatars: Array<Maybe<AvatarInfo>>;
  userAvatar?: Maybe<AvatarInfo>;
  /** Список чатов пользователя (без сообщений) */
  userChats: Array<ChatWithoutMessages>;
  /** Список всех пользователей */
  users: Array<UserWithAvatar>;
};


export type QueryChatAllAvatarsArgs = {
  chatId: Scalars['ID']['input'];
};


export type QueryChatByIdArgs = {
  chatId: Scalars['ID']['input'];
};


export type QueryChatMessagesArgs = {
  chatId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryChatWithUserArgs = {
  userUuid: Scalars['String']['input'];
};


export type QueryFindMessagesArgs = {
  chatId: Scalars['ID']['input'];
  query: Scalars['String']['input'];
};


export type QueryFindUsersArgs = {
  input: Scalars['String']['input'];
};


export type QueryUserAllAvatarsArgs = {
  userUuid: Scalars['ID']['input'];
};


export type QueryUserAvatarArgs = {
  userUuid: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  chatById?: Maybe<ChatWithoutMessages>;
  messageSent: Message;
  newChatCreated?: Maybe<ChatWithoutMessages>;
  userTyping: TypingFeedback;
};


export type SubscriptionChatByIdArgs = {
  chatId: Scalars['ID']['input'];
};


export type SubscriptionMessageSentArgs = {
  chatId: Scalars['ID']['input'];
};


export type SubscriptionUserTypingArgs = {
  chatId: Scalars['ID']['input'];
};

export type TypingFeedback = {
  __typename?: 'TypingFeedback';
  chatId: Scalars['ID']['output'];
  isTyping: Scalars['Boolean']['output'];
  userName: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  uuid: Scalars['ID']['output'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  uuid: Scalars['ID']['output'];
};

export type UserWithAvatar = {
  __typename?: 'UserWithAvatar';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UserWithToken = {
  __typename?: 'UserWithToken';
  token: Scalars['String']['output'];
  user: UserInfo;
};
