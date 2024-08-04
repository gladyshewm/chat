import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'UserWithToken', token: string, user: { __typename?: 'UserInfo', uuid: string, name: string, email: string } } | null };

export type CreateUserMutationVariables = Types.Exact<{
  createInput: Types.CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'UserInfo', uuid: string, name: string, email: string } } };

export type LogInUserMutationVariables = Types.Exact<{
  loginInput: Types.LoginUserInput;
}>;


export type LogInUserMutation = { __typename?: 'Mutation', logInUser: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'UserInfo', uuid: string, name: string, email: string } } };

export type LogOutUserMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type LogOutUserMutation = { __typename?: 'Mutation', logOutUser: boolean };

export type RefreshTokenMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'UserInfo', uuid: string, name: string, email: string } } };


export const UserDocument = gql`
    query user {
  user {
    user {
      uuid
      name
      email
    }
    token
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export function useUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const CreateUserDocument = gql`
    mutation createUser($createInput: CreateUserInput!) {
  createUser(createInput: $createInput) {
    user {
      uuid
      name
      email
    }
    accessToken
    refreshToken
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      createInput: // value for 'createInput'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const LogInUserDocument = gql`
    mutation logInUser($loginInput: LoginUserInput!) {
  logInUser(loginInput: $loginInput) {
    user {
      uuid
      name
      email
    }
    accessToken
    refreshToken
  }
}
    `;
export type LogInUserMutationFn = Apollo.MutationFunction<LogInUserMutation, LogInUserMutationVariables>;

/**
 * __useLogInUserMutation__
 *
 * To run a mutation, you first call `useLogInUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInUserMutation, { data, loading, error }] = useLogInUserMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLogInUserMutation(baseOptions?: Apollo.MutationHookOptions<LogInUserMutation, LogInUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogInUserMutation, LogInUserMutationVariables>(LogInUserDocument, options);
      }
export type LogInUserMutationHookResult = ReturnType<typeof useLogInUserMutation>;
export type LogInUserMutationResult = Apollo.MutationResult<LogInUserMutation>;
export type LogInUserMutationOptions = Apollo.BaseMutationOptions<LogInUserMutation, LogInUserMutationVariables>;
export const LogOutUserDocument = gql`
    mutation logOutUser {
  logOutUser
}
    `;
export type LogOutUserMutationFn = Apollo.MutationFunction<LogOutUserMutation, LogOutUserMutationVariables>;

/**
 * __useLogOutUserMutation__
 *
 * To run a mutation, you first call `useLogOutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogOutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logOutUserMutation, { data, loading, error }] = useLogOutUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogOutUserMutation(baseOptions?: Apollo.MutationHookOptions<LogOutUserMutation, LogOutUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogOutUserMutation, LogOutUserMutationVariables>(LogOutUserDocument, options);
      }
export type LogOutUserMutationHookResult = ReturnType<typeof useLogOutUserMutation>;
export type LogOutUserMutationResult = Apollo.MutationResult<LogOutUserMutation>;
export type LogOutUserMutationOptions = Apollo.BaseMutationOptions<LogOutUserMutation, LogOutUserMutationVariables>;
export const RefreshTokenDocument = gql`
    mutation refreshToken {
  refreshToken {
    user {
      uuid
      name
      email
    }
    accessToken
    refreshToken
  }
}
    `;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;