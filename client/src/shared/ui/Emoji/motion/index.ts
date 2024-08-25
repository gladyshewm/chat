export const emojiTransition = {
  duration: 0.2,
  type: 'spring',
  stiffness: 500,
  damping: 25,
};

export const emojiVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};
