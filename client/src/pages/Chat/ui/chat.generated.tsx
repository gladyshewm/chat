import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ChatByIdQueryVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
}>;


export type ChatByIdQuery = { __typename?: 'Query', chatById?: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, userUuid: string, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> } | null };

export type ChatByIdSubSubscriptionVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
}>;


export type ChatByIdSubSubscription = { __typename?: 'Subscription', chatById?: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, userUuid: string, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> } | null };

export type SendTypingStatusMutationVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
  userName: Types.Scalars['String']['input'];
  isTyping: Types.Scalars['Boolean']['input'];
}>;


export type SendTypingStatusMutation = { __typename?: 'Mutation', sendTypingStatus: { __typename?: 'TypingFeedback', chatId: string, userName: string, isTyping: boolean } };

export type UserTypingSubscriptionVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
}>;


export type UserTypingSubscription = { __typename?: 'Subscription', userTyping: { __typename?: 'TypingFeedback', chatId: string, userName: string, isTyping: boolean } };


export const ChatByIdDocument = gql`
    query chatById($chatId: ID!) {
  chatById(chatId: $chatId) {
    id
    name
    userUuid
    isGroupChat
    groupAvatarUrl
    participants {
      id
      name
      avatarUrl
    }
    createdAt
  }
}
    `;

/**
 * __useChatByIdQuery__
 *
 * To run a query within a React component, call `useChatByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatByIdQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatByIdQuery(baseOptions: Apollo.QueryHookOptions<ChatByIdQuery, ChatByIdQueryVariables> & ({ variables: ChatByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChatByIdQuery, ChatByIdQueryVariables>(ChatByIdDocument, options);
      }
export function useChatByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatByIdQuery, ChatByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChatByIdQuery, ChatByIdQueryVariables>(ChatByIdDocument, options);
        }
export function useChatByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ChatByIdQuery, ChatByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ChatByIdQuery, ChatByIdQueryVariables>(ChatByIdDocument, options);
        }
export type ChatByIdQueryHookResult = ReturnType<typeof useChatByIdQuery>;
export type ChatByIdLazyQueryHookResult = ReturnType<typeof useChatByIdLazyQuery>;
export type ChatByIdSuspenseQueryHookResult = ReturnType<typeof useChatByIdSuspenseQuery>;
export type ChatByIdQueryResult = Apollo.QueryResult<ChatByIdQuery, ChatByIdQueryVariables>;
export const ChatByIdSubDocument = gql`
    subscription chatByIdSub($chatId: ID!) {
  chatById(chatId: $chatId) {
    id
    name
    userUuid
    isGroupChat
    groupAvatarUrl
    participants {
      id
      name
      avatarUrl
    }
    createdAt
  }
}
    `;

/**
 * __useChatByIdSubSubscription__
 *
 * To run a query within a React component, call `useChatByIdSubSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatByIdSubSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatByIdSubSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatByIdSubSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatByIdSubSubscription, ChatByIdSubSubscriptionVariables> & ({ variables: ChatByIdSubSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatByIdSubSubscription, ChatByIdSubSubscriptionVariables>(ChatByIdSubDocument, options);
      }
export type ChatByIdSubSubscriptionHookResult = ReturnType<typeof useChatByIdSubSubscription>;
export type ChatByIdSubSubscriptionResult = Apollo.SubscriptionResult<ChatByIdSubSubscription>;
export const SendTypingStatusDocument = gql`
    mutation sendTypingStatus($chatId: ID!, $userName: String!, $isTyping: Boolean!) {
  sendTypingStatus(chatId: $chatId, userName: $userName, isTyping: $isTyping) {
    chatId
    userName
    isTyping
  }
}
    `;
export type SendTypingStatusMutationFn = Apollo.MutationFunction<SendTypingStatusMutation, SendTypingStatusMutationVariables>;

/**
 * __useSendTypingStatusMutation__
 *
 * To run a mutation, you first call `useSendTypingStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendTypingStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendTypingStatusMutation, { data, loading, error }] = useSendTypingStatusMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      userName: // value for 'userName'
 *      isTyping: // value for 'isTyping'
 *   },
 * });
 */
export function useSendTypingStatusMutation(baseOptions?: Apollo.MutationHookOptions<SendTypingStatusMutation, SendTypingStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendTypingStatusMutation, SendTypingStatusMutationVariables>(SendTypingStatusDocument, options);
      }
export type SendTypingStatusMutationHookResult = ReturnType<typeof useSendTypingStatusMutation>;
export type SendTypingStatusMutationResult = Apollo.MutationResult<SendTypingStatusMutation>;
export type SendTypingStatusMutationOptions = Apollo.BaseMutationOptions<SendTypingStatusMutation, SendTypingStatusMutationVariables>;
export const UserTypingDocument = gql`
    subscription userTyping($chatId: ID!) {
  userTyping(chatId: $chatId) {
    chatId
    userName
    isTyping
  }
}
    `;

/**
 * __useUserTypingSubscription__
 *
 * To run a query within a React component, call `useUserTypingSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserTypingSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTypingSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useUserTypingSubscription(baseOptions: Apollo.SubscriptionHookOptions<UserTypingSubscription, UserTypingSubscriptionVariables> & ({ variables: UserTypingSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserTypingSubscription, UserTypingSubscriptionVariables>(UserTypingDocument, options);
      }
export type UserTypingSubscriptionHookResult = ReturnType<typeof useUserTypingSubscription>;
export type UserTypingSubscriptionResult = Apollo.SubscriptionResult<UserTypingSubscription>;