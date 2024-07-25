import { Transition, Variants } from 'framer-motion';

export const containerVariants: Variants = {
  start: {
    rotate: 0,
  },
  end: {
    rotate: 360,
  },
};

export const containerTransition: Transition = {
  duration: 2,
  repeat: Infinity,
  ease: 'linear',
};

export const circleVariants: Variants = {
  start: {
    scale: 0,
    opacity: 0.2,
  },
  end: {
    scale: 1,
    opacity: 1,
  },
};

export const circleTransition: Transition = {
  duration: 0.75,
  repeat: Infinity,
  repeatType: 'reverse',
};
