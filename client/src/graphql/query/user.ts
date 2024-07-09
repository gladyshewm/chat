import { gql } from '@apollo/client';

export const GET_USER = gql`
  query {
    user {
      uuid
      name
      email
    }
  }
`;

export const GET_USER_AVATAR = gql`
  query userAvatar($userUuid: ID!) {
    userAvatar(userUuid: $userUuid)
  }
`;
