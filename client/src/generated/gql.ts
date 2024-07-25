/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation refreshToken {\n  refreshToken {\n    user {\n      uuid\n      name\n      email\n    }\n    accessToken\n    refreshToken\n  }\n}\n\nmutation createUser($input: UserInput!) {\n  createUser(input: $input) {\n    user {\n      uuid\n      name\n      email\n    }\n    accessToken\n    refreshToken\n  }\n}\n\nmutation logInUser($email: String!, $password: String!) {\n  logInUser(email: $email, password: $password) {\n    user {\n      uuid\n      email\n      name\n    }\n    accessToken\n    refreshToken\n  }\n}\n\nmutation logOutUser {\n  logOutUser\n}\n\nmutation uploadAvatar($image: Upload!, $userUuid: String!) {\n  uploadAvatar(image: $image, userUuid: $userUuid) {\n    url\n    name\n    createdAt\n  }\n}\n\nmutation deleteAvatar($userUuid: String!, $avatarUrl: String!) {\n  deleteAvatar(userUuid: $userUuid, avatarUrl: $avatarUrl)\n}\n\nmutation changeCredentials($credentials: ChangeCredentialsInput!) {\n  changeCredentials(credentials: $credentials) {\n    uuid\n    name\n    email\n  }\n}": types.RefreshTokenDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation refreshToken {\n  refreshToken {\n    user {\n      uuid\n      name\n      email\n    }\n    accessToken\n    refreshToken\n  }\n}\n\nmutation createUser($input: UserInput!) {\n  createUser(input: $input) {\n    user {\n      uuid\n      name\n      email\n    }\n    accessToken\n    refreshToken\n  }\n}\n\nmutation logInUser($email: String!, $password: String!) {\n  logInUser(email: $email, password: $password) {\n    user {\n      uuid\n      email\n      name\n    }\n    accessToken\n    refreshToken\n  }\n}\n\nmutation logOutUser {\n  logOutUser\n}\n\nmutation uploadAvatar($image: Upload!, $userUuid: String!) {\n  uploadAvatar(image: $image, userUuid: $userUuid) {\n    url\n    name\n    createdAt\n  }\n}\n\nmutation deleteAvatar($userUuid: String!, $avatarUrl: String!) {\n  deleteAvatar(userUuid: $userUuid, avatarUrl: $avatarUrl)\n}\n\nmutation changeCredentials($credentials: ChangeCredentialsInput!) {\n  changeCredentials(credentials: $credentials) {\n    uuid\n    name\n    email\n  }\n}"): (typeof documents)["mutation refreshToken {\n  refreshToken {\n    user {\n      uuid\n      name\n      email\n    }\n    accessToken\n    refreshToken\n  }\n}\n\nmutation createUser($input: UserInput!) {\n  createUser(input: $input) {\n    user {\n      uuid\n      name\n      email\n    }\n    accessToken\n    refreshToken\n  }\n}\n\nmutation logInUser($email: String!, $password: String!) {\n  logInUser(email: $email, password: $password) {\n    user {\n      uuid\n      email\n      name\n    }\n    accessToken\n    refreshToken\n  }\n}\n\nmutation logOutUser {\n  logOutUser\n}\n\nmutation uploadAvatar($image: Upload!, $userUuid: String!) {\n  uploadAvatar(image: $image, userUuid: $userUuid) {\n    url\n    name\n    createdAt\n  }\n}\n\nmutation deleteAvatar($userUuid: String!, $avatarUrl: String!) {\n  deleteAvatar(userUuid: $userUuid, avatarUrl: $avatarUrl)\n}\n\nmutation changeCredentials($credentials: ChangeCredentialsInput!) {\n  changeCredentials(credentials: $credentials) {\n    uuid\n    name\n    email\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;