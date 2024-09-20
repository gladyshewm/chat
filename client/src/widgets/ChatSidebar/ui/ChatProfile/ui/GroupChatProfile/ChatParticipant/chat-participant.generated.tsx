import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ChatWithUserQueryVariables = Types.Exact<{
  userUuid: Types.Scalars['String']['input'];
}>;


export type ChatWithUserQuery = { __typename?: 'Query', chatWithUser?: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string }> } | null };

export type CreateChatMutationVariables = Types.Exact<{
  participantsIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type CreateChatMutation = { __typename?: 'Mutation', createChat: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, isGroupChat: boolean, groupAvatarUrl?: string | null, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> } };

export type RemoveUserFromChatMutationVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
  userUuid: Types.Scalars['ID']['input'];
}>;


export type RemoveUserFromChatMutation = { __typename?: 'Mutation', removeUserFromChat: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, userUuid: string, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> } };


export const ChatWithUserDocument = gql`
    query chatWithUser($userUuid: String!) {
  chatWithUser(userUuid: $userUuid) {
    id
    name
    participants {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useChatWithUserQuery__
 *
 * To run a query within a React component, call `useChatWithUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatWithUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatWithUserQuery({
 *   variables: {
 *      userUuid: // value for 'userUuid'
 *   },
 * });
 */
export function useChatWithUserQuery(baseOptions: Apollo.QueryHookOptions<ChatWithUserQuery, ChatWithUserQueryVariables> & ({ variables: ChatWithUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChatWithUserQuery, ChatWithUserQueryVariables>(ChatWithUserDocument, options);
      }
export function useChatWithUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatWithUserQuery, ChatWithUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChatWithUserQuery, ChatWithUserQueryVariables>(ChatWithUserDocument, options);
        }
export function useChatWithUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ChatWithUserQuery, ChatWithUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ChatWithUserQuery, ChatWithUserQueryVariables>(ChatWithUserDocument, options);
        }
export type ChatWithUserQueryHookResult = ReturnType<typeof useChatWithUserQuery>;
export type ChatWithUserLazyQueryHookResult = ReturnType<typeof useChatWithUserLazyQuery>;
export type ChatWithUserSuspenseQueryHookResult = ReturnType<typeof useChatWithUserSuspenseQuery>;
export type ChatWithUserQueryResult = Apollo.QueryResult<ChatWithUserQuery, ChatWithUserQueryVariables>;
export const CreateChatDocument = gql`
    mutation createChat($participantsIds: [ID!]!, $name: String) {
  createChat(participantsIds: $participantsIds, name: $name) {
    id
    name
    isGroupChat
    groupAvatarUrl
    isGroupChat
    participants {
      id
      name
      avatarUrl
    }
  }
}
    `;
export type CreateChatMutationFn = Apollo.MutationFunction<CreateChatMutation, CreateChatMutationVariables>;

/**
 * __useCreateChatMutation__
 *
 * To run a mutation, you first call `useCreateChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChatMutation, { data, loading, error }] = useCreateChatMutation({
 *   variables: {
 *      participantsIds: // value for 'participantsIds'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateChatMutation(baseOptions?: Apollo.MutationHookOptions<CreateChatMutation, CreateChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChatMutation, CreateChatMutationVariables>(CreateChatDocument, options);
      }
export type CreateChatMutationHookResult = ReturnType<typeof useCreateChatMutation>;
export type CreateChatMutationResult = Apollo.MutationResult<CreateChatMutation>;
export type CreateChatMutationOptions = Apollo.BaseMutationOptions<CreateChatMutation, CreateChatMutationVariables>;
export const RemoveUserFromChatDocument = gql`
    mutation removeUserFromChat($chatId: ID!, $userUuid: ID!) {
  removeUserFromChat(chatId: $chatId, userUuid: $userUuid) {
    id
    name
    userUuid
    isGroupChat
    groupAvatarUrl
    createdAt
    participants {
      id
      name
      avatarUrl
    }
  }
}
    `;
export type RemoveUserFromChatMutationFn = Apollo.MutationFunction<RemoveUserFromChatMutation, RemoveUserFromChatMutationVariables>;

/**
 * __useRemoveUserFromChatMutation__
 *
 * To run a mutation, you first call `useRemoveUserFromChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserFromChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserFromChatMutation, { data, loading, error }] = useRemoveUserFromChatMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      userUuid: // value for 'userUuid'
 *   },
 * });
 */
export function useRemoveUserFromChatMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserFromChatMutation, RemoveUserFromChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserFromChatMutation, RemoveUserFromChatMutationVariables>(RemoveUserFromChatDocument, options);
      }
export type RemoveUserFromChatMutationHookResult = ReturnType<typeof useRemoveUserFromChatMutation>;
export type RemoveUserFromChatMutationResult = Apollo.MutationResult<RemoveUserFromChatMutation>;
export type RemoveUserFromChatMutationOptions = Apollo.BaseMutationOptions<RemoveUserFromChatMutation, RemoveUserFromChatMutationVariables>;