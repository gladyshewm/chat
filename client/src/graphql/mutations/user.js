import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation createUser($input: UserInput!) {
        createUser(input: $input) {
            id, name, email
        }
    }
`;

export const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
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
  mutation SignOutUser {
    signOutUser
  }
`;