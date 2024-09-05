import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SendMessageMutationVariables = Types.Exact<{
  sendMessageInput: Types.SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'Message', userName: string, content: string, avatarUrl?: string | null, createdAt: any, attachedFiles: Array<{ __typename?: 'AttachedFile', fileId: string, fileUrl: string, fileName: string } | null> } };


export const SendMessageDocument = gql`
    mutation sendMessage($sendMessageInput: SendMessageInput!) {
  sendMessage(sendMessageInput: $sendMessageInput) {
    userName
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
 *      sendMessageInput: // value for 'sendMessageInput'
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