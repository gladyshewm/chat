import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { wrap } from 'popmotion';
import './Slider.css';
import { imageTransition, imageVariants } from './motion';
import { ChevronLeftIcon } from '@shared/assets';

interface SliderProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const Slider = ({ images, onImageClick }: SliderProps) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="slider">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          className="slider__img"
          key={page}
          src={images[imageIndex]}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={imageTransition}
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
        <ChevronLeftIcon />
      </motion.button>
      <motion.button className="next" onClick={() => paginate(1)}>
        <ChevronLeftIcon />
      </motion.button>
    </div>
  );
};

export default Slider;
