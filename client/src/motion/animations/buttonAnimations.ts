export const logoutButtonTransition = {
  type: 'spring',
  duration: 0.2,
  ease: 'linear',
};

export const logoutButtonVariants = {
  initial: {
    opacity: 0,
    y: -10,
    transition: logoutButtonTransition,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: logoutButtonTransition,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: logoutButtonTransition,
  },
};
