import { gql } from '@apollo/client';

export const POST_MESSAGE = gql`
    mutation postMessage($user: String!, $content: String!) {
        postMessage(user: $user, content: $content)
    }
`;