import React from "react";

interface VietnamFlagProps {
  x?: number;
  y?: number;
  scale?: number;
  waving?: boolean;
  className?: string;
}

export const VietnamFlag: React.FC<VietnamFlagProps> = ({
  x = 0,
  y = 0,
  scale = 1,
  waving = false,
  className = "",
}) => {
  return (
    <g
      className={`vietnam-flag ${className}`}
      transform={`translate(${x}, ${y}) scale(${scale})`}
    >
      {/* Flag pole */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2="60"
        stroke="#8b4513"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="0" cy="0" r="3" fill="#fbbf24" />

      {/* Flag - Red background */}
      {waving ? (
        <path
          d="M 5 5 Q 45 0 50 5 Q 45 10 50 15 Q 45 20 50 25 Q 45 30 50 35 Q 45 38 40 40 L 5 40 Z"
          fill="#dc2626"
          stroke="#b91c1c"
          strokeWidth="1"
        >
          <animate
            attributeName="d"
            values="M 5 5 Q 45 0 50 5 Q 45 10 50 15 Q 45 20 50 25 Q 45 30 50 35 Q 45 38 40 40 L 5 40 Z;
                    M 5 5 Q 45 8 50 5 Q 45 2 50 15 Q 45 18 50 25 Q 45 22 50 35 Q 45 38 40 40 L 5 40 Z;
                    M 5 5 Q 45 0 50 5 Q 45 10 50 15 Q 45 20 50 25 Q 45 30 50 35 Q 45 38 40 40 L 5 40 Z"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      ) : (
        <rect
          x="5"
          y="5"
          width="40"
          height="35"
          fill="#dc2626"
          stroke="#b91c1c"
          strokeWidth="1"
        />
      )}

      {/* Golden star */}
      <g transform="translate(25, 22.5)">
        <path
          d="M 0 -8 L 2.5 -2.5 L 8.5 -2.5 L 3.5 1.5 L 5.5 7.5 L 0 3.5 L -5.5 7.5 L -3.5 1.5 L -8.5 -2.5 L -2.5 -2.5 Z"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="0.5"
        />
      </g>
    </g>
  );
};

export default VietnamFlag;
