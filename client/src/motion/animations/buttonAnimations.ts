import { FAST_ANIMATION_DURATION } from '../constants';

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

export const backButtonVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: FAST_ANIMATION_DURATION },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    rotate: -180,
    transition: { duration: FAST_ANIMATION_DURATION },
  },
};

export const scrollButtonVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotate: -180,
    transition: { duration: FAST_ANIMATION_DURATION },
  },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: FAST_ANIMATION_DURATION },
  },
  exit: {
    opacity: 0,
    y: 50,
    rotate: -180,
    transition: { duration: FAST_ANIMATION_DURATION },
  },
};
