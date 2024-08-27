import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ChatAllAvatarsQueryVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
}>;


export type ChatAllAvatarsQuery = { __typename?: 'Query', chatAllAvatars: Array<{ __typename?: 'AvatarInfo', url: string, name: string, createdAt: any } | null> };

export type DeleteChatAvatarMutationVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
}>;


export type DeleteChatAvatarMutation = { __typename?: 'Mutation', deleteChatAvatar?: string | null };


export const ChatAllAvatarsDocument = gql`
    query chatAllAvatars($chatId: ID!) {
  chatAllAvatars(chatId: $chatId) {
    url
    name
    createdAt
  }
}
    `;

/**
 * __useChatAllAvatarsQuery__
 *
 * To run a query within a React component, call `useChatAllAvatarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatAllAvatarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatAllAvatarsQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatAllAvatarsQuery(baseOptions: Apollo.QueryHookOptions<ChatAllAvatarsQuery, ChatAllAvatarsQueryVariables> & ({ variables: ChatAllAvatarsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChatAllAvatarsQuery, ChatAllAvatarsQueryVariables>(ChatAllAvatarsDocument, options);
      }
export function useChatAllAvatarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatAllAvatarsQuery, ChatAllAvatarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChatAllAvatarsQuery, ChatAllAvatarsQueryVariables>(ChatAllAvatarsDocument, options);
        }
export function useChatAllAvatarsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ChatAllAvatarsQuery, ChatAllAvatarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ChatAllAvatarsQuery, ChatAllAvatarsQueryVariables>(ChatAllAvatarsDocument, options);
        }
export type ChatAllAvatarsQueryHookResult = ReturnType<typeof useChatAllAvatarsQuery>;
export type ChatAllAvatarsLazyQueryHookResult = ReturnType<typeof useChatAllAvatarsLazyQuery>;
export type ChatAllAvatarsSuspenseQueryHookResult = ReturnType<typeof useChatAllAvatarsSuspenseQuery>;
export type ChatAllAvatarsQueryResult = Apollo.QueryResult<ChatAllAvatarsQuery, ChatAllAvatarsQueryVariables>;
export const DeleteChatAvatarDocument = gql`
    mutation deleteChatAvatar($chatId: ID!) {
  deleteChatAvatar(chatId: $chatId)
}
    `;
export type DeleteChatAvatarMutationFn = Apollo.MutationFunction<DeleteChatAvatarMutation, DeleteChatAvatarMutationVariables>;

/**
 * __useDeleteChatAvatarMutation__
 *
 * To run a mutation, you first call `useDeleteChatAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChatAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChatAvatarMutation, { data, loading, error }] = useDeleteChatAvatarMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useDeleteChatAvatarMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChatAvatarMutation, DeleteChatAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChatAvatarMutation, DeleteChatAvatarMutationVariables>(DeleteChatAvatarDocument, options);
      }
export type DeleteChatAvatarMutationHookResult = ReturnType<typeof useDeleteChatAvatarMutation>;
export type DeleteChatAvatarMutationResult = Apollo.MutationResult<DeleteChatAvatarMutation>;
export type DeleteChatAvatarMutationOptions = Apollo.BaseMutationOptions<DeleteChatAvatarMutation, DeleteChatAvatarMutationVariables>;