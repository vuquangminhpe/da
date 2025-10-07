import React from "react";

interface BoatCharacterProps {
  x?: number;
  y?: number;
  scale?: number;
  className?: string;
}

export const BoatCharacter: React.FC<BoatCharacterProps> = ({
  x = 0,
  y = 0,
  scale = 1,
  className = "",
}) => {
  return (
    <g
      className={`boat-character ${className}`}
      transform={`translate(${x}, ${y}) scale(${scale})`}
    >
      {/* Boat body */}
      <path
        d="M -30 10 L -35 20 L 35 20 L 30 10 Z"
        fill="#8b4513"
        stroke="#5d2e0f"
        strokeWidth="2"
      />

      {/* Boat deck */}
      <rect x="-30" y="8" width="60" height="4" fill="#a0522d" rx="1" />

      {/* Cabin structure */}
      <rect
        x="-15"
        y="-5"
        width="30"
        height="15"
        fill="#d2691e"
        stroke="#8b4513"
        strokeWidth="1.5"
      />

      {/* Windows */}
      <rect
        x="-10"
        y="0"
        width="6"
        height="5"
        fill="#87ceeb"
        stroke="#5d2e0f"
        strokeWidth="1"
      />
      <rect
        x="4"
        y="0"
        width="6"
        height="5"
        fill="#87ceeb"
        stroke="#5d2e0f"
        strokeWidth="1"
      />

      {/* Roof */}
      <path
        d="M -18 -5 L 0 -12 L 18 -5 Z"
        fill="#a0522d"
        stroke="#5d2e0f"
        strokeWidth="1.5"
      />

      {/* Chimney */}
      <rect
        x="12"
        y="-18"
        width="6"
        height="8"
        fill="#4a4a4a"
        stroke="#2d2d2d"
        strokeWidth="1"
      />
      <rect x="10" y="-19" width="10" height="3" fill="#2d2d2d" rx="1" />

      {/* Smoke particles */}
      <g className="smoke" opacity="0.6">
        <circle cx="15" cy="-22" r="2" fill="#9ca3af" className="smoke-1">
          <animate
            attributeName="cy"
            from="-22"
            to="-35"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.6"
            to="0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="17" cy="-25" r="2.5" fill="#9ca3af" className="smoke-2">
          <animate
            attributeName="cy"
            from="-25"
            to="-38"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.6"
            to="0"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="13" cy="-28" r="2" fill="#9ca3af" className="smoke-3">
          <animate
            attributeName="cy"
            from="-28"
            to="-40"
            dur="2.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.6"
            to="0"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Mast */}
      <line
        x1="-20"
        y1="-5"
        x2="-20"
        y2="-30"
        stroke="#8b4513"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Sail */}
      <path
        d="M -20 -28 L -5 -20 L -20 -12 Z"
        fill="#f5f5dc"
        stroke="#8b4513"
        strokeWidth="1"
        opacity="0.9"
      />

      {/* Railing */}
      <line x1="-28" y1="8" x2="-28" y2="5" stroke="#8b4513" strokeWidth="1" />
      <line x1="-20" y1="8" x2="-20" y2="5" stroke="#8b4513" strokeWidth="1" />
      <line x1="-12" y1="8" x2="-12" y2="5" stroke="#8b4513" strokeWidth="1" />
      <line x1="12" y1="8" x2="12" y2="5" stroke="#8b4513" strokeWidth="1" />
      <line x1="20" y1="8" x2="20" y2="5" stroke="#8b4513" strokeWidth="1" />
      <line x1="28" y1="8" x2="28" y2="5" stroke="#8b4513" strokeWidth="1" />

      {/* Water waves underneath */}
      <g className="waves" opacity="0.4">
        <path
          d="M -40 22 Q -35 24 -30 22 Q -25 20 -20 22"
          stroke="#4299e1"
          strokeWidth="2"
          fill="none"
        >
          <animate
            attributeName="d"
            values="M -40 22 Q -35 24 -30 22 Q -25 20 -20 22;M -40 22 Q -35 20 -30 22 Q -25 24 -20 22;M -40 22 Q -35 24 -30 22 Q -25 20 -20 22"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 20 22 Q 25 24 30 22 Q 35 20 40 22"
          stroke="#4299e1"
          strokeWidth="2"
          fill="none"
        >
          <animate
            attributeName="d"
            values="M 20 22 Q 25 24 30 22 Q 35 20 40 22;M 20 22 Q 25 20 30 22 Q 35 24 40 22;M 20 22 Q 25 24 30 22 Q 35 20 40 22"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  );
};

export default BoatCharacter;
