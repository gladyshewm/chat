import { ComponentProps, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TWEEN_TRANSITION } from '@shared/constants/motion';
import { sidebarMotionScaleVariants } from '../motion';

interface SidebarMotionScaleProps extends ComponentProps<typeof motion.div> {
  children: ReactNode;
}

const SidebarMotionScale = ({
  children,
  ...props
}: SidebarMotionScaleProps) => {
  return (
    <motion.div
      variants={sidebarMotionScaleVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={TWEEN_TRANSITION}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SidebarMotionScale;
