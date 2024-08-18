import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UserAvatarQueryVariables = Types.Exact<{
  userUuid: Types.Scalars['ID']['input'];
}>;


export type UserAvatarQuery = { __typename?: 'Query', userAvatar?: { __typename?: 'AvatarInfo', url: string, name: string, createdAt: any } | null };

export type UserAllAvatarsQueryVariables = Types.Exact<{
  userUuid: Types.Scalars['ID']['input'];
}>;


export type UserAllAvatarsQuery = { __typename?: 'Query', userAllAvatars: Array<{ __typename?: 'AvatarInfo', url: string, name: string, createdAt: any } | null> };

export type UploadAvatarMutationVariables = Types.Exact<{
  image: Types.Scalars['Upload']['input'];
}>;


export type UploadAvatarMutation = { __typename?: 'Mutation', uploadAvatar: { __typename?: 'AvatarInfo', url: string, name: string, createdAt: any } };

export type DeleteAvatarMutationVariables = Types.Exact<{
  avatarUrl: Types.Scalars['String']['input'];
}>;


export type DeleteAvatarMutation = { __typename?: 'Mutation', deleteAvatar?: string | null };

export type ChangeCredentialsMutationVariables = Types.Exact<{
  credentials: Types.ChangeCredentialsInput;
}>;


export type ChangeCredentialsMutation = { __typename?: 'Mutation', changeCredentials: { __typename?: 'UserInfo', uuid: string, name: string, email: string } };


export const UserAvatarDocument = gql`
    query userAvatar($userUuid: ID!) {
  userAvatar(userUuid: $userUuid) {
    url
    name
    createdAt
  }
}
    `;

/**
 * __useUserAvatarQuery__
 *
 * To run a query within a React component, call `useUserAvatarQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserAvatarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserAvatarQuery({
 *   variables: {
 *      userUuid: // value for 'userUuid'
 *   },
 * });
 */
export function useUserAvatarQuery(baseOptions: Apollo.QueryHookOptions<UserAvatarQuery, UserAvatarQueryVariables> & ({ variables: UserAvatarQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserAvatarQuery, UserAvatarQueryVariables>(UserAvatarDocument, options);
      }
export function useUserAvatarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserAvatarQuery, UserAvatarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserAvatarQuery, UserAvatarQueryVariables>(UserAvatarDocument, options);
        }
export function useUserAvatarSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserAvatarQuery, UserAvatarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserAvatarQuery, UserAvatarQueryVariables>(UserAvatarDocument, options);
        }
export type UserAvatarQueryHookResult = ReturnType<typeof useUserAvatarQuery>;
export type UserAvatarLazyQueryHookResult = ReturnType<typeof useUserAvatarLazyQuery>;
export type UserAvatarSuspenseQueryHookResult = ReturnType<typeof useUserAvatarSuspenseQuery>;
export type UserAvatarQueryResult = Apollo.QueryResult<UserAvatarQuery, UserAvatarQueryVariables>;
export const UserAllAvatarsDocument = gql`
    query userAllAvatars($userUuid: ID!) {
  userAllAvatars(userUuid: $userUuid) {
    url
    name
    createdAt
  }
}
    `;

/**
 * __useUserAllAvatarsQuery__
 *
 * To run a query within a React component, call `useUserAllAvatarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserAllAvatarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserAllAvatarsQuery({
 *   variables: {
 *      userUuid: // value for 'userUuid'
 *   },
 * });
 */
export function useUserAllAvatarsQuery(baseOptions: Apollo.QueryHookOptions<UserAllAvatarsQuery, UserAllAvatarsQueryVariables> & ({ variables: UserAllAvatarsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserAllAvatarsQuery, UserAllAvatarsQueryVariables>(UserAllAvatarsDocument, options);
      }
export function useUserAllAvatarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserAllAvatarsQuery, UserAllAvatarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserAllAvatarsQuery, UserAllAvatarsQueryVariables>(UserAllAvatarsDocument, options);
        }
export function useUserAllAvatarsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserAllAvatarsQuery, UserAllAvatarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserAllAvatarsQuery, UserAllAvatarsQueryVariables>(UserAllAvatarsDocument, options);
        }
