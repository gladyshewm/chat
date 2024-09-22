import './AddChatDescription.css';
import { ArrowLeftIcon } from '@shared/assets';
import { DrawOutline, OptionButton } from '@shared/ui';
import { UserWithAvatar } from '@shared/types';

interface AddChatDescriptionProps {
  setIsChatDescription: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUsers: UserWithAvatar[];
}

export const AddChatDescription = ({
  setIsChatDescription,
  selectedUsers,
}: AddChatDescriptionProps) => {
  const handleBackClick = () => {
    setIsChatDescription(false);
  };

  return (
    <div id="add-chat-description">
      <DrawOutline orientation="horizontal" position="bottom">
        <header>
          <OptionButton className="back" onClick={handleBackClick}>
            <abbr title="Назад">
              <ArrowLeftIcon />
            </abbr>
          </OptionButton>
          <h2>Создать чат</h2>
        </header>
      </DrawOutline>
      <main>
        {selectedUsers.map((user) => (
          <p>{user.name}</p>
        ))}
      </main>
    </div>
  );
};
