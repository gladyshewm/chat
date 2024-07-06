import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      user {
        id
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
        id
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
