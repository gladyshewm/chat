import { motion } from 'framer-motion';
import { ComponentProps, ReactNode } from 'react';
import { TWEEN_TRANSITION } from '@shared/constants/motion';
import { sidebarMotionSlideVariants } from '../motion';

interface SidebarMotionSlideProps extends ComponentProps<typeof motion.div> {
  children: ReactNode;
}

const SidebarMotionSlide = ({
  children,
  ...props
}: SidebarMotionSlideProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={sidebarMotionSlideVariants}
      transition={TWEEN_TRANSITION}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SidebarMotionSlide;
