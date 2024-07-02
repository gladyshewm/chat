import { gql } from '@apollo/client';

export const MESSAGES_SUBSCRIPTION = gql`
    subscription {
        messageAdded {
            id, user, content
        }
    }
`;
