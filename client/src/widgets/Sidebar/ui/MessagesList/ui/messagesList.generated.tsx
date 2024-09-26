import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FindUsersQueryVariables = Types.Exact<{
  input: Types.Scalars['String']['input'];
}>;


export type FindUsersQuery = { __typename?: 'Query', findUsers: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null } | null> };

export type CoreUserChatsFieldsFragment = { __typename?: 'ChatWithoutMessages', id: string, userUuid: string, name?: string | null, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> };

export type UserChatsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserChatsQuery = { __typename?: 'Query', userChats: Array<{ __typename?: 'ChatWithoutMessages', id: string, userUuid: string, name?: string | null, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> }> };

export type UserChatsSubSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type UserChatsSubSubscription = { __typename?: 'Subscription', userChats: Array<{ __typename?: 'ChatWithoutMessages', id: string, userUuid: string, name?: string | null, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> }> };

export const CoreUserChatsFieldsFragmentDoc = gql`
    fragment coreUserChatsFields on ChatWithoutMessages {
  id
  userUuid
  name
  isGroupChat
  groupAvatarUrl
  createdAt
  participants {
    id
    name
    avatarUrl
  }
}
    `;
export const FindUsersDocument = gql`
    query findUsers($input: String!) {
  findUsers(input: $input) {
    id
    name
    avatarUrl
  }
}
    `;

/**
 * __useFindUsersQuery__
 *
 * To run a query within a React component, call `useFindUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindUsersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindUsersQuery(baseOptions: Apollo.QueryHookOptions<FindUsersQuery, FindUsersQueryVariables> & ({ variables: FindUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindUsersQuery, FindUsersQueryVariables>(FindUsersDocument, options);
      }
export function useFindUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindUsersQuery, FindUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindUsersQuery, FindUsersQueryVariables>(FindUsersDocument, options);
        }
export function useFindUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FindUsersQuery, FindUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindUsersQuery, FindUsersQueryVariables>(FindUsersDocument, options);
        }
export type FindUsersQueryHookResult = ReturnType<typeof useFindUsersQuery>;
export type FindUsersLazyQueryHookResult = ReturnType<typeof useFindUsersLazyQuery>;
export type FindUsersSuspenseQueryHookResult = ReturnType<typeof useFindUsersSuspenseQuery>;
export type FindUsersQueryResult = Apollo.QueryResult<FindUsersQuery, FindUsersQueryVariables>;
export const UserChatsDocument = gql`
    query userChats {
  userChats {
    ...coreUserChatsFields
  }
}
    ${CoreUserChatsFieldsFragmentDoc}`;

/**
 * __useUserChatsQuery__
 *
 * To run a query within a React component, call `useUserChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserChatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserChatsQuery(baseOptions?: Apollo.QueryHookOptions<UserChatsQuery, UserChatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserChatsQuery, UserChatsQueryVariables>(UserChatsDocument, options);
      }
export function useUserChatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserChatsQuery, UserChatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserChatsQuery, UserChatsQueryVariables>(UserChatsDocument, options);
        }
export function useUserChatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserChatsQuery, UserChatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserChatsQuery, UserChatsQueryVariables>(UserChatsDocument, options);
        }
export type UserChatsQueryHookResult = ReturnType<typeof useUserChatsQuery>;
export type UserChatsLazyQueryHookResult = ReturnType<typeof useUserChatsLazyQuery>;
export type UserChatsSuspenseQueryHookResult = ReturnType<typeof useUserChatsSuspenseQuery>;
export type UserChatsQueryResult = Apollo.QueryResult<UserChatsQuery, UserChatsQueryVariables>;
export const UserChatsSubDocument = gql`
    subscription userChatsSub {
  userChats {
    ...coreUserChatsFields
  }
}
    ${CoreUserChatsFieldsFragmentDoc}`;

/**
 * __useUserChatsSubSubscription__
 *
 * To run a query within a React component, call `useUserChatsSubSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserChatsSubSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserChatsSubSubscription({
 *   variables: {
 *   },
 * });
 */
export function useUserChatsSubSubscription(baseOptions?: Apollo.SubscriptionHookOptions<UserChatsSubSubscription, UserChatsSubSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserChatsSubSubscription, UserChatsSubSubscriptionVariables>(UserChatsSubDocument, options);
      }
export type UserChatsSubSubscriptionHookResult = ReturnType<typeof useUserChatsSubSubscription>;
export type UserChatsSubSubscriptionResult = Apollo.SubscriptionResult<UserChatsSubSubscription>;