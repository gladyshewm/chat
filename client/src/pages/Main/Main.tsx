import React, { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Main.css';
import SpaceBackground from './SpaceBackground/SpaceBackground';
/* const Scene = lazy(() => import('../../components/Sphere/Globe')); */

const Main = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="main-page"
    >
      <SpaceBackground />
      <div className="main-content">asdsa</div>
      {/* <Suspense fallback={<CustomLoader />}>
        <Scene />
      </Suspense> */}
    </motion.div>
  );
};

export default Main;
