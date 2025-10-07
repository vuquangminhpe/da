import React from "react";

interface HoChiMinhCharacterProps {
  age: "young" | "middle" | "old";
  x?: number;
  y?: number;
  scale?: number;
  className?: string;
}

export const HoChiMinhCharacter: React.FC<HoChiMinhCharacterProps> = ({
  age,
  x = 0,
  y = 0,
  scale = 1,
  className = "",
}) => {
  const hasBeard = age === "middle" || age === "old";
  const beardColor = age === "old" ? "#e5e5e5" : "#4a4a4a";
  const hairColor = age === "old" ? "#e5e5e5" : "#2d2d2d";

  return (
    <g
      className={`ho-chi-minh-character ${className}`}
      transform={`translate(${x}, ${y}) scale(${scale})`}
    >
      {/* Body */}
      <ellipse cx="0" cy="25" rx="12" ry="18" fill="#4a4a4a" />

      {/* Traditional Vietnamese outfit (áo dài) */}
      <path
        d="M -8 15 L -8 40 L -10 45 M 8 15 L 8 40 L 10 45"
        stroke="#d4a574"
        strokeWidth="2"
        fill="none"
      />
      <rect x="-10" y="15" width="20" height="25" rx="2" fill="#8b7355" />

      {/* Arms */}
      <line
        x1="-12"
        y1="20"
        x2="-16"
        y2="30"
        stroke="#d4a574"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="20"
        x2="16"
        y2="30"
        stroke="#d4a574"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Neck */}
      <rect x="-4" y="8" width="8" height="6" fill="#d4a574" rx="2" />

      {/* Head */}
      <ellipse cx="0" cy="0" rx="10" ry="12" fill="#d4a574" />

      {/* Hair */}
      <path
        d="M -10 -8 Q -12 -10 -10 -12 Q -6 -15 0 -14 Q 6 -15 10 -12 Q 12 -10 10 -8"
        fill={hairColor}
      />

      {/* Ears */}
      <ellipse cx="-10" cy="0" rx="2" ry="3" fill="#c49464" />
      <ellipse cx="10" cy="0" rx="2" ry="3" fill="#c49464" />

      {/* Eyes */}
      <ellipse cx="-3.5" cy="-1" rx="1.5" ry="2" fill="#2d2d2d" />
      <ellipse cx="3.5" cy="-1" rx="1.5" ry="2" fill="#2d2d2d" />

      {/* Eyebrows */}
      <path
        d="M -5.5 -4 Q -3.5 -5 -1.5 -4"
        stroke="#2d2d2d"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 1.5 -4 Q 3.5 -5 5.5 -4"
        stroke="#2d2d2d"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* Nose */}
      <line x1="0" y1="-1" x2="0" y2="2" stroke="#b08050" strokeWidth="1" />

      {/* Mouth - smile */}
      <path
        d="M -3 4 Q 0 6 3 4"
        stroke="#8b4513"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* Beard for middle and old age */}
      {hasBeard && (
        <>
          <path
            d="M -6 5 Q -8 8 -7 12 Q -5 11 -3 10 Q 0 11 3 10 Q 5 11 7 12 Q 8 8 6 5"
            fill={beardColor}
            opacity={age === "old" ? 1 : 0.8}
          />
          {/* Mustache */}
          <path
            d="M -6 3 Q -4 5 -1 4 M 6 3 Q 4 5 1 4"
            stroke={beardColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Legs */}
      <line
        x1="-5"
        y1="42"
        x2="-5"
        y2="55"
        stroke="#4a4a4a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="42"
        x2="5"
        y2="55"
        stroke="#4a4a4a"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Feet */}
      <ellipse cx="-5" cy="57" rx="4" ry="2" fill="#2d2d2d" />
      <ellipse cx="5" cy="57" rx="4" ry="2" fill="#2d2d2d" />

      {/* Sandals (simple) */}
      <rect x="-7" y="56" width="4" height="2" fill="#654321" rx="1" />
      <rect x="3" y="56" width="4" height="2" fill="#654321" rx="1" />
    </g>
  );
};

export default HoChiMinhCharacter;
