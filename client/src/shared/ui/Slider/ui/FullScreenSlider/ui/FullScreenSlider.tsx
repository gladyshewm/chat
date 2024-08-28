import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import './FullScreenSlider.css';
import { ru } from 'date-fns/locale';
import { imageTransition, imageVariants, sliderVariants } from '../../motion';
import { DownLoadButton, Loader } from '@shared/ui';
import { MID_ANIMATION_DURATION } from '@shared/constants/motion';
import { ChevronLeftIcon, TrashIcon, XmarkIcon } from '@shared/assets';
import { AvatarInfo } from '@shared/types';
import { createPortal } from 'react-dom';
import { useState } from 'react';

interface FullScreenSliderProps {
  isOpen: boolean;
  currentImage: AvatarInfo | null;
  images: AvatarInfo[];
  headerContent: React.ReactNode;
  onClose: () => void;
  onDelete?: (url: string) => void;
  onNavigate: (direction: number) => void;
  isLoading?: boolean;
}

export const FullScreenSlider = ({
  isOpen,
  currentImage,
  images,
  headerContent,
  onClose,
  onDelete,
  onNavigate,
  isLoading,
}: FullScreenSliderProps) => {
  const [direction, setDirection] = useState(0);

  if (!isOpen || !currentImage || !images || !images.length) return null;

  // const currentIndex = images.indexOf(currentImage);
  const createdAt = currentImage.createdAt.toString();

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (direction: number) => {
    onNavigate(direction);
    setDirection(direction);
  };

  return createPortal(
    <AnimatePresence custom={direction}>
      {isLoading && <Loader />}
      <motion.div
        className="full-screen-slider"
        key={currentImage.url}
        variants={sliderVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="slider-header">
          {headerContent}
          <div className="slider-header__buttons">
            {onDelete && (
              <button
                className="close-button"
                onClick={() => onDelete(currentImage.url)}
              >
                <abbr title="Удалить">
                  <TrashIcon />
                </abbr>
              </button>
            )}
            <DownLoadButton image={currentImage} />
            <button className="close-button" onClick={onClose}>
              <abbr title="Закрыть">
                <XmarkIcon />
              </abbr>
            </button>
          </div>
        </div>
        <motion.div
          className="slider-content"
          variants={sliderVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: MID_ANIMATION_DURATION }}
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
            <ChevronLeftIcon />
          </button>
          <button className="next" onClick={() => paginate(1)}>
            <ChevronLeftIcon />
          </button>
          <div className="slider-info">
            <p>Фото загружено</p>
            <p>
              {String(
                format(new Date(Number(createdAt)), 'Pp', {
                  locale: ru,
                }),
              )}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.getElementById('modal')!,
  );
};
