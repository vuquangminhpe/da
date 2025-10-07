import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  journeyStops,
  journeyPhases,
  type JourneyStop,
} from "../../data/journeyData";
import { Globe3D } from "../globe";
import HoChiMinhCharacter from "../characters/HoChiMinhCharacter";
import BoatCharacter from "../characters/BoatCharacter";
import SoldierCharacter from "../characters/SoldierCharacter";
import VietnamFlag from "../characters/VietnamFlag";

gsap.registerPlugin(ScrollTrigger);

const Section1Journey = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedStop, setSelectedStop] = useState<JourneyStop | null>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [characterAge, setCharacterAge] = useState<"young" | "middle" | "old">(
    "young"
  );
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Auto-play journey function
  const playJourney = () => {
    // Hide intro first
    setShowIntro(false);

    // Wait for intro to fade out
    setTimeout(() => {
      setIsAutoPlaying(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setIsAutoPlaying(false);
          // Show victory sequence at the end
          showVictorySequence();
        },
      });

      journeyStops.forEach((stop, index) => {
        tl.call(() => {
          setCurrentStopIndex(index);

          // Update character age based on journey progress
          if (index < 7) {
            setCharacterAge("young");
          } else if (index < 16) {
            setCharacterAge("middle");
          } else {
            setCharacterAge("old");
          }

          // Update current phase based on stop
          const phaseIndex = journeyPhases.findIndex((phase) =>
            phase.stops.includes(stop.id)
          );
          if (phaseIndex !== -1) {
            setCurrentPhase(phaseIndex);
          }

          // Show stop info
          setSelectedStop(stop);
        });

        // Wait at each stop (3 seconds)
        tl.to({}, { duration: 3 });
      });

      timelineRef.current = tl;
    }, 800);
  };

  // Victory sequence animation
  const showVictorySequence = () => {
    const tl = gsap.timeline();

    // Soldiers appear and fight
    tl.from(".victory-soldier", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.5,
    });

    // Flag raising
    tl.from(
      ".victory-flag",
      {
        opacity: 0,
        scale: 0,
        duration: 1,
        ease: "back.out(2)",
      },
      "+=0.5"
    );

    // Celebration
    tl.to(".victory-soldier", {
      rotation: "+=15",
      yoyo: true,
      repeat: 3,
      duration: 0.3,
      stagger: 0.1,
    });
  };

  // Scroll trigger setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Any GSAP animations tied to scroll can be added here
    }, sectionRef);

    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 px-4 relative overflow-hidden"
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Intro Screen */}
      {showIntro && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-blue-950 via-slate-900 to-black flex items-center justify-center transition-opacity duration-1000">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 animate-pulse">
              1911
            </h1>
            <p className="text-2xl md:text-4xl text-blue-200">
              Bác Hồ ra đi tìm đường cứu nước
            </p>

            {/* Boat and Character Animation */}
            <div className="flex justify-center items-center py-12">
              <svg width="400" height="200" viewBox="0 0 400 200">
                {/* Ocean waves */}
                <path
                  d="M0,150 Q50,140 100,150 T200,150 T300,150 T400,150"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  opacity="0.6"
                  className="wave-animation"
                />
                <path
                  d="M0,160 Q50,150 100,160 T200,160 T300,160 T400,160"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  opacity="0.4"
                  className="wave-animation"
                  style={{ animationDelay: "0.5s" }}
                />

                {/* Boat and Character */}
                <g transform="translate(200, 120)">
                  <BoatCharacter y={0} scale={1.5} className="boat-float" />
                  <g transform="translate(0, -30)">
                    <HoChiMinhCharacter
                      age="young"
                      scale={1.2}
                      className="character-wave"
                    />
                  </g>
                </g>
              </svg>
            </div>

            <button
              onClick={playJourney}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-xl rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
            >
              Bắt đầu hành trình
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Play button (shown when intro is hidden) */}
        <div className="text-center mb-8">
          <button
            onClick={playJourney}
            disabled={isAutoPlaying}
            className={`px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 ${
              isAutoPlaying
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-105"
            }`}
          >
            {isAutoPlaying ? "Đang phát..." : "Xem hành trình"}
          </button>
        </div>

        {/* Title */}
        <div className="journey-title text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 mb-4">
            Hành Trình 30 Năm
          </h2>
          <p className="text-2xl md:text-3xl text-blue-200 mb-2">
            Tìm Đường Cứu Nước
          </p>
          <p className="text-lg text-blue-300/70">
            1911 - 1941 | 20 điểm dừng | 6 châu lục
          </p>
          <div className="mt-6 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto rounded-full" />
        </div>

        {/* Current Phase Indicator */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-md px-6 py-3 rounded-full border border-blue-400/30">
            <p className="text-yellow-300 font-semibold">
              {journeyPhases[currentPhase]?.phase}
            </p>
            <p className="text-blue-200 text-sm mt-1">
              {journeyPhases[currentPhase]?.description}
            </p>
          </div>
        </div>

        {/* Globe Container */}
        <div
          className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-8 border border-blue-500/20 mb-6 relative"
          style={{ height: "1000px" }}
        >
          <Globe3D
            currentStopIndex={currentStopIndex}
            journeyStops={journeyStops}
            isAutoPlaying={isAutoPlaying}
            onStopClick={(stop) => {
              setSelectedStop(stop);
              const index = journeyStops.findIndex((s) => s.id === stop.id);
              setCurrentStopIndex(index);
            }}
          />

          {/* Victory sequence overlay */}
          {currentStopIndex === journeyStops.length - 1 && isAutoPlaying && (
            <div className="absolute bottom-10 right-10 pointer-events-none z-30">
              <svg width="400" height="300" viewBox="0 0 400 300">
                <g className="victory-scene">
                  <SoldierCharacter
                    x={50}
                    y={200}
                    action="celebrating"
                    scale={1.2}
                    className="victory-soldier"
                  />
                  <SoldierCharacter
                    x={150}
                    y={200}
                    action="celebrating"
                    scale={1.2}
                    className="victory-soldier"
                  />
                  <SoldierCharacter
                    x={250}
                    y={200}
                    action="celebrating"
                    scale={1.2}
                    className="victory-soldier"
                  />
                  <VietnamFlag
                    x={200}
                    y={50}
                    scale={1.5}
                    waving={true}
                    className="victory-flag"
                  />
                  <HoChiMinhCharacter
                    age="old"
                    scale={1.3}
                    className="victory-leader"
                  />
                </g>
              </svg>
            </div>
          )}
        </div>

        {/* Bottom Info Bar - Centered and Larger */}
        {selectedStop && currentStopIndex >= 0 && (
          <div className="bg-gradient-to-br from-slate-800/95 to-blue-900/95 backdrop-blur-xl p-12 rounded-3xl border-2 border-blue-500/30 shadow-2xl mb-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-6 mb-4">
                <span className="text-yellow-400 font-bold text-lg">
                  Điểm dừng {currentStopIndex + 1}/{journeyStops.length}
                </span>
                <span className="text-blue-300 text-lg">
                  {selectedStop.date}
                </span>
                {selectedStop.alias && (
                  <span className="text-orange-400 text-lg italic">
                    "{selectedStop.alias}"
                  </span>
                )}
              </div>

              <h3 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 mb-4">
                {selectedStop.location}
              </h3>
              <p className="text-3xl text-blue-200 font-semibold">
                {selectedStop.city}, {selectedStop.country}
              </p>
            </div>

            {/* Image - Centered */}
            {selectedStop.imageUrl && (
              <div className="flex justify-center mb-8">
                <div className="relative max-w-2xl">
                  <img
                    src={selectedStop.imageUrl}
                    alt={selectedStop.location}
                    className="rounded-2xl shadow-2xl border-4 border-blue-500/30 w-full object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl pointer-events-none" />
                </div>
              </div>
            )}

            {/* Content - Single Column Centered */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-6 rounded-2xl border border-yellow-500/30">
                <h4 className="text-yellow-300 font-bold text-2xl mb-3 flex items-center justify-center">
                  <span className="mr-3 text-3xl">📍</span> Sự kiện
                </h4>
                <p className="text-blue-100 text-xl leading-relaxed text-center">
                  {selectedStop.event}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-2xl border border-blue-500/30">
                <h4 className="text-blue-300 font-bold text-2xl mb-3 flex items-center justify-center">
                  <span className="mr-3 text-3xl">📖</span> Chi tiết
                </h4>
                <p className="text-blue-200 text-lg leading-relaxed text-center">
                  {selectedStop.details}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-2xl border border-purple-500/30">
                <h4 className="text-purple-300 font-bold text-2xl mb-3 flex items-center justify-center">
                  <span className="mr-3 text-3xl">⭐</span> Ý nghĩa
                </h4>
                <p className="text-purple-200 text-lg leading-relaxed text-center">
                  {selectedStop.significance}
                </p>
              </div>

              {selectedStop.historicalContext && (
                <div className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 p-6 rounded-2xl border border-indigo-500/30">
                  <h4 className="text-indigo-300 font-bold text-2xl mb-3 flex items-center justify-center">
                    <span className="mr-3 text-3xl">🌏</span> Bối cảnh lịch sử
                  </h4>
                  <p className="text-blue-200 text-lg leading-relaxed text-center">
                    {selectedStop.historicalContext}
                  </p>
                </div>
              )}
            </div>

            {/* Character Age Indicator - Centered */}
            <div className="flex items-center justify-center space-x-3 pt-8 mt-8 border-t border-blue-500/20">
              <span className="text-blue-300 text-lg font-semibold">
                Giai đoạn cuộc đời:
              </span>
              <div className="flex space-x-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    characterAge === "young"
                      ? "bg-green-500/30 text-green-300 border-2 border-green-500 scale-110"
                      : "bg-gray-700/30 text-gray-400 border border-gray-600"
                  }`}
                >
                  Trẻ (21-34 tuổi)
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    characterAge === "middle"
                      ? "bg-blue-500/30 text-blue-300 border-2 border-blue-500 scale-110"
                      : "bg-gray-700/30 text-gray-400 border border-gray-600"
                  }`}
                >
                  Trung niên (35-47 tuổi)
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    characterAge === "old"
                      ? "bg-purple-500/30 text-purple-300 border-2 border-purple-500 scale-110"
                      : "bg-gray-700/30 text-gray-400 border border-gray-600"
                  }`}
                >
                  Trưởng thành (48-51 tuổi)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Journey Timeline */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/20">
          <h3 className="text-2xl font-bold text-blue-300 mb-4 text-center">
            Dòng thời gian hành trình
          </h3>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {journeyStops.map((stop, index) => {
              const phase = journeyPhases.find((p) =>
                p.stops.includes(stop.id)
              );
              const phaseColor = phase?.color || "#60a5fa";
              const isActive = index === currentStopIndex;
              const isPast = index < currentStopIndex;

              return (
                <button
                  key={stop.id}
                  onClick={() => {
                    setSelectedStop(stop);
                    setCurrentStopIndex(index);
                  }}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all duration-300 min-w-[200px] ${
                    isActive
                      ? "border-yellow-400 bg-yellow-500/20 scale-105"
                      : isPast
                      ? "border-blue-500/50 bg-blue-900/30"
                      : "border-gray-600 bg-gray-800/30 opacity-50"
                  } hover:scale-105`}
                  style={{
                    borderColor: isActive ? "#fbbf24" : phaseColor,
                  }}
                >
                  <div className="text-left">
                    <div className="text-xs text-gray-400 mb-1">
                      {stop.date}
                    </div>
                    <div className="font-semibold text-white text-sm">
                      {stop.city}
                    </div>
                    <div className="text-xs text-blue-300">{stop.country}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1Journey;
