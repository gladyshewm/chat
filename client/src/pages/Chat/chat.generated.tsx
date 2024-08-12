import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ChatByIdQueryVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
}>;


export type ChatByIdQuery = { __typename?: 'Query', chatById?: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, userUuid: string, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> } | null };

export type ChatMessagesQueryVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type ChatMessagesQuery = { __typename?: 'Query', chatMessages?: Array<{ __typename?: 'Message', id: string, userId: string, content: string, createdAt: any, isRead: boolean, userName: string, avatarUrl?: string | null }> | null };

export type SendMessageMutationVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
  content: Types.Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'Message', userName: string, content: string, avatarUrl?: string | null, createdAt: any } };

export type MessageSentSubscriptionVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
}>;


export type MessageSentSubscription = { __typename?: 'Subscription', messageSent: { __typename?: 'Message', id: string, userId: string, chatId: string, content: string, createdAt: any, isRead: boolean, userName: string, avatarUrl?: string | null } };


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
export const ChatMessagesDocument = gql`
    query chatMessages($chatId: ID!, $limit: Int, $offset: Int) {
  chatMessages(chatId: $chatId, limit: $limit, offset: $offset) {
    id
    userId
    content
    createdAt
    isRead
    userName
    avatarUrl
  }
}
    `;

/**
 * __useChatMessagesQuery__
 *
 * To run a query within a React component, call `useChatMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatMessagesQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useChatMessagesQuery(baseOptions: Apollo.QueryHookOptions<ChatMessagesQuery, ChatMessagesQueryVariables> & ({ variables: ChatMessagesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChatMessagesQuery, ChatMessagesQueryVariables>(ChatMessagesDocument, options);
      }
export function useChatMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatMessagesQuery, ChatMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChatMessagesQuery, ChatMessagesQueryVariables>(ChatMessagesDocument, options);
        }
export function useChatMessagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ChatMessagesQuery, ChatMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ChatMessagesQuery, ChatMessagesQueryVariables>(ChatMessagesDocument, options);
        }
export type ChatMessagesQueryHookResult = ReturnType<typeof useChatMessagesQuery>;
export type ChatMessagesLazyQueryHookResult = ReturnType<typeof useChatMessagesLazyQuery>;
export type ChatMessagesSuspenseQueryHookResult = ReturnType<typeof useChatMessagesSuspenseQuery>;
export type ChatMessagesQueryResult = Apollo.QueryResult<ChatMessagesQuery, ChatMessagesQueryVariables>;
export const SendMessageDocument = gql`
    mutation sendMessage($chatId: ID!, $content: String!) {
  sendMessage(chatId: $chatId, content: $content) {
    userName
    content
    avatarUrl
    createdAt
  }
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const MessageSentDocument = gql`
    subscription messageSent($chatId: ID!) {
  messageSent(chatId: $chatId) {
    id
    userId
    chatId
    content
    createdAt
    isRead
    userName
    avatarUrl
  }
}
    `;

/**
 * __useMessageSentSubscription__
 *
 * To run a query within a React component, call `useMessageSentSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageSentSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageSentSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useMessageSentSubscription(baseOptions: Apollo.SubscriptionHookOptions<MessageSentSubscription, MessageSentSubscriptionVariables> & ({ variables: MessageSentSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageSentSubscription, MessageSentSubscriptionVariables>(MessageSentDocument, options);
      }
export type MessageSentSubscriptionHookResult = ReturnType<typeof useMessageSentSubscription>;
export type MessageSentSubscriptionResult = Apollo.SubscriptionResult<MessageSentSubscription>;