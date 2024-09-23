import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NewChatCreatedSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type NewChatCreatedSubscription = { __typename?: 'Subscription', newChatCreated?: { __typename?: 'ChatWithoutMessages', id: string, name?: string | null, userUuid: string, isGroupChat: boolean, groupAvatarUrl?: string | null, createdAt: any, participants: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null }> } | null };


export const NewChatCreatedDocument = gql`
    subscription newChatCreated {
  newChatCreated {
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
 * __useNewChatCreatedSubscription__
 *
 * To run a query within a React component, call `useNewChatCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewChatCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewChatCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewChatCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewChatCreatedSubscription, NewChatCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewChatCreatedSubscription, NewChatCreatedSubscriptionVariables>(NewChatCreatedDocument, options);
      }
export type NewChatCreatedSubscriptionHookResult = ReturnType<typeof useNewChatCreatedSubscription>;
export type NewChatCreatedSubscriptionResult = Apollo.SubscriptionResult<NewChatCreatedSubscription>;