import React, { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { wrap } from 'popmotion';
import './Slider.css';
import ChevronLeft from '../../icons/ChevronLeftIcon';

interface SliderProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const Slider: FC<SliderProps> = ({ images, onImageClick }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  return (
    <div className="slider">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          className="slider__img"
          key={page}
          src={images[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          onClick={() => onImageClick(imageIndex)}
        />
      </AnimatePresence>
      <motion.button className="prev" onClick={() => paginate(-1)}>
        <ChevronLeft />
      </motion.button>
      <motion.button className="next" onClick={() => paginate(1)}>
        <ChevronLeft />
      </motion.button>
    </div>
  );
};

export default Slider;
