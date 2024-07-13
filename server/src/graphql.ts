
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

import { FileUpload } from "graphql-upload-ts";

export class UserInput {
    name: string;
    email: string;
    password: string;
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
    token: string;
}

export abstract class IMutation {
    abstract createUser(input: UserInput): AuthPayload | Promise<AuthPayload>;

    abstract logInUser(email: string, password: string): AuthPayload | Promise<AuthPayload>;

    abstract logOutUser(): boolean | Promise<boolean>;

    abstract uploadAvatar(image: Upload, userUuid: string): string | Promise<string>;
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
    participants: UserWithAvatar[];
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

export abstract class IQuery {
    abstract userChats(): ChatWithoutMessages[] | Promise<ChatWithoutMessages[]>;

    abstract chatMessages(chatId: string, limit?: Nullable<number>, offset?: Nullable<number>): Nullable<Message[]> | Promise<Nullable<Message[]>>;

    abstract user(): Nullable<UserWithToken> | Promise<Nullable<UserWithToken>>;

    abstract users(): Info[] | Promise<Info[]>;

    abstract userAvatar(userUuid: string): Nullable<string> | Promise<Nullable<string>>;

    abstract userAllAvatars(userUuid: string): Nullable<string>[] | Promise<Nullable<string>[]>;
}

export class Info {
    id: string;
    name: string;
}

export class UserWithToken {
    user: UserInfo;
    token: string;
}

export type Upload = FileUpload;
type Nullable<T> = T | null;
