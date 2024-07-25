import { FAST_ANIMATION_DURATION } from '../constants';

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
