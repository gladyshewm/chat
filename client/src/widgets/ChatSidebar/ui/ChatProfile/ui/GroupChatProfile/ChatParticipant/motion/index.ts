export const actionButtonTransition = {
  type: 'spring',
  duration: 0.3,
  ease: 'linear',
};

export const actionButtonVariants = {
  initial: {
    opacity: 0,
    y: 10,
    transition: actionButtonTransition,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: actionButtonTransition,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: actionButtonTransition,
  },
};
