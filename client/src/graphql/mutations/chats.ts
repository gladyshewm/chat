import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation createChat($participantsIds: [ID!]!, $name: String) {
    createChat(participantsIds: $participantsIds, name: $name) {
      id
      name
      isGroupChat
      groupAvatarUrl
      isGroupChat
      participants {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const UPLOAD_CHAT_AVATAR = gql`
  mutation uploadChatAvatar($image: Upload!, $chatId: ID!) {
    uploadChatAvatar(image: $image, chatId: $chatId)
  }
`;
