
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

export class Info {
    id: string;
    name: string;
}

export abstract class IQuery {
    abstract user(): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): Info[] | Promise<Info[]>;

    abstract userAvatar(userUuid: string): string | Promise<string>;
}

export type Upload = FileUpload;
type Nullable<T> = T | null;
