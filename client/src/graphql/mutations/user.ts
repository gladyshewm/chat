import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      user {
        uuid
        name
        email
      }
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation logInUser($email: String!, $password: String!) {
    logInUser(email: $email, password: $password) {
      user {
        uuid
        email
        name
      }
      token
    }
  }
`;

export const SIGN_OUT_USER = gql`
  mutation logOutUser {
    logOutUser
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation uploadAvatar($image: Upload!, $userUuid: String!) {
    uploadAvatar(image: $image, userUuid: $userUuid) {
      url
      name
      createdAt
    }
  }
`;

export const DELETE_AVATAR = gql`
  mutation deleteAvatar($userUuid: String!, $avatarUrl: String!) {
    deleteAvatar(userUuid: $userUuid, avatarUrl: $avatarUrl)
  }
`;

export const CHANGE_CREDENTIALS = gql`
  mutation changeCredentials($credentials: ChangeCredentialsInput!) {
    changeCredentials(credentials: $credentials) {
      uuid
      name
      email
    }
  }
`;
