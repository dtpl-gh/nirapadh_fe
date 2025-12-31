'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Framework() {
  const [isVisible, setIsVisible] = useState(true); // Start as visible
  // Preload and optimize animations
  useEffect(() => {
    // Force immediate render and prevent layout shifts
    const timer = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Optimized animation variants with reduced complexity for better performance
  const arrowVariants = {
    initial: { pathLength: 0, pathOffset: 0 },
    animate: {
      pathLength: [0, 1, 0],
      pathOffset: [0, 1, 2],
      transition: {
        duration: 4, // Slightly faster
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
        repeatType: 'loop' as const,
      },
    },
  };

  const BoxItem = ({
    label,
    x,
    y,
    color = '#2596be',
  }: {
    label: string;
    x: number;
    y: number;
    color?: string;
  }) => {
    return (
      <g>
        <rect
          x={x - 50}
          y={y - 30}
          width="100"
          height="60"
          rx="10"
          fill={color}
          filter="url(#shadow)"
          stroke="#ffffff"
          strokeWidth="1"
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="white"
          fontFamily="system-ui, sans-serif"
          fontSize="16"
          fontWeight="500"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div
      className="w-full max-w-xl mx-auto px-4 py-6 overflow-hidden"
      style={{
        minHeight: '500px', // Prevent layout shift
        willChange: 'transform', // Optimize for animations
        contain: 'layout style paint', // CSS containment for better performance
      }}
    >
      <svg
        viewBox="-50 0 600 500"
        className="w-full h-auto mx-auto"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: 'translateZ(0)', // Force hardware acceleration
          backfaceVisibility: 'hidden', // Reduce flickering
        }}
      >
        {/* Filters for shadow effects */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
          </filter>
          <linearGradient
            id="centerGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#2596be" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1a6b87" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2596be" />
            <stop offset="100%" stopColor="#1a6b87" />
          </linearGradient>
        </defs>

        {/* Background circle with optimized pulsing animation */}
        <motion.circle
          cx="250"
          cy="250"
          r="60"
          fill="url(#centerGradient)"
          opacity="0.15"
          initial={{ scale: 1, opacity: 0.15 }}
          animate={{
            scale: [1, 1.05, 1], // Reduced scale change
            opacity: [0.15, 0.2, 0.15], // Reduced opacity change
          }}
          transition={{
            duration: 2.5, // Faster animation
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            repeatType: 'loop',
          }}
        />

        {/* Central circle */}
        <circle
          cx="250"
          cy="250"
          r="40"
          fill="url(#centerGradient)"
          filter="url(#shadow)"
        />
        <text
          x="250"
          y="255"
          textAnchor="middle"
          fill="white"
          fontFamily="system-ui, sans-serif"
          fontSize="16"
          fontWeight="600"
        >
          Process
        </text>

        {/* Optimized Curved Arrows with better performance */}
        {[0, 90, 180, 270].map((rotation, index) => (
          <g key={`arrow-${index}`} transform={`rotate(${rotation} 250 250)`}>
            <motion.path
              d="M 250 100 A 150 150 0 0 1 400 250"
              fill="transparent"
              stroke="url(#arrowGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              variants={arrowVariants}
              initial="initial"
              animate="animate"
              style={{
                transformOrigin: '250px 250px',
                willChange: 'transform',
              }}
            />
            <motion.polygon
              points="0,-5 10,0 0,5"
              fill="#2596be"
              style={{ transformOrigin: 'center' }}
            >
              <animateMotion
                dur="4s" // Faster animation
                repeatCount="indefinite"
                rotate="auto"
                path="M 250 100 A 150 150 0 0 1 400 250"
                begin={`${index * 0.5}s`} // Stagger start times
              />
            </motion.polygon>
          </g>
        ))}

        {/* Boxes with gradient colors */}
        {[
          { label: 'Assessment', x: 250, y: 100, color: '#2596be' },
          { label: 'Alignment', x: 400, y: 250, color: '#1e88e5' },
          { label: 'Implement', x: 250, y: 400, color: '#1976d2' },
          { label: 'Management', x: 100, y: 250, color: '#0d47a1' },
        ].map((box, index) => (
          <BoxItem
            key={index}
            label={box.label}
            x={box.x}
            y={box.y}
            color={box.color}
          />
        ))}

        {/* Labels with improved styling */}
        <g className="diagram-labels">
          <text
            x="200"
            y="40"
            textAnchor="start"
            fill="#0d47a1"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
            fontSize="16"
          >
            Assessment
          </text>

          <text
            x="-20"
            y="255"
            textAnchor="start"
            fill="#0d47a1"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
            fontSize="16"
          >
            Operate
          </text>

          <text
            x="530"
            y="255"
            textAnchor="end"
            fill="#0d47a1"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
            fontSize="16"
          >
            Optimize
          </text>

          <text
            x="250"
            y="470"
            textAnchor="middle"
            fill="#0d47a1"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
            fontSize="16"
          >
            Secure
          </text>
        </g>
      </svg>
    </div>
  );
}
