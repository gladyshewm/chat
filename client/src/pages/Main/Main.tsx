import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import './Main.css';
import CustomLoader from '../../components/CustomLoader/CustomLoader';
const Scene = lazy(() => import('../../components/Sphere/Globe'));

const Main = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="main-page"
    >
      <div>MAINMAINMAINMAINMAINMAINMAIN</div>
      {/* <Suspense fallback={<CustomLoader />}>
        <Scene />
      </Suspense> */}
    </motion.div>
  );
};

export default Main;
