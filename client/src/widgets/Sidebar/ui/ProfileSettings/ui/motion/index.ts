export const profileInfoVariants = {
  hidden: { scale: 0.95, opacity: 0.8 },
  visible: { scale: 1, opacity: 1 },
};

export const editProfileVariants = {
  hidden: { x: '10%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export const logoutButtonTransition = {
  type: 'spring',
  duration: 0.3,
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
