import { useNavigate } from 'react-router-dom';
import './SearchResultItem.css';
import {
  useChatWithUserQuery,
  useCreateChatMutation,
} from './search-result-item.generated';
import { DrawOutlineRect, Loader } from '@shared/ui';
import { UserWithAvatar } from '@shared/types';
import { UserIcon } from '@shared/assets';
import { useAuth } from '@app/providers/hooks/useAuth';

export const SearchResultItem = ({
  resultUser,
}: {
  resultUser: UserWithAvatar;
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, loading, error } = useChatWithUserQuery({
    variables: {
      userUuid: resultUser.id,
    },
  });
  const [createChat] = useCreateChatMutation();

  const handleClick = async () => {
    if (user?.uuid === resultUser.id) return;

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
            participantsIds: [resultUser.id],
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
          {resultUser.avatarUrl ? (
            <div className="user-avatar">
              <img src={resultUser.avatarUrl} alt={resultUser.name} />
            </div>
          ) : (
            <div className="empty-avatar">
              <UserIcon />
            </div>
          )}
        </DrawOutlineRect>
        <span className="user-name">{resultUser.name}</span>
      </div>
    </div>
  );
};
