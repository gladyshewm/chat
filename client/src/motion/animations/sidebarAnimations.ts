import { FAST_ANIMATION_DURATION } from '../constants';

export const messagesListVariants = {
  hidden: { scale: 0.95, opacity: 0.8 },
  visible: { scale: 1, opacity: 1 },
};

export const profileSettingsVariants = {
  hidden: { x: '10%' },
  visible: { x: 0 },
};

export const profileInfoVariants = {
  hidden: { scale: 0.95, opacity: 0.8 },
  visible: { scale: 1, opacity: 1 },
};

export const editProfileVariants = {
  hidden: { x: '10%' },
  visible: { x: 0 },
};

export const searchInputVariants = {
  hidden: { width: '70%' },
  visible: { width: '80%', transition: { duration: FAST_ANIMATION_DURATION } },
};
