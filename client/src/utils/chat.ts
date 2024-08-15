export const getParticipants = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} участников`;
  } else if (lastDigit === 1) {
    return `${count} участник`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} участника`;
  } else {
    return `${count} участников`;
  }
};
