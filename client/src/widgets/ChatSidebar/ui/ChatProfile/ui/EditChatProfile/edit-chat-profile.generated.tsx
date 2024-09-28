import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UploadChatAvatarMutationVariables = Types.Exact<{
  image: Types.Scalars['Upload']['input'];
  chatId: Types.Scalars['ID']['input'];
}>;


export type UploadChatAvatarMutation = { __typename?: 'Mutation', uploadChatAvatar: string };


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