export type UserAllAvatarsQueryHookResult = ReturnType<typeof useUserAllAvatarsQuery>;
export type UserAllAvatarsLazyQueryHookResult = ReturnType<typeof useUserAllAvatarsLazyQuery>;
export type UserAllAvatarsSuspenseQueryHookResult = ReturnType<typeof useUserAllAvatarsSuspenseQuery>;
export type UserAllAvatarsQueryResult = Apollo.QueryResult<UserAllAvatarsQuery, UserAllAvatarsQueryVariables>;
export const UploadAvatarDocument = gql`
    mutation uploadAvatar($image: Upload!) {
  uploadAvatar(image: $image) {
    url
    name
    createdAt
  }
}
    `;
export type UploadAvatarMutationFn = Apollo.MutationFunction<UploadAvatarMutation, UploadAvatarMutationVariables>;

/**
 * __useUploadAvatarMutation__
 *
 * To run a mutation, you first call `useUploadAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadAvatarMutation, { data, loading, error }] = useUploadAvatarMutation({
 *   variables: {
 *      image: // value for 'image'
 *   },
 * });
 */
export function useUploadAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UploadAvatarMutation, UploadAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadAvatarMutation, UploadAvatarMutationVariables>(UploadAvatarDocument, options);
      }
export type UploadAvatarMutationHookResult = ReturnType<typeof useUploadAvatarMutation>;
export type UploadAvatarMutationResult = Apollo.MutationResult<UploadAvatarMutation>;
export type UploadAvatarMutationOptions = Apollo.BaseMutationOptions<UploadAvatarMutation, UploadAvatarMutationVariables>;
export const DeleteAvatarDocument = gql`
    mutation deleteAvatar($avatarUrl: String!) {
  deleteAvatar(avatarUrl: $avatarUrl)
}
    `;
export type DeleteAvatarMutationFn = Apollo.MutationFunction<DeleteAvatarMutation, DeleteAvatarMutationVariables>;

/**
 * __useDeleteAvatarMutation__
 *
 * To run a mutation, you first call `useDeleteAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAvatarMutation, { data, loading, error }] = useDeleteAvatarMutation({
 *   variables: {
 *      avatarUrl: // value for 'avatarUrl'
 *   },
 * });
 */
export function useDeleteAvatarMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAvatarMutation, DeleteAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAvatarMutation, DeleteAvatarMutationVariables>(DeleteAvatarDocument, options);
      }
export type DeleteAvatarMutationHookResult = ReturnType<typeof useDeleteAvatarMutation>;
export type DeleteAvatarMutationResult = Apollo.MutationResult<DeleteAvatarMutation>;
export type DeleteAvatarMutationOptions = Apollo.BaseMutationOptions<DeleteAvatarMutation, DeleteAvatarMutationVariables>;
export const ChangeCredentialsDocument = gql`
    mutation changeCredentials($credentials: ChangeCredentialsInput!) {
  changeCredentials(credentials: $credentials) {
    uuid
    name
    email
  }
}
    `;
export type ChangeCredentialsMutationFn = Apollo.MutationFunction<ChangeCredentialsMutation, ChangeCredentialsMutationVariables>;

/**
 * __useChangeCredentialsMutation__
 *
 * To run a mutation, you first call `useChangeCredentialsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeCredentialsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeCredentialsMutation, { data, loading, error }] = useChangeCredentialsMutation({
 *   variables: {
 *      credentials: // value for 'credentials'
 *   },
 * });
 */
export function useChangeCredentialsMutation(baseOptions?: Apollo.MutationHookOptions<ChangeCredentialsMutation, ChangeCredentialsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeCredentialsMutation, ChangeCredentialsMutationVariables>(ChangeCredentialsDocument, options);
      }
export type ChangeCredentialsMutationHookResult = ReturnType<typeof useChangeCredentialsMutation>;
export type ChangeCredentialsMutationResult = Apollo.MutationResult<ChangeCredentialsMutation>;
export type ChangeCredentialsMutationOptions = Apollo.BaseMutationOptions<ChangeCredentialsMutation, ChangeCredentialsMutationVariables>;