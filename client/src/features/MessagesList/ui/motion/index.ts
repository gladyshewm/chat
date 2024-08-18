import { FAST_ANIMATION_DURATION } from '@shared/constants/motion';

export const avatarVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: 180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: FAST_ANIMATION_DURATION },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    rotate: 180,
    transition: { duration: FAST_ANIMATION_DURATION },
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

export const searchInputVariants = {
  hidden: { width: '70%' },
  visible: { width: '80%', transition: { duration: FAST_ANIMATION_DURATION } },
};
