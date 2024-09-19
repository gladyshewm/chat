import { useNavigate } from 'react-router-dom';
import './ChatParticipant.css';
import { DrawOutlineRect, Loader, OptionButton } from '@shared/ui';
import { ChatWithoutMessages, UserWithAvatar } from '@shared/types';
import { EllipsisVerticalIcon, UserIcon } from '@shared/assets';
import { useAuth } from '@app/providers/hooks/useAuth';
import {
  useChatWithUserQuery,
  useCreateChatMutation,
} from './chat-participant.generated';

interface ChatParticipantProps {
  chat: ChatWithoutMessages;
  participant: UserWithAvatar;
}

export const ChatParticipant = ({
  chat,
  participant,
}: ChatParticipantProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, loading, error } = useChatWithUserQuery({
    variables: {
      userUuid: participant.id,
    },
  });
  const [createChat] = useCreateChatMutation();

  const handleClick = async () => {
    if (user?.uuid === participant.id) return;

    if (loading) return <Loader />;

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    if (data && data.chatWithUser) {
      navigate(`/chat/${data.chatWithUser.id}`);
    } else {
      try {
        const result = await createChat({
          variables: {
            participantsIds: [participant.id],
            name: null,
          },
        });

        navigate(`/chat/${result.data?.createChat?.id}`);
      } catch (error) {
        console.error('Не удалось создать чат', error);
        throw new Error(`Ошибка при создании чата: ${error.message}`);
      }
    }
  };

  return (
    <div className="search-list-block" onClick={handleClick}>
      <div className="user-result">
        <DrawOutlineRect className="avatar-wrapper" strokeWidth={1} rx="50%">
          {participant.avatarUrl ? (
            <div className="user-avatar">
              <img src={participant.avatarUrl} alt={participant.name} />
            </div>
          ) : (
            <div className="empty-avatar">
              <UserIcon />
            </div>
          )}
        </DrawOutlineRect>
        <div className="user-info">
          <span className="user-name">{participant.name}</span>
          {chat.userUuid === participant.id ? (
            <span id="user-role">Создатель чата</span>
          ) : (
            <OptionButton>
              <abbr title="Действия">
                <EllipsisVerticalIcon />
              </abbr>
            </OptionButton>
          )}
        </div>
      </div>
    </div>
  );
};
