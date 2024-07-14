import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation sendMessage($chatId: ID!, $content: String!) {
    sendMessage(chatId: $chatId, content: $content) {
      userName
      content
      avatarUrl
      createdAt
    }
  }
`;
