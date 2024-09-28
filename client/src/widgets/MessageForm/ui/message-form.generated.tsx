import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SendMessageMutationVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
  content?: Types.InputMaybe<Types.Scalars['String']['input']>;
  attachedFiles?: Types.InputMaybe<Array<Types.Scalars['Upload']['input']> | Types.Scalars['Upload']['input']>;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'Message', id: string, userName: string, userId: string, content?: string | null, avatarUrl?: string | null, createdAt: any, attachedFiles: Array<{ __typename?: 'AttachedFile', fileId: string, fileUrl: string, fileName: string } | null> } };


export const SendMessageDocument = gql`
    mutation sendMessage($chatId: ID!, $content: String, $attachedFiles: [Upload!]) {
  sendMessage(chatId: $chatId, content: $content, attachedFiles: $attachedFiles) {
    id
    userName
    userId
    content
    avatarUrl
    createdAt
    attachedFiles {
      fileId
      fileUrl
      fileName
    }
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
 *      attachedFiles: // value for 'attachedFiles'
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