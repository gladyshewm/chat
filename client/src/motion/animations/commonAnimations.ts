export const createFadeInVariants = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay } },
  exit: { opacity: 0 },
});
