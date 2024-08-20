import { FAST_ANIMATION_DURATION } from '@shared/constants/motion';

export const scrollButtonVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotate: -180,
    transition: { duration: FAST_ANIMATION_DURATION },
  },
  animate: {
    opacity: 0.8,
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
