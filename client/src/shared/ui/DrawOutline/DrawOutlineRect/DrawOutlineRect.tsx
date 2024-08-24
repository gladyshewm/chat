import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './DrawOutlineRect.css';
import { createDrawVariants } from '../motion';

interface DrawOutlineRectProps {
  children: React.ReactNode;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  rx?: number | string;
  key?: string | number;
  showOnHover?: boolean;
  isActive?: boolean;
}

export const DrawOutlineRect = ({
  children,
  className,
  stroke = 'var(--outline-main-color)',
  strokeWidth = 2,
  rx = 0,
  showOnHover = false,
  isActive = false,
}: DrawOutlineRectProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const drawVariants = createDrawVariants();

  const shouldShowOutline =
    !showOnHover || (showOnHover && isHovered) || isActive;

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
      className={`draw-outline-rect-wrapper ${className || ''} ${isActive ? 'active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible &&
          dimensions.width > 0 &&
          dimensions.height > 0 &&
          shouldShowOutline && (
            <motion.svg
              className={`draw-outline-rect-svg ${isActive ? 'active' : ''}`}
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
              />
            </motion.svg>
          )}
      </AnimatePresence>
    </div>
  );
};
