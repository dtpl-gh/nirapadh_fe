'use client';
import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

function ProcessNirapadh() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Framework sections data with enhanced colors
  const sections = [
    {
      title: 'IDENTIFY',
      description:
        'Understand threats, their capabilities and their risks to systems, assets and data.',
      color: '#1E40AF', // deeper blue for better contrast
      colorone: '#DBEAFE', // lighter background for inactive state
    },
    {
      title: 'PROTECT',
      description:
        'Ensure that critical systems are safeguarded and kept continuously available.',
      color: '#047857', // emerald green
      colorone: '#D1FAE5',
    },
    {
      title: 'DETECT',
      description: 'Identify the occurrence of an attack.',
      color: '#9333EA', // purple
      colorone: '#F3E8FF',
    },
    {
      title: 'RESPOND',
      description: 'Take action against the detected incident.',
      color: '#B91C1C', // red
      colorone: '#FEE2E2',
    },
    {
      title: 'RECOVER',
      description:
        'Implement plans for resilience and restore affected systems.',
      color: '#C2410C', // amber/orange
      colorone: '#FFEDD5',
    },
  ];

  // Check for mobile screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Auto-rotate through sections
  useEffect(() => {
    if (!isRotating) return;

    const interval = setInterval(() => {
      setActiveSection((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % sections.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isRotating, sections.length]);

  // Handle section click
  const handleSectionClick = (index: number) => {
    setActiveSection(index);
    setIsRotating(false); // Stop auto-rotation when user interacts
  };

  // Reset auto-rotation
  const handleResetRotation = () => {
    setIsRotating(true);
  };

  // Render mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen py-8 px-4 ">
        <div className="mb-8 text-center">
          <div className="inline-block bg-gray-800 p-4 rounded-full mb-3 shadow-lg">
            <Shield className="w-10 h-10 text-white mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Cybersecurity Framework
          </h2>
          <div className="mt-2 text-gray-600 font-medium">GOVERN</div>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          {sections.map((section, index) => {
            const isActive = activeSection === index;

            return (
              <div
                key={index}
                className={`transition-all duration-300 rounded-lg overflow-hidden shadow-md ${isActive ? 'scale-102' : ''}`}
                onClick={() => handleSectionClick(index)}
              >
                <div
                  className={`p-4 text-white font-bold ${isActive ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: section.color }}
                >
                  {section.title}
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">{section.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop layout with improved visuals
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      <div className="relative w-full max-w-2xl aspect-square">
        {/* Animated background patterns */}
        <div className="absolute top-0 left-0 w-full h-full rounded-full opacity-10">
          <div
            className="absolute w-full h-full rounded-full border-4 border-dashed border-gray-700 animate-spin-slow"
            style={{ animationDuration: '40s' }}
          ></div>
          <div
            className="absolute w-3/4 h-3/4 top-1/8 left-1/8 rounded-full border-4 border-dashed border-gray-700 animate-spin-slow"
            style={{
              animationDuration: '30s',
              top: '12.5%',
              left: '12.5%',
              animationDirection: 'reverse',
            }}
          ></div>
        </div>

        {/* Center Circle with "Govern" text now at the TOP of the circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center z-10 shadow-xl">
          {/* Subtle pulsing effect */}
          <div className="absolute w-full h-full rounded-full animate-ping opacity-20"></div>

          {/* "Govern" text positioned at the TOP of the gray circle */}
          <div className="absolute w-full text-center top-4">
            <h2 className="text-xl font-bold tracking-wider text-white">
              GOVERN
            </h2>
          </div>
        </div>

        {/* Inner Circle with Shield */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center z-20 shadow-lg border-4 border-gray-800">
          {/* Shield icon & Cybersecurity Framework text centered */}
          <div className="text-center text-white relative">
            <Shield className="w-10 h-10 mx-auto mb-1 text-white animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
              CYBERSECURITY
            </h3>
            <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
              FRAMEWORK
            </h3>
          </div>
        </div>

        {/* Outer sections with improved positioning and styling */}
        {sections.map((section, index) => {
          const angle =
            (index * (360 / sections.length) - 90) * (Math.PI / 180);
          const isActive = activeSection === index;

          // Calculate position for the section buttons
          const radius = 42; // percentage from center
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);

          // Calculate position for the description - CLOSER to titles
          const descRadius = 58; // reduced from 75% to bring descriptions closer
          const descX = 50 + descRadius * Math.cos(angle);
          const descY = 50 + descRadius * Math.sin(angle);

          return (
            <React.Fragment key={index}>
              {/* Section button with improved styling */}
              <div
                className={`absolute rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer
                            shadow-md hover:shadow-lg transform ${isActive ? 'scale-110' : 'scale-100'}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: isActive ? section.color : section.colorone,
                  zIndex: isActive ? 25 : 15,
                  boxShadow: isActive ? `0 0 15px ${section.color}` : '',
                  width: '120px',
                  height: '40px',
                }}
                onClick={() => handleSectionClick(index)}
              >
                <span
                  className={`font-bold text-sm tracking-wider ${isActive ? 'text-white' : 'text-gray-700'}`}
                >
                  {section.title}
                </span>
                {isActive && (
                  <div
                    className="absolute w-full h-full rounded-full animate-ping"
                    style={{ backgroundColor: section.color, opacity: 0.3 }}
                  ></div>
                )}
              </div>

              {/* Description box with improved styling and animations - now positioned closer to titles */}
              <div
                className={`absolute bg-white p-3 rounded-lg shadow-lg transition-all duration-500
                           ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{
                  left: `${descX}%`,
                  top: `${descY}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isActive ? 30 : 0,
                  borderLeft: `4px solid ${section.color}`,
                  width: '200px',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <p className="text-sm text-gray-700 leading-relaxed">
                  {section.description}
                </p>
              </div>

              {/* Animated connecting line with glow effect - adjusted for closer descriptions */}
              <div
                className={`absolute h-1 origin-left transition-all duration-500
                           ${isActive ? 'opacity-100' : 'opacity-30'}`}
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${radius * 0.85}%`, // Shorter lines since descriptions are closer
                  background: `linear-gradient(90deg, rgba(255,255,255,0.5), ${section.color})`,
                  transform: `rotate(${angle * (180 / Math.PI)}deg)`,
                  zIndex: 5,
                  boxShadow: isActive ? `0 0 8px ${section.color}` : 'none',
                }}
              ></div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProcessNirapadh;
