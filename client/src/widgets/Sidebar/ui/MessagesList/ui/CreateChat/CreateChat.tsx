import { useRef } from 'react';
import './CreateChat.css';
import { DrawOutline, OptionButton, SearchInput } from '@shared/ui';
import { ArrowLeftIcon } from '@shared/assets';

interface CreateChatProps {
  setIsCreateChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateChat = ({ setIsCreateChat }: CreateChatProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBackClick = () => {
    setIsCreateChat(false);
  };

  return (
    <div id="create-chat">
      <DrawOutline orientation="horizontal" position="bottom">
        <header>
          <div className="title">
            <OptionButton className="back" onClick={handleBackClick}>
              <abbr title="Назад">
                <ArrowLeftIcon />
              </abbr>
            </OptionButton>
            <h2>Добавить участников</h2>
          </div>
          <SearchInput
            ref={inputRef}
            className="search-input"
            placeholder="Кого бы Вы хотели добавить?"
          />
        </header>
      </DrawOutline>
      <main>asdasd</main>
    </div>
  );
};

export default CreateChat;
