import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ChatWithUserQueryVariables = Types.Exact<{
  userUuid: Types.Scalars['String']['input'];
}>;


export type ChatWithUserQuery = { __typename?: 'Query', chatWithUser?: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string }> } | null };

export type CreateChatSidebarMutationVariables = Types.Exact<{
  participantsIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
  avatar?: Types.InputMaybe<Types.Scalars['Upload']['input']>;
}>;


export type CreateChatSidebarMutation = { __typename?: 'Mutation', createChat: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, isGroupChat: boolean, groupAvatarUrl?: string | null, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> } };


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
export const CreateChatSidebarDocument = gql`
    mutation createChatSidebar($participantsIds: [ID!]!, $name: String, $avatar: Upload) {
  createChat(participantsIds: $participantsIds, name: $name, avatar: $avatar) {
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
export type CreateChatSidebarMutationFn = Apollo.MutationFunction<CreateChatSidebarMutation, CreateChatSidebarMutationVariables>;

/**
 * __useCreateChatSidebarMutation__
 *
 * To run a mutation, you first call `useCreateChatSidebarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChatSidebarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChatSidebarMutation, { data, loading, error }] = useCreateChatSidebarMutation({
 *   variables: {
 *      participantsIds: // value for 'participantsIds'
 *      name: // value for 'name'
 *      avatar: // value for 'avatar'
 *   },
 * });
 */
export function useCreateChatSidebarMutation(baseOptions?: Apollo.MutationHookOptions<CreateChatSidebarMutation, CreateChatSidebarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChatSidebarMutation, CreateChatSidebarMutationVariables>(CreateChatSidebarDocument, options);
      }
export type CreateChatSidebarMutationHookResult = ReturnType<typeof useCreateChatSidebarMutation>;
export type CreateChatSidebarMutationResult = Apollo.MutationResult<CreateChatSidebarMutation>;
export type CreateChatSidebarMutationOptions = Apollo.BaseMutationOptions<CreateChatSidebarMutation, CreateChatSidebarMutationVariables>;