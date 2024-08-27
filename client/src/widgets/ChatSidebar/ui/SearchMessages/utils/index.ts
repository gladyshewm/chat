export const formatMessages = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} сообщений`;
  } else if (lastDigit === 1) {
    return `${count} сообщение`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} сообщения`;
  } else {
    return `${count} сообщений`;
  }
};
