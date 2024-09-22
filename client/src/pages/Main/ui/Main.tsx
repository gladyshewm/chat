import { AnimatePresence, motion } from 'framer-motion';
import './Main.css';
import { SpaceBackground } from '@shared/ui';

const Main = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="main-page"
        id="main-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SpaceBackground />
      </motion.div>
    </AnimatePresence>
  );
};

export default Main;
