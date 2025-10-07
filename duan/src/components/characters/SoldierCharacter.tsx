import React from "react";

interface SoldierCharacterProps {
  x?: number;
  y?: number;
  scale?: number;
  action?: "standing" | "fighting" | "celebrating";
  className?: string;
}

export const SoldierCharacter: React.FC<SoldierCharacterProps> = ({
  x = 0,
  y = 0,
  scale = 1,
  action = "standing",
  className = "",
}) => {
  const armAngle =
    action === "fighting" ? -45 : action === "celebrating" ? -90 : 0;

  return (
    <g
      className={`soldier-character ${className}`}
      transform={`translate(${x}, ${y}) scale(${scale})`}
    >
      {/* Body - Military uniform */}
      <rect x="-8" y="10" width="16" height="25" fill="#4a5a3a" rx="2" />

      {/* Belt */}
      <rect x="-8" y="22" width="16" height="3" fill="#654321" />

      {/* Legs - Pants */}
      <rect x="-7" y="35" width="6" height="18" fill="#4a5a3a" rx="1" />
      <rect x="1" y="35" width="6" height="18" fill="#4a5a3a" rx="1" />

      {/* Boots */}
      <rect x="-8" y="50" width="7" height="6" fill="#2d2d2d" rx="1" />
      <rect x="1" y="50" width="7" height="6" fill="#2d2d2d" rx="1" />

      {/* Neck */}
      <rect x="-3" y="6" width="6" height="5" fill="#d4a574" />

      {/* Head */}
      <circle cx="0" cy="0" r="8" fill="#d4a574" />

      {/* Helmet */}
      <path
        d="M -8 -2 Q -9 -8 0 -10 Q 9 -8 8 -2 Z"
        fill="#4a5a3a"
        stroke="#3a4a2a"
        strokeWidth="1"
      />
      {/* Helmet strap */}
      <path
        d="M -7 2 Q 0 4 7 2"
        stroke="#654321"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Face */}
      <ellipse cx="-2.5" cy="0" rx="1" ry="1.5" fill="#2d2d2d" />
      <ellipse cx="2.5" cy="0" rx="1" ry="1.5" fill="#2d2d2d" />
      <line x1="0" y1="1" x2="0" y2="3" stroke="#b08050" strokeWidth="1" />
      <path
        d="M -2 5 Q 0 6 2 5"
        stroke="#8b4513"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left Arm */}
      <g transform={`rotate(${action === "standing" ? 15 : 25} -8 12)`}>
        <rect x="-10" y="10" width="4" height="18" fill="#4a5a3a" rx="1" />
        <circle cx="-8" cy="28" r="3" fill="#d4a574" />
      </g>

      {/* Right Arm - holding rifle or raised */}
      <g transform={`rotate(${armAngle} 8 12)`}>
        <rect x="6" y="10" width="4" height="18" fill="#4a5a3a" rx="1" />
        <circle cx="8" cy="28" r="3" fill="#d4a574" />

        {/* Rifle */}
        {(action === "fighting" || action === "standing") && (
          <g>
            <rect x="6" y="12" width="2" height="25" fill="#2d2d2d" rx="0.5" />
            <rect x="5" y="10" width="4" height="3" fill="#4a4a4a" />
            <rect x="4" y="34" width="6" height="2" fill="#654321" />
          </g>
        )}
      </g>

      {/* Red star on helmet */}
      <path
        d="M 0 -7 L 1 -4 L 4 -4 L 2 -2 L 3 1 L 0 -1 L -3 1 L -2 -2 L -4 -4 L -1 -4 Z"
        fill="#dc2626"
        stroke="#fbbf24"
        strokeWidth="0.5"
      />
    </g>
  );
};

export default SoldierCharacter;
