import { useState } from 'react';
import './FilePicker.css';
import { PaperClipIcon } from '@shared/assets';
import ModalFilePreview from './ModalFilePreview';
import { ApolloError } from '@apollo/client';

interface FilePrickerProps {
  sendMessage: (message: string | null, attachedFiles: File[]) => Promise<void>;
  sendMessageLoading: boolean;
  sendMessageError: ApolloError | undefined;
}

const FilePicker = ({
  sendMessage,
  sendMessageLoading,
  sendMessageError,
}: FilePrickerProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDivClick = () => {
    const fileInput = document.getElementById(
      'message-file',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="files-clip-container" onClick={handleDivClick}>
        <abbr title="Прикрепить файл">
          <input
            type="file"
            name="message-file"
            id="message-file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <PaperClipIcon />
        </abbr>
      </div>
      {file && (
        <ModalFilePreview
          file={file}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          sendMessage={sendMessage}
          sendMessageLoading={sendMessageLoading}
          sendMessageError={sendMessageError}
        />
      )}
    </>
  );
};

export default FilePicker;
