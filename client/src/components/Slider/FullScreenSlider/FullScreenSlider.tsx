import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './FullScreenSlider.css';
import { useFullScreen } from '../../../hooks/useFullScreen';
import {
  ANIMATION_DURATION,
  imageTransition,
  imageVariants,
  sliderVariants,
} from '../../../motion';
import DownLoadButton from '../../DownLoadButton/DownLoadButton';
import ChevronLeft from '../../../icons/ChevronLeftIcon';
import XmarkIcon from '../../../icons/XmarkIcon';
import TrashIcon from '../../../icons/TrashIcon';

const FullScreenSlider = () => {
  const [direction, setDirection] = useState(0);
  const {
    isFullScreen,
    currentImage,
    images,
    headerContent,
    closeFullScreen,
    setCurrentImage,
    canDeleteImage,
    deleteImage,
    removeImage,
  } = useFullScreen();

  if (!isFullScreen || !currentImage) return null;

  const handleDeletePhoto = async () => {
    if (canDeleteImage && currentImage) {
      await deleteImage(currentImage.url);
      removeImage(currentImage.url);
    }
  };

  const currentIndex = images.indexOf(currentImage);
  const createdAt = currentImage.createdAt.toString();

  const paginate = (direction: number) => {
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setCurrentImage(images[newIndex]);
    setDirection(direction);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (!images || !images.length) return null;

  return (
    <AnimatePresence custom={direction}>
      <motion.div
        className="full-screen-slider"
        variants={sliderVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="slider-header">
          {headerContent}
          {canDeleteImage && (
            <button className="close-button" onClick={handleDeletePhoto}>
              <TrashIcon />
            </button>
          )}
          <DownLoadButton image={currentImage} />
          <button className="close-button" onClick={closeFullScreen}>
            <XmarkIcon />
          </button>
        </div>
        <motion.div
          className="slider-content"
          variants={sliderVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: ANIMATION_DURATION }}
        >
          <motion.img
            src={currentImage.url}
            alt={`Full screen`}
            key={currentImage.url}
            variants={imageVariants}
            custom={direction}
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
          />
          <button className="prev" onClick={() => paginate(-1)}>
            <ChevronLeft />
          </button>
          <button className="next" onClick={() => paginate(1)}>
            <ChevronLeft />
          </button>
          <div className="slider-info">
            <p>Фото загружено</p>
            <p>{createdAt}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FullScreenSlider;
