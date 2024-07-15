import { gql } from '@apollo/client';

export const MESSAGES_SUBSCRIPTION = gql`
  subscription messageSent($chatId: ID!) {
    messageSent(chatId: $chatId) {
      id
      userId
      content
      createdAt
      isRead
      userName
      avatarUrl
    }
  }
`;
