import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UploadChatAvatarMutationVariables = Types.Exact<{
  image: Types.Scalars['Upload']['input'];
  chatId: Types.Scalars['ID']['input'];
}>;


export type UploadChatAvatarMutation = { __typename?: 'Mutation', uploadChatAvatar: string };

export type ChangeChatNameMutationVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
  newName: Types.Scalars['String']['input'];
}>;


export type ChangeChatNameMutation = { __typename?: 'Mutation', changeChatName: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, userUuid: string, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> } };


export const UploadChatAvatarDocument = gql`
    mutation uploadChatAvatar($image: Upload!, $chatId: ID!) {
  uploadChatAvatar(image: $image, chatId: $chatId)
}
    `;
export type UploadChatAvatarMutationFn = Apollo.MutationFunction<UploadChatAvatarMutation, UploadChatAvatarMutationVariables>;

/**
 * __useUploadChatAvatarMutation__
 *
 * To run a mutation, you first call `useUploadChatAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadChatAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadChatAvatarMutation, { data, loading, error }] = useUploadChatAvatarMutation({
 *   variables: {
 *      image: // value for 'image'
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useUploadChatAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UploadChatAvatarMutation, UploadChatAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadChatAvatarMutation, UploadChatAvatarMutationVariables>(UploadChatAvatarDocument, options);
      }
export type UploadChatAvatarMutationHookResult = ReturnType<typeof useUploadChatAvatarMutation>;
export type UploadChatAvatarMutationResult = Apollo.MutationResult<UploadChatAvatarMutation>;
export type UploadChatAvatarMutationOptions = Apollo.BaseMutationOptions<UploadChatAvatarMutation, UploadChatAvatarMutationVariables>;
export const ChangeChatNameDocument = gql`
    mutation changeChatName($chatId: ID!, $newName: String!) {
  changeChatName(chatId: $chatId, newName: $newName) {
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
export type ChangeChatNameMutationFn = Apollo.MutationFunction<ChangeChatNameMutation, ChangeChatNameMutationVariables>;

/**
 * __useChangeChatNameMutation__
 *
 * To run a mutation, you first call `useChangeChatNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeChatNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeChatNameMutation, { data, loading, error }] = useChangeChatNameMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      newName: // value for 'newName'
 *   },
 * });
 */
export function useChangeChatNameMutation(baseOptions?: Apollo.MutationHookOptions<ChangeChatNameMutation, ChangeChatNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeChatNameMutation, ChangeChatNameMutationVariables>(ChangeChatNameDocument, options);
      }
export type ChangeChatNameMutationHookResult = ReturnType<typeof useChangeChatNameMutation>;
export type ChangeChatNameMutationResult = Apollo.MutationResult<ChangeChatNameMutation>;
export type ChangeChatNameMutationOptions = Apollo.BaseMutationOptions<ChangeChatNameMutation, ChangeChatNameMutationVariables>;