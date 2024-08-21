
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

import { FileUpload } from "graphql-upload-ts";

export class CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export class LoginUserInput {
    email: string;
    password: string;
}

export class ChangeCredentialsInput {
    name?: Nullable<string>;
    password?: Nullable<string>;
    email?: Nullable<string>;
}

export class User {
    uuid: string;
    name: string;
    email: string;
    password: string;
}

export class UserInfo {
    uuid: string;
    name: string;
    email: string;
}

export class AuthPayload {
    user: UserInfo;
    accessToken: string;
    refreshToken: string;
}

export class UserWithToken {
    user: UserInfo;
    token: string;
}

export abstract class IQuery {
    abstract user(): Nullable<UserWithToken> | Promise<Nullable<UserWithToken>>;

    abstract userChats(): ChatWithoutMessages[] | Promise<ChatWithoutMessages[]>;

    abstract chatWithUser(userUuid: string): Nullable<ChatWithoutMessages> | Promise<Nullable<ChatWithoutMessages>>;

    abstract chatById(chatId: string): Nullable<ChatWithoutMessages> | Promise<Nullable<ChatWithoutMessages>>;

    abstract chatMessages(chatId: string, limit?: Nullable<number>, offset?: Nullable<number>): Nullable<Message[]> | Promise<Nullable<Message[]>>;

    abstract findMessages(chatId: string, query: string): Nullable<Message[]> | Promise<Nullable<Message[]>>;

    abstract users(): UserWithAvatar[] | Promise<UserWithAvatar[]>;

    abstract findUsers(input: string): Nullable<UserWithAvatar>[] | Promise<Nullable<UserWithAvatar>[]>;

    abstract userAvatar(userUuid: string): Nullable<AvatarInfo> | Promise<Nullable<AvatarInfo>>;

    abstract userAllAvatars(userUuid: string): Nullable<AvatarInfo>[] | Promise<Nullable<AvatarInfo>[]>;
}

export abstract class IMutation {
    abstract refreshToken(refreshToken?: Nullable<string>): AuthPayload | Promise<AuthPayload>;

    abstract createUser(createInput: CreateUserInput): AuthPayload | Promise<AuthPayload>;

    abstract logInUser(loginInput: LoginUserInput): AuthPayload | Promise<AuthPayload>;

    abstract logOutUser(): boolean | Promise<boolean>;

    abstract createChat(participantsIds: string[], name?: Nullable<string>): ChatWithoutMessages | Promise<ChatWithoutMessages>;

    abstract deleteChat(chatId: string): boolean | Promise<boolean>;

    abstract uploadChatAvatar(image: Upload, chatId: string): string | Promise<string>;

    abstract deleteChatAvatar(chatId: string): Nullable<string> | Promise<Nullable<string>>;

    abstract sendMessage(chatId: string, content: string): Message | Promise<Message>;

    abstract sendTypingStatus(chatId: string, userName: string, isTyping: boolean): TypingFeedback | Promise<TypingFeedback>;

    abstract uploadAvatar(image: Upload): AvatarInfo | Promise<AvatarInfo>;

    abstract deleteAvatar(avatarUrl: string): Nullable<string> | Promise<Nullable<string>>;

    abstract changeCredentials(credentials: ChangeCredentialsInput): UserInfo | Promise<UserInfo>;
}

export class Chat {
    id: string;
    name?: Nullable<string>;
    participants: UserWithAvatar[];
    messages: Message[];
}

export class ChatWithoutMessages {
    id: string;
    name?: Nullable<string>;
    userUuid: string;
    isGroupChat: boolean;
    groupAvatarUrl?: Nullable<string>;
    participants: UserWithAvatar[];
    createdAt: Date;
}

export class UserWithAvatar {
    id: string;
    name: string;
    avatarUrl?: Nullable<string>;
}

export class Message {
    id: string;
    chatId: string;
    userId: string;
    userName: string;
    avatarUrl?: Nullable<string>;
    content: string;
    createdAt: Date;
    isRead: boolean;
}

export class TypingFeedback {
    chatId: string;
    userName: string;
    isTyping: boolean;
}

export abstract class ISubscription {
    abstract messageSent(chatId: string): Message | Promise<Message>;

    abstract userTyping(chatId: string): TypingFeedback | Promise<TypingFeedback>;
}

export class Info {
    id: string;
    name: string;
}

export class AvatarInfo {
    url: string;
    name: string;
    createdAt: Date;
}

export type Upload = FileUpload;
type Nullable<T> = T | null;
