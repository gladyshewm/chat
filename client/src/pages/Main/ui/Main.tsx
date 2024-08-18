import { motion } from 'framer-motion';
import './Main.css';
import { SpaceBackground } from '@shared/ui';

const Main = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="main-page"
    >
      <SpaceBackground />
    </motion.div>
  );
};

export default Main;
