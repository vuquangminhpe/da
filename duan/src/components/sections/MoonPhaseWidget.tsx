import { useEffect, useState } from "react";

interface MoonData {
  time: string;
  phase: number;
  age: number;
  diameter: number;
  distance: number;
}

export default function MoonPhaseWidget() {
  const [moonData, setMoonData] = useState<MoonData | null>(null);

  useEffect(() => {
    fetch("/moonlight.json")
      .then((res) => res.json())
      .then((data: MoonData[]) => {
        const now = new Date();
        const dayOfYear = Math.floor(
          (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) /
            86400000
        );
        const hourOfDay = now.getHours();
        const index = Math.min(dayOfYear * 24 + hourOfDay, data.length - 1);
        setMoonData(data[index]);
      })
      .catch((err) => console.error("Failed to load moon data:", err));
  }, []);

  if (!moonData) return null;

  const getMoonPhaseEmoji = (phase: number) => {
    if (phase < 6.25) return "🌑"; // New Moon
    if (phase < 18.75) return "🌒"; // Waxing Crescent
    if (phase < 31.25) return "🌓"; // First Quarter
    if (phase < 43.75) return "🌔"; // Waxing Gibbous
    if (phase < 56.25) return "🌕"; // Full Moon
    if (phase < 68.75) return "🌖"; // Waning Gibbous
    if (phase < 81.25) return "🌗"; // Last Quarter
    if (phase < 93.75) return "🌘"; // Waning Crescent
    return "🌑"; // New Moon
  };

  const getMoonPhaseName = (phase: number) => {
    if (phase < 6.25) return "New Moon";
    if (phase < 18.75) return "Waxing Crescent";
    if (phase < 31.25) return "First Quarter";
    if (phase < 43.75) return "Waxing Gibbous";
    if (phase < 56.25) return "Full Moon";
    if (phase < 68.75) return "Waning Gibbous";
    if (phase < 81.25) return "Last Quarter";
    if (phase < 93.75) return "Waning Crescent";
    return "New Moon";
  };

  return (
    <div className="fixed top-6 right-6 z-50 bg-gradient-to-br from-slate-900/95 to-blue-950/95 backdrop-blur-md rounded-2xl border border-blue-400/30 p-5 shadow-2xl">
      <div className="flex items-center gap-4">
        {/* Moon Visual */}
        <div className="relative">
          <div className="text-6xl animate-pulse">
            {getMoonPhaseEmoji(moonData.phase)}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {moonData.phase.toFixed(0)}%
          </div>
        </div>

        {/* Moon Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">
            {getMoonPhaseName(moonData.phase)}
          </h3>
          <div className="text-xs text-blue-200 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📅</span>
              <span>Age: {moonData.age.toFixed(1)} days</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📏</span>
              <span>Diameter: {moonData.diameter.toFixed(0)}"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🛰️</span>
              <span>Distance: {(moonData.distance / 1000).toFixed(0)}k km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full">
        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
            style={{ width: `${moonData.phase}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-blue-300/60">
          <span>New</span>
          <span>Full</span>
          <span>New</span>
        </div>
      </div>
    </div>
  );
}
