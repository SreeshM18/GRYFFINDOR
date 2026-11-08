import React, { useState, useRef, useCallback } from 'react';

interface PerspectiveCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glareOpacity?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({
  children,
  className = '',
  intensity = 15,
  glareOpacity = 0.2,
  onClick,
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setCoords({ rotateX, rotateY, glareX, glareY, active: true });
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setCoords({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      <div
        style={{
          transform: `rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) ${
            coords.active ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
          }`,
          transformStyle: 'preserve-3d',
          transition: coords.active ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        className="w-full h-full rounded-2xl relative overflow-hidden"
      >
        {/* Children in 3D Space */}
        <div className="relative z-10 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </div>

        {/* Dynamic Specular Glare Layer */}
        {coords.active && (
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at ${coords.glareX}% ${coords.glareY}%, rgba(255, 215, 0, ${glareOpacity}), transparent 60%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

