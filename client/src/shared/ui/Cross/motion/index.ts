export const crossLineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeInOut', delay: 0.5 },
  },
};

export const circleVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { duration: 0.5, ease: 'easeInOut', delay: 1 },
  },
};
