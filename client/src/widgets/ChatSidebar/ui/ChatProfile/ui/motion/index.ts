export const chatProfileVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      staggerChildren: 0.1,
    },
  },
};

export const deleteChatButtonTransition = {
  type: 'spring',
  duration: 0.3,
  ease: 'linear',
};


export const deleteChatButtonVariants = {
  initial: {
    opacity: 0,
    y: -10,
    transition: deleteChatButtonTransition,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: deleteChatButtonTransition,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: deleteChatButtonTransition,
  },
};