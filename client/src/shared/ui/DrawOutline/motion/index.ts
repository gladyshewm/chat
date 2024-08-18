import { Variants } from 'framer-motion';

export const createDrawVariants = (): Variants => {
  const delay = Math.random() * 0.5;
  return {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay,
          type: 'spring',
          duration: 1.5,
          bounce: 0,
        },
        opacity: { duration: 0.01 },
      },
    },
  };
};
