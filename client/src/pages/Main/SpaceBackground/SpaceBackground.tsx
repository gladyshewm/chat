import React from 'react';
import './SpaceBackground.css';
import { motion } from 'framer-motion';

const SpaceBackground = () => {
  return (
    <div className="space-background">
      {[...Array(50)].map((_, index) => (
        <motion.div
          key={index}
          className="star"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
      <motion.div
        className="planet"
        animate={{
          y: [0, -20, 0],
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </div>
  );
};

export default SpaceBackground;
