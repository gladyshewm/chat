import * as Types from '@shared/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FindUsersQueryVariables = Types.Exact<{
  input: Types.Scalars['String']['input'];
}>;


export type FindUsersQuery = { __typename?: 'Query', findUsers: Array<{ __typename?: 'UserWithAvatar', id: string, name: string, avatarUrl?: string | null } | null> };


export const FindUsersDocument = gql`
    query findUsers($input: String!) {
  findUsers(input: $input) {
    id
    name
    avatarUrl
  }
}
    `;

/**
 * __useFindUsersQuery__
 *
 * To run a query within a React component, call `useFindUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindUsersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindUsersQuery(baseOptions: Apollo.QueryHookOptions<FindUsersQuery, FindUsersQueryVariables> & ({ variables: FindUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindUsersQuery, FindUsersQueryVariables>(FindUsersDocument, options);
      }
export function useFindUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindUsersQuery, FindUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindUsersQuery, FindUsersQueryVariables>(FindUsersDocument, options);
        }
export function useFindUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FindUsersQuery, FindUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindUsersQuery, FindUsersQueryVariables>(FindUsersDocument, options);
        }
export type FindUsersQueryHookResult = ReturnType<typeof useFindUsersQuery>;
export type FindUsersLazyQueryHookResult = ReturnType<typeof useFindUsersLazyQuery>;
export type FindUsersSuspenseQueryHookResult = ReturnType<typeof useFindUsersSuspenseQuery>;
export type FindUsersQueryResult = Apollo.QueryResult<FindUsersQuery, FindUsersQueryVariables>;