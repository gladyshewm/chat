import { gql } from '@apollo/client';

export const GET_USER_CHATS = gql`
  query {
    userChats {
      id
      name
      participants {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query chatMessages($chatId: ID!, $limit: Int, $offset: Int) {
    chatMessages(chatId: $chatId, limit: $limit, offset: $offset) {
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
