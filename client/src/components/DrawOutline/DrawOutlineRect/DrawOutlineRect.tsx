import React, { FC, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './DrawOutlineRect.css';

interface DrawOutlineRectProps {
  children: React.ReactNode;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  rx?: number | string;
  /* delay?: number; */
  key?: string | number;
}

const DrawOutlineRect: FC<DrawOutlineRectProps> = ({
  children,
  className,
  stroke = '#999999',
  strokeWidth = 2,
  rx = 0,
  /* delay = 0, */
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const delay = Math.random() * 0.5;
  const drawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: 'spring', duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    },
  };

  useEffect(() => {
    if (!wrapperRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
        setIsVisible(true);
      }
    });

    resizeObserver.observe(wrapperRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`draw-outline-rect-wrapper ${className || ''}`}
    >
      {children}
      <AnimatePresence>
        {isVisible && dimensions.width > 0 && dimensions.height > 0 && (
          <motion.svg
            className="draw-outline-rect-svg"
            initial="hidden"
            animate="visible"
            exit="hidden"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          >
            <motion.rect
              className="draw-outline-rect-rect"
              x={strokeWidth / 2}
              y={strokeWidth / 2}
              width={dimensions.width - strokeWidth}
              height={dimensions.height - strokeWidth}
              variants={drawVariants}
              stroke={stroke}
              strokeWidth={strokeWidth}
              rx={rx}
              fill="none"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrawOutlineRect;
