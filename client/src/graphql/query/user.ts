import { gql } from '@apollo/client';

export const GET_USER = gql`
  query {
    user {
      user {
        uuid
        name
        email
      }
      token
    }
  }
`;

export const GET_USER_AVATAR = gql`
  query userAvatar($userUuid: ID!) {
    userAvatar(userUuid: $userUuid) {
      url
      name
      createdAt
    }
  }
`;

export const GET_USER_ALL_AVATARS = gql`
  query userAllAvatars($userUuid: ID!) {
    userAllAvatars(userUuid: $userUuid) {
      url
      name
      createdAt
    }
  }
`;

export const FIND_USERS = gql`
  query findUsers($input: String!) {
    findUsers(input: $input) {
      id
      name
      avatarUrl
    }
  }
`;
