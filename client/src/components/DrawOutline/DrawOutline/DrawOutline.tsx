import React, { FC, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './DrawOutline.css';
import { createDrawVariants } from '../../../motion';

interface DrawOutlineRectProps {
  children: React.ReactNode;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  orientation?: 'vertical' | 'horizontal';
  position?: 'left' | 'right' | 'bottom' | 'top';
}

const DrawOutline: FC<DrawOutlineRectProps> = ({
  children,
  className,
  stroke = '#999999',
  strokeWidth = 2,
  orientation = 'vertical',
  position = 'right',
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const drawVariants = createDrawVariants();

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

  const getLineCoordinates = () => {
    if (orientation === 'vertical') {
      return {
        x1: strokeWidth / 2,
        y1: 0,
        x2: strokeWidth / 2,
        y2: dimensions.height,
      };
    } else {
      return {
        x1: 0,
        y1: strokeWidth / 2,
        x2: dimensions.width,
        y2: strokeWidth / 2,
      };
    }
  };

  const getSvgDimensions = () => {
    return orientation === 'vertical'
      ? { width: strokeWidth, height: dimensions.height }
      : { width: dimensions.width, height: strokeWidth };
  };

  const getSvgPosition = () => {
    switch (position) {
      case 'left':
        return { left: 0, top: 0 };
      case 'right':
        return { right: 0, top: 0 };
      case 'top':
        return { left: 0, top: 0 };
      case 'bottom':
        return { left: 0, bottom: 0 };
      default:
        return { right: 0, top: 0 };
    }
  };

  const lineCoordinates = getLineCoordinates();
  const svgDimensions = getSvgDimensions();
  const svgPosition = getSvgPosition();

  return (
    <div ref={wrapperRef} className={`draw-outline-wrapper ${className || ''}`}>
      {children}
      <AnimatePresence>
        {isVisible && dimensions.width > 0 && dimensions.height > 0 && (
          <motion.svg
            className="draw-outline-svg"
            initial="hidden"
            animate="visible"
            exit="hidden"
            width={svgDimensions.width}
            height={svgDimensions.height}
            style={{
              ...svgPosition,
            }}
          >
            <motion.line
              {...lineCoordinates}
              variants={drawVariants}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrawOutline;
