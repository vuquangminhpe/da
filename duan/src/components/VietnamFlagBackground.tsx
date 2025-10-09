import React from 'react';

interface VietnamFlagBackgroundProps {
  className?: string;
}

export const VietnamFlagBackground: React.FC<VietnamFlagBackgroundProps> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Main Vietnam Flag - Clear and Prominent */}
      <div className="absolute inset-0" style={{ background: 'var(--vietnam-red)' }}>
        {/* Central star - large and clear */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="w-96 h-96 opacity-20" 
            viewBox="0 0 200 200"
          >
            <polygon
              points="100,20 129.4,69.1 185.1,69.1 138.2,103.6 161.8,160.5 100,125.5 38.2,160.5 61.8,103.6 14.9,69.1 70.6,69.1"
              fill="var(--vietnam-yellow)"
              className="animate-pulse"
              style={{
                animation: 'pulse 4s ease-in-out infinite'
              }}
            />
          </svg>
        </div>

        {/* Secondary decorative stars */}
        <div className="absolute top-20 left-20">
          <svg className="w-12 h-12 opacity-15" viewBox="0 0 50 50">
            <polygon
              points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
              fill="var(--vietnam-yellow)"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </svg>
        </div>

        <div className="absolute top-32 right-32">
          <svg className="w-8 h-8 opacity-10" viewBox="0 0 50 50">
            <polygon
              points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
              fill="var(--vietnam-yellow)"
              className="animate-pulse"
              style={{ animationDelay: '2s' }}
            />
          </svg>
        </div>

        <div className="absolute bottom-24 left-32">
          <svg className="w-10 h-10 opacity-12" viewBox="0 0 50 50">
            <polygon
              points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
              fill="var(--vietnam-yellow)"
              className="animate-pulse"
              style={{ animationDelay: '3s' }}
            />
          </svg>
        </div>

        <div className="absolute bottom-40 right-20">
          <svg className="w-6 h-6 opacity-8" viewBox="0 0 50 50">
            <polygon
              points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
              fill="var(--vietnam-yellow)"
              className="animate-pulse"
              style={{ animationDelay: '4s' }}
            />
          </svg>
        </div>

        {/* Floating light particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
            }}
          >
            <div
              className="w-1 h-1 rounded-full opacity-30"
              style={{ backgroundColor: 'var(--vietnam-yellow)' }}
            />
          </div>
        ))}

        {/* Subtle flag wave effect overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              var(--vietnam-yellow) 2px,
              var(--vietnam-yellow) 4px
            )`
          }}
        />
      </div>

      {/* Gradient overlays for depth and readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
    </div>
  );
};

export default VietnamFlagBackground;