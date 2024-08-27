import './CopyMessage.css';
import { ExclamationCircleIcon } from '@shared/assets';

const CopyMessage = ({ copyMessage }: { copyMessage: string }) => {
  return (
    <>
      {copyMessage && (
        <div className="copy-message">
          <ExclamationCircleIcon />
          <p>{copyMessage}</p>
        </div>
      )}
    </>
  );
};

export default CopyMessage;
