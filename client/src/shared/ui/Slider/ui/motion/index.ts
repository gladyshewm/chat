export const imageTransition = {
  x: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  opacity: { duration: 0.2 },
};

export const imageVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

export const sliderTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  ease: 'linear',
  duration: 0.5,
};

export const sliderVariants = {
  initial: {
    opacity: 0,
    transition: sliderTransition,
  },
  animate: {
    opacity: 1,
    transition: sliderTransition,
  },
  exit: {
    opacity: 0,
    transition: sliderTransition,
  },
};
