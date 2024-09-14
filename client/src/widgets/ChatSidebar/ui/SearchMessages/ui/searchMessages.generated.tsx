import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FindMessagesQueryVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
  query: Types.Scalars['String']['input'];
}>;


export type FindMessagesQuery = { __typename?: 'Query', findMessages?: Array<{ __typename?: 'Message', id: string, chatId: string, userId: string, userName: string, avatarUrl?: string | null, content?: string | null, createdAt: any, isRead: boolean }> | null };


export const FindMessagesDocument = gql`
    query findMessages($chatId: ID!, $query: String!) {
  findMessages(chatId: $chatId, query: $query) {
    id
    chatId
    userId
    userName
    avatarUrl
    content
    createdAt
    isRead
  }
}
    `;

/**
 * __useFindMessagesQuery__
 *
 * To run a query within a React component, call `useFindMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMessagesQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useFindMessagesQuery(baseOptions: Apollo.QueryHookOptions<FindMessagesQuery, FindMessagesQueryVariables> & ({ variables: FindMessagesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindMessagesQuery, FindMessagesQueryVariables>(FindMessagesDocument, options);
      }
export function useFindMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindMessagesQuery, FindMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindMessagesQuery, FindMessagesQueryVariables>(FindMessagesDocument, options);
        }
export function useFindMessagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FindMessagesQuery, FindMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindMessagesQuery, FindMessagesQueryVariables>(FindMessagesDocument, options);
        }
export type FindMessagesQueryHookResult = ReturnType<typeof useFindMessagesQuery>;
export type FindMessagesLazyQueryHookResult = ReturnType<typeof useFindMessagesLazyQuery>;
export type FindMessagesSuspenseQueryHookResult = ReturnType<typeof useFindMessagesSuspenseQuery>;
export type FindMessagesQueryResult = Apollo.QueryResult<FindMessagesQuery, FindMessagesQueryVariables>;