import {
  FAST_ANIMATION_DURATION,
  MID_ANIMATION_DURATION,
  SPRING_TRANSITION,
} from '@shared/constants/motion';

export const profileInfoVariants = {
  hidden: { scale: 0.95, opacity: 0.8 },
  visible: { scale: 1, opacity: 1 },
};

export const editProfileVariants = {
  hidden: { x: '10%' },
  visible: { x: 0 },
};

export const logoutButtonTransition = {
  type: 'spring',
  duration: FAST_ANIMATION_DURATION,
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

export const successMessageVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SPRING_TRANSITION,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.8,
    transition: SPRING_TRANSITION,
  },
  hover: {
    scale: 1.03,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
    cursor: 'pointer',
  },
  tap: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: MID_ANIMATION_DURATION,
    },
  },
};

export const errorMessageVariants = {
  initial: { x: 0 },
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: MID_ANIMATION_DURATION },
  },
  hover: {
    scale: 1.03,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
    cursor: 'pointer',
  },
  tap: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: MID_ANIMATION_DURATION,
    },
  },
};
