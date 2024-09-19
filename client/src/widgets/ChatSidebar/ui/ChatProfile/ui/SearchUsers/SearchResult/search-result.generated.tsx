import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddUserToChatMutationVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
  userUuid: Types.Scalars['ID']['input'];
}>;


export type AddUserToChatMutation = { __typename?: 'Mutation', addUserToChat: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, userUuid: string, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> } };


export const AddUserToChatDocument = gql`
    mutation addUserToChat($chatId: ID!, $userUuid: ID!) {
  addUserToChat(chatId: $chatId, userUuid: $userUuid) {
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
export type AddUserToChatMutationFn = Apollo.MutationFunction<AddUserToChatMutation, AddUserToChatMutationVariables>;

/**
 * __useAddUserToChatMutation__
 *
 * To run a mutation, you first call `useAddUserToChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserToChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserToChatMutation, { data, loading, error }] = useAddUserToChatMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      userUuid: // value for 'userUuid'
 *   },
 * });
 */
export function useAddUserToChatMutation(baseOptions?: Apollo.MutationHookOptions<AddUserToChatMutation, AddUserToChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddUserToChatMutation, AddUserToChatMutationVariables>(AddUserToChatDocument, options);
      }
export type AddUserToChatMutationHookResult = ReturnType<typeof useAddUserToChatMutation>;
export type AddUserToChatMutationResult = Apollo.MutationResult<AddUserToChatMutation>;
export type AddUserToChatMutationOptions = Apollo.BaseMutationOptions<AddUserToChatMutation, AddUserToChatMutationVariables>;