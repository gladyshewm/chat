
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class UserInput {
    name: string;
    email: string;
    password: string;
}

export class User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export class UserInfo {
    id: string;
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
}

export class Info {
    id: string;
    name: string;
}

export abstract class IQuery {
    abstract user(): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): Info[] | Promise<Info[]>;
}

type Nullable<T> = T | null;
