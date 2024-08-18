import './SearchIllustration.css';
import { AnimatePresence, motion } from 'framer-motion';

const SearchIllustration = () => {
  return (
    <AnimatePresence>
      <div className="search-illustration">
        <motion.div
          className="magnifier"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <motion.div className="magnifier-handle" />
          <motion.div className="magnifier-glass" />
        </motion.div>
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="particle"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </AnimatePresence>
  );
};

export default SearchIllustration;
