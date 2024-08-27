import { useState } from 'react';

export const useCopyMessage = () => {
  const [copyMessage, setCopyMessage] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyMessage('Содержимое скопировано!');
        setTimeout(() => setCopyMessage(''), 3000);
      })
      .catch((err) => console.error('Ошибка копирования текста:', err));
  };

  return { copyMessage, handleCopy };
};
