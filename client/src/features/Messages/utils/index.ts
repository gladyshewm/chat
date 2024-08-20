import { Message } from '@shared/types';
import { format, isThisYear } from 'date-fns';
import { ru } from 'date-fns/locale';

interface GroupedMessages {
  [date: string]: Message[];
}

export const groupMessagesByDate = (messages: Message[]): GroupedMessages => {
  const groupedMessages: GroupedMessages = {};

  const messagesSort = [...messages];
  messagesSort.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  messages = messagesSort;

  messages.forEach((msg) => {
    const messageDate = new Date(msg.createdAt);
    const dateFormat = isThisYear(new Date(msg.createdAt))
      ? 'd MMMM'
      : 'd MMMM, yyyy';
    const formattedDate = format(messageDate, dateFormat, {
      locale: ru,
    });

    if (!groupedMessages[formattedDate]) {
      groupedMessages[formattedDate] = [];
    }

    groupedMessages[formattedDate].push(msg);
  });

  return groupedMessages;
};
