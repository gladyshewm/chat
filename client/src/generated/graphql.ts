/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  /** Date custom scalar type */
  Date: { input: any; output: any; }
  /** File upload scalar type */
  Upload: { input: any; output: any; }
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

export type Info = {
  __typename?: 'Info';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  chatId: Scalars['ID']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
  userName: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeCredentials: UserInfo;
  createChat: ChatWithoutMessages;
  createUser: AuthPayload;
  deleteAvatar?: Maybe<Scalars['String']['output']>;
  deleteChatAvatar?: Maybe<Scalars['String']['output']>;
  logInUser: AuthPayload;
  logOutUser: Scalars['Boolean']['output'];
  refreshToken: AuthPayload;
  sendMessage: Message;
  updateChatAvatar: Scalars['String']['output'];
  uploadAvatar: AvatarInfo;
  uploadChatAvatar: Scalars['String']['output'];
};


export type MutationChangeCredentialsArgs = {
  credentials: ChangeCredentialsInput;
};


export type MutationCreateChatArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  participantsIds: Array<Scalars['ID']['input']>;
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationDeleteAvatarArgs = {
  avatarUrl: Scalars['String']['input'];
  userUuid: Scalars['String']['input'];
};


export type MutationDeleteChatAvatarArgs = {
  chatId: Scalars['ID']['input'];
};


export type MutationLogInUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSendMessageArgs = {
  chatId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
};


export type MutationUpdateChatAvatarArgs = {
  chatId: Scalars['ID']['input'];
  image: Scalars['Upload']['input'];
};


export type MutationUploadAvatarArgs = {
  image: Scalars['Upload']['input'];
  userUuid: Scalars['String']['input'];
};


export type MutationUploadChatAvatarArgs = {
  chatId: Scalars['ID']['input'];
  image: Scalars['Upload']['input'];
};

export type Query = {
  __typename?: 'Query';
  chatMessages?: Maybe<Array<Message>>;
  findUsers?: Maybe<Array<UserWithAvatar>>;
  user?: Maybe<UserWithToken>;
  userAllAvatars: Array<Maybe<AvatarInfo>>;
  userAvatar?: Maybe<AvatarInfo>;
  userChats: Array<ChatWithoutMessages>;
  users: Array<UserWithAvatar>;
};


export type QueryChatMessagesArgs = {
  chatId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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
  messageSent: Message;
};


export type SubscriptionMessageSentArgs = {
  chatId: Scalars['ID']['input'];
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

export type UserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
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

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'UserInfo', uuid: string, name: string, email: string } } };

export type CreateUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'UserInfo', uuid: string, name: string, email: string } } };

export type LogInUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LogInUserMutation = { __typename?: 'Mutation', logInUser: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'UserInfo', uuid: string, email: string, name: string } } };

export type LogOutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutUserMutation = { __typename?: 'Mutation', logOutUser: boolean };

export type UploadAvatarMutationVariables = Exact<{
  image: Scalars['Upload']['input'];
  userUuid: Scalars['String']['input'];
}>;


export type UploadAvatarMutation = { __typename?: 'Mutation', uploadAvatar: { __typename?: 'AvatarInfo', url: string, name: string, createdAt: any } };

export type DeleteAvatarMutationVariables = Exact<{
  userUuid: Scalars['String']['input'];
  avatarUrl: Scalars['String']['input'];
}>;


export type DeleteAvatarMutation = { __typename?: 'Mutation', deleteAvatar?: string | null };

export type ChangeCredentialsMutationVariables = Exact<{
  credentials: ChangeCredentialsInput;
}>;


export type ChangeCredentialsMutation = { __typename?: 'Mutation', changeCredentials: { __typename?: 'UserInfo', uuid: string, name: string, email: string } };


export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const LogInUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logInUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logInUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LogInUserMutation, LogInUserMutationVariables>;
export const LogOutUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logOutUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logOutUser"}}]}}]} as unknown as DocumentNode<LogOutUserMutation, LogOutUserMutationVariables>;
export const UploadAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"uploadAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadAvatar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}},{"kind":"Argument","name":{"kind":"Name","value":"userUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<UploadAvatarMutation, UploadAvatarMutationVariables>;
export const DeleteAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAvatar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userUuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatarUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}}}]}]}}]} as unknown as DocumentNode<DeleteAvatarMutation, DeleteAvatarMutationVariables>;
export const ChangeCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"changeCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeCredentialsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<ChangeCredentialsMutation, ChangeCredentialsMutationVariables>;