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
import VietnamFlagBackground from "../VietnamFlagBackground";
import bhCopy4 from "../../assets/bh-Copy-4.jpg";
import introSound from "../../assets/file_sound/Trang chủ.mp3";

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
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [showStartOverlay, setShowStartOverlay] = useState<boolean>(true);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const popupTimeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopAudioRef = useRef<HTMLAudioElement | null>(null); // Audio for journey stops
  const audioTimeoutRef = useRef<number | null>(null); // Timeout for playing audio after rotation

  // Function to go to next stop
  const goToNextStop = () => {
    if (currentStopIndex < journeyStops.length - 1) {
      const nextIndex = currentStopIndex + 1;
      setCurrentStopIndex(nextIndex);
      setSelectedStop(journeyStops[nextIndex]);

      // Update character age
      if (nextIndex < 7) {
        setCharacterAge("young");
      } else if (nextIndex < 16) {
        setCharacterAge("middle");
      } else {
        setCharacterAge("old");
      }

      // Update phase
      const phaseIndex = journeyPhases.findIndex((phase) =>
        phase.stops.includes(journeyStops[nextIndex].id)
      );
      if (phaseIndex !== -1) {
        setCurrentPhase(phaseIndex);
      }
    }
  };

  // Function to go to previous stop
  const goToPreviousStop = () => {
    if (currentStopIndex > 0) {
      const prevIndex = currentStopIndex - 1;
      setCurrentStopIndex(prevIndex);
      setSelectedStop(journeyStops[prevIndex]);

      // Update character age
      if (prevIndex < 7) {
        setCharacterAge("young");
      } else if (prevIndex < 16) {
        setCharacterAge("middle");
      } else {
        setCharacterAge("old");
      }

      // Update phase
      const phaseIndex = journeyPhases.findIndex((phase) =>
        phase.stops.includes(journeyStops[prevIndex].id)
      );
      if (phaseIndex !== -1) {
        setCurrentPhase(phaseIndex);
      }
    }
  };
  // something
  // Handle start overlay - play music on first interaction
  const handleStartExperience = () => {
    setShowStartOverlay(false);

    // Play audio after user interaction
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((error) => {
          console.log("Audio play failed:", error);
          setIsMusicPlaying(false);
        });
    }
  };

  // Effect to handle intro music
  useEffect(() => {
    // Only manage pause/stop, not autoplay (handled by user interaction)
    if (!showIntro && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }

    // Cleanup: stop music when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [showIntro]);

  // Function to toggle music
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsMusicPlaying(true))
          .catch((error) => console.log("Play failed:", error));
      }
    }
  };

  // Effect to handle popup animation with delay
  useEffect(() => {
    if (currentStopIndex >= 0 && selectedStop) {
      // Clear any existing timeout
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }

      // Stop current audio if playing
      if (stopAudioRef.current) {
        stopAudioRef.current.pause();
        stopAudioRef.current.currentTime = 0;
      }

      // Hide popup first with scale down animation
      setIsTransitioning(true);
      setShowPopup(false);

      // Wait for Globe to rotate and highlight (1.5 seconds)
      popupTimeoutRef.current = window.setTimeout(() => {
        setShowPopup(true);
        setIsTransitioning(false);
      }, 1500);

      // Play audio AFTER globe rotation (1.5 seconds delay)
      if (selectedStop.sound && stopAudioRef.current) {
        audioTimeoutRef.current = window.setTimeout(() => {
          if (stopAudioRef.current) {
            stopAudioRef.current.src = selectedStop.sound!;
            stopAudioRef.current.volume = 0.6;
            stopAudioRef.current.play().catch((error) => {
              console.log("Stop audio play failed:", error);
            });
          }
        }, 1500);
      }
    } else {
      setShowPopup(false);
    }

    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
    };
  }, [currentStopIndex, selectedStop]);

  // Auto-play journey function
  const playJourney = () => {
    // Stop intro music
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }

    // Hide intro first
    setShowIntro(false);

    // Wait for intro to fade out
    setTimeout(() => {
      setIsAutoPlaying(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setIsAutoPlaying(false);
          // Stop any playing stop audio
          if (stopAudioRef.current) {
            stopAudioRef.current.pause();
            stopAudioRef.current.currentTime = 0;
          }
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

          // Audio will be played by useEffect after 1.5s delay
        });

        // Wait at each stop using custom duration (default 3 seconds if not specified)
        const stopDuration = stop.duration || 3;
        tl.to({}, { duration: stopDuration });
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
      // Clean up stop audio
      if (stopAudioRef.current) {
        stopAudioRef.current.pause();
        stopAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 px-4 relative overflow-x-hidden"
    >
      {/* Hidden audio element for journey stop sounds */}
      <audio ref={stopAudioRef} />

      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Intro Screen */}
      {showIntro && (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden transition-opacity duration-1000">
          {/* Background Music - Play once only */}
          <audio ref={audioRef} src={introSound} />

          {/* Start Experience Overlay */}
          {showStartOverlay && (
            <div
              className="fixed inset-0 z-[70] flex items-center justify-center cursor-pointer overflow-y-auto overflow-x-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(115, 1, 9, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)",
              }}
              onClick={handleStartExperience}
            >
              <div className="text-center space-y-8 px-8 animate-pulse">
                {/* Large Vietnam Star */}
                <div className="flex justify-center mb-6">
                  <svg
                    className="w-32 h-32 animate-spin-slow"
                    viewBox="0 0 50 50"
                  >
                    <polygon
                      points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                      fill="var(--vietnam-yellow)"
                      style={{
                        filter: "drop-shadow(0 0 20px var(--vietnam-yellow))",
                      }}
                    />
                  </svg>
                </div>

                {/* Text */}
                <div className="space-y-4">
                  <h2
                    className="text-5xl md:text-7xl font-black"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--vietnam-yellow)",
                      textShadow: "0 0 30px rgba(255, 235, 211, 0.5)",
                    }}
                  >
                    NHẤN ĐỂ BẮT ĐẦU
                  </h2>

                  <p
                    className="text-xl md:text-2xl"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--vietnam-white)",
                      opacity: 0.9,
                    }}
                  >
                    Nhấp vào bất cứ đâu để bắt đầu cuộc hành trình
                  </p>

                  {/* Click icon */}
                  <div className="mt-8 flex justify-center">
                    <svg
                      className="w-16 h-16 animate-bounce"
                      fill="var(--vietnam-yellow)"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Music Control Button */}
          <button
            onClick={toggleMusic}
            className="fixed top-4 right-4 z-[60] p-3 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, var(--vietnam-red) 0%, #8B0000 100%)`,
              border: `2px solid var(--vietnam-yellow)`,
            }}
            aria-label="Toggle music"
          >
            {isMusicPlaying ? (
              <svg
                className="w-6 h-6"
                fill="var(--vietnam-yellow)"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="var(--vietnam-yellow)"
                viewBox="0 0 24 24"
              >
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            )}
          </button>

          {/* Vietnam Flag Background */}
          <VietnamFlagBackground />

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-4 min-h-screen flex flex-col justify-center items-center text-center">
            <div className="w-full space-y-2 max-w-3xl">
            {/* Hero Image Section */}
            <div
              className="flex justify-center mb-2 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative">
                <div
                  className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 shadow-2xl"
                  style={{ borderColor: "var(--vietnam-yellow)" }}
                >
                  <img
                    src={bhCopy4}
                    alt="Khởi hành năm 1911"
                    className="w-full h-full translate-y-5 object-cover object-center"
                    style={{
                      filter: "contrast(110%) brightness(105%) saturate(95%)",
                      objectPosition: "center center",
                    }}
                  />
                </div>

                {/* Decorative ring around image */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-opacity-30 animate-pulse"
                  style={{ borderColor: "var(--vietnam-yellow)" }}
                ></div>

                {/* Floating star decorations */}
                <div className="absolute -top-2 -right-2">
                  <svg className="w-6 h-6 animate-pulse" viewBox="0 0 50 50">
                    <polygon
                      points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                      fill="var(--vietnam-yellow)"
                      style={{
                        filter: "drop-shadow(0 0 6px var(--vietnam-yellow))",
                      }}
                    />
                  </svg>
                </div>

                <div className="absolute -bottom-1 -left-2">
                  <svg
                    className="w-4 h-4 animate-pulse"
                    viewBox="0 0 50 50"
                    style={{ animationDelay: "1s" }}
                  >
                    <polygon
                      points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                      fill="var(--vietnam-yellow)"
                      style={{
                        filter: "drop-shadow(0 0 6px var(--vietnam-yellow))",
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-1">
              <h1
                className="text-3xl md:text-5xl lg:text-6xl font-black animate-shimmer animate-fade-in-up"
                style={{
                  fontFamily: "var(--font-heading)",
                  animationDelay: "0.5s",
                  fontSize: "clamp(2rem, 8vw, 4rem)",
                }}
              >
                1911
              </h1>
              <div
                className="w-16 md:w-20 h-1 mx-auto rounded-full animate-fade-in-up"
                style={{
                  background:
                    "linear-gradient(90deg, var(--vietnam-red), var(--vietnam-yellow), var(--vietnam-red))",
                  animationDelay: "1s",
                }}
              ></div>
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <h2
                className="text-lg md:text-xl lg:text-2xl font-bold text-white animate-fade-in-up leading-tight"
                style={{
                  fontFamily: "var(--font-heading)",
                  animationDelay: "1.5s",
                  textShadow: "2px 2px 4px rgba(115, 1, 9, 0.8)",
                }}
              >
                HÀNH TRÌNH TÌM ĐƯỜNG CỨU NƯỚC
              </h2>

              {/* Quote from Ho Chi Minh */}
              <blockquote
                className="animate-fade-in-up"
                style={{ animationDelay: "1.8s" }}
              >
                <p
                  className="text-sm md:text-base lg:text-lg italic font-medium leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--vietnam-yellow)",
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  "Tôi đi tìm đường cứu nước"
                </p>
                <cite
                  className="text-xs opacity-80 mt-1 block"
                  style={{ color: "var(--vietnam-white)" }}
                >
                  - Nguyễn Tất Thành, 1911
                </cite>
              </blockquote>

              <p
                className="text-sm md:text-base lg:text-lg animate-fade-in-up"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--vietnam-yellow)",
                  animationDelay: "2s",
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                }}
              >
                30 năm • 20 quốc gia • 6 châu lục
              </p>
            </div>

            {/* Character and Boat Animation - Smaller */}
            <div
              className="flex justify-center items-center animate-fade-in-up"
              style={{ animationDelay: "2.5s" }}
            >
              <div className="relative">
                <svg
                  width="180"
                  height="90"
                  viewBox="0 0 300 150"
                  className="drop-shadow-lg"
                >
                  {/* Stylized ocean waves */}
                  <defs>
                    <linearGradient
                      id="waveGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: "var(--vietnam-red)",
                          stopOpacity: 0.4,
                        }}
                      />
                      <stop
                        offset="50%"
                        style={{
                          stopColor: "var(--vietnam-yellow)",
                          stopOpacity: 0.6,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: "var(--vietnam-red)",
                          stopOpacity: 0.4,
                        }}
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0,100 Q75,85 150,100 T300,100"
                    fill="none"
                    stroke="url(#waveGradient)"
                    strokeWidth="3"
                    className="animate-flag-wave"
                  />
                  <path
                    d="M0,110 Q75,95 150,110 T300,110"
                    fill="none"
                    stroke="url(#waveGradient)"
                    strokeWidth="2"
                    opacity="0.7"
                    className="animate-flag-wave"
                    style={{ animationDelay: "0.5s" }}
                  />

                  {/* Boat and Character - Smaller */}
                  <g transform="translate(150, 80)" className="animate-float">
                    <BoatCharacter y={0} scale={0.8} className="boat-float" />
                    <g transform="translate(0, -25)">
                      <HoChiMinhCharacter
                        age="young"
                        scale={0.7}
                        className="character-wave"
                      />
                    </g>
                  </g>

                  {/* Decorative elements */}
                  <circle
                    cx="60"
                    cy="30"
                    r="1.5"
                    fill="var(--vietnam-yellow)"
                    opacity="0.8"
                    className="animate-pulse"
                  />
                  <circle
                    cx="240"
                    cy="40"
                    r="1"
                    fill="var(--vietnam-yellow)"
                    opacity="0.6"
                    className="animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                </svg>
              </div>
            </div>

            {/* Call to Action Button */}
            <div
              className="animate-fade-in-up pb-2"
              style={{ animationDelay: "3s" }}
            >
              <button
                onClick={playJourney}
                className="group relative px-6 py-2 font-bold text-base rounded-full shadow-2xl hover:scale-110 transition-all duration-300 overflow-hidden mb-2"
                style={{
                  fontFamily: "var(--font-body)",
                  background: `linear-gradient(135deg, var(--vietnam-red) 0%, #8B0000 50%, var(--vietnam-red) 100%)`,
                  color: "var(--vietnam-yellow)",
                  border: `2px solid var(--vietnam-yellow)`,
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>🚢</span>
                  BẮT ĐẦU HÀNH TRÌNH
                  <span>⭐</span>
                </span>

                {/* Button hover effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, var(--vietnam-yellow) 0%, #FFD700 50%, var(--vietnam-yellow) 100%)`,
                  }}
                ></div>
              </button>

              {/* Subtitle under button */}
              <p
                className="text-xs opacity-80 px-4"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--vietnam-yellow)",
                }}
              >
                Khám phá 30 năm tìm đường cứu nước của Chủ tịch Hồ Chí Minh
              </p>
            </div>
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-8 h-8 opacity-15">
            <VietnamFlag x={0} y={0} scale={0.5} waving={true} />
          </div>
          <div className="absolute top-4 right-4 w-8 h-8 opacity-15">
            <VietnamFlag x={0} y={0} scale={0.5} waving={true} />
          </div>
          <div className="absolute bottom-4 left-4 w-8 h-8 opacity-15">
            <VietnamFlag x={0} y={0} scale={0.5} waving={true} />
          </div>
          <div className="absolute bottom-4 right-4 w-8 h-8 opacity-15">
            <VietnamFlag x={0} y={0} scale={0.5} waving={true} />
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
            className={`group relative px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 ${
              isAutoPlaying
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[var(--vietnam-red)] via-red-800 to-[var(--vietnam-red)] hover:scale-110 border-2 border-[var(--vietnam-yellow)]"
            }`}
            style={{
              color: "var(--vietnam-yellow)",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 50 50">
                <polygon
                  points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                  fill="currentColor"
                />
              </svg>
              {isAutoPlaying ? "ĐANG HÀNH TRÌNH..." : "XEM HÀNH TRÌNH"}
              <svg className="w-5 h-5" viewBox="0 0 50 50">
                <polygon
                  points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                  fill="currentColor"
                />
              </svg>
            </span>
            {!isAutoPlaying && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full bg-gradient-to-r from-[var(--vietnam-yellow)] via-yellow-500 to-[var(--vietnam-yellow)]" />
            )}
          </button>
        </div>

        {/* Title with Vietnam flag theme */}
        <div className="journey-title text-center mb-12 relative">
          {/* Decorative flags */}
          <div className="absolute left-0 top-0 w-16 h-16 opacity-30 animate-flag-wave">
            <VietnamFlag x={0} y={0} scale={1} waving={true} />
          </div>
          <div
            className="absolute right-0 top-0 w-16 h-16 opacity-30 animate-flag-wave"
            style={{ animationDelay: "0.5s" }}
          >
            <VietnamFlag x={0} y={0} scale={1} waving={true} />
          </div>

          {/* Title with gold border effect */}
          <div className="relative inline-block mb-6">
            <h2
              className="text-5xl md:text-7xl font-black mb-4 relative z-10"
              style={{
                color: "var(--vietnam-yellow)",
                textShadow: `
                  0 0 10px var(--vietnam-red),
                  0 0 20px var(--vietnam-red),
                  2px 2px 4px rgba(0,0,0,0.8),
                  -2px -2px 4px rgba(255,235,211,0.3)
                `,
                fontFamily: "var(--font-heading)",
              }}
            >
              HÀNH TRÌNH 30 NĂM
            </h2>
          </div>

          <p
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{
              color: "var(--vietnam-red)",
              textShadow:
                "0 2px 8px rgba(0,0,0,0.6), 0 0 20px var(--vietnam-yellow)",
              fontFamily: "var(--font-heading)",
            }}
          >
            TÌM ĐƯỜNG CỨU NƯỚC
          </p>

          <div className="flex items-center justify-center gap-3 text-lg mt-4">
            <span style={{ color: "var(--vietnam-yellow)" }}>⭐</span>
            <span style={{ color: "var(--vietnam-white)" }}>1911 - 1941</span>
            <span style={{ color: "var(--vietnam-red)" }}>•</span>
            <span style={{ color: "var(--vietnam-white)" }}>20 điểm dừng</span>
            <span style={{ color: "var(--vietnam-red)" }}>•</span>
            <span style={{ color: "var(--vietnam-white)" }}>6 châu lục</span>
            <span style={{ color: "var(--vietnam-yellow)" }}>⭐</span>
          </div>

          {/* Golden divider with star */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[var(--vietnam-yellow)] to-transparent" />
            <svg className="w-4 h-4" viewBox="0 0 50 50">
              <polygon
                points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                fill="var(--vietnam-yellow)"
                style={{ filter: "drop-shadow(0 0 8px var(--vietnam-yellow))" }}
              />
            </svg>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[var(--vietnam-yellow)] to-transparent" />
          </div>
        </div>

        {/* Current Phase Indicator with flag theme */}
        <div className="mb-8 text-center">
          <div
            className="inline-block backdrop-blur-md px-8 py-4 rounded-2xl border-2 shadow-2xl relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(218,41,28,0.15) 0%, rgba(255,235,211,0.15) 100%)",
              borderColor: "var(--vietnam-yellow)",
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-2">
                <svg className="w-8 h-8" viewBox="0 0 50 50">
                  <polygon
                    points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                    fill="var(--vietnam-yellow)"
                  />
                </svg>
              </div>
              <div className="absolute bottom-2 right-2">
                <svg className="w-8 h-8" viewBox="0 0 50 50">
                  <polygon
                    points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                    fill="var(--vietnam-yellow)"
                  />
                </svg>
              </div>
            </div>

            <p
              className="font-bold text-xl mb-1 relative z-10"
              style={{
                color: "var(--vietnam-yellow)",
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              {journeyPhases[currentPhase]?.phase}
            </p>
            <p
              className="text-base relative z-10"
              style={{
                color: "var(--vietnam-white)",
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              }}
            >
              {journeyPhases[currentPhase]?.description}
            </p>
          </div>
        </div>

        {/* Globe Container - Full Screen */}
        <div className="fixed inset-0 w-full h-screen z-10">
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

        {/* Info Popup Overlay - Centered with Scale Animation */}
        {selectedStop && currentStopIndex >= 0 && showPopup && (
          <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none px-4 py-4">
            <div
              className={`backdrop-blur-xl p-6 rounded-3xl border-4 shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto pointer-events-auto relative ${
                isTransitioning ? "animate-scale-down" : "animate-scale-up"
              }`}
              style={{
                background:
                  "linear-gradient(135deg, rgba(218,41,28,0.95) 0%, rgba(139,0,0,0.98) 50%, rgba(218,41,28,0.95) 100%)",
                borderColor: "var(--vietnam-yellow)",
                boxShadow: `
                  0 0 60px rgba(255,235,211,0.4),
                  inset 0 0 100px rgba(0,0,0,0.3)
                `,
              }}
            >
              {/* Decorative corner stars */}
              <div className="absolute top-4 left-4 w-8 h-8 opacity-50 animate-pulse">
                <svg viewBox="0 0 50 50">
                  <polygon
                    points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                    fill="var(--vietnam-yellow)"
                  />
                </svg>
              </div>
              <div
                className="absolute top-4 right-16 w-8 h-8 opacity-50 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <svg viewBox="0 0 50 50">
                  <polygon
                    points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                    fill="var(--vietnam-yellow)"
                  />
                </svg>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setShowPopup(false);
                  setTimeout(() => {
                    setSelectedStop(null);
                    setCurrentStopIndex(-1);
                  }, 400);
                }}
                className="absolute top-4 right-4 rounded-full p-2 transition-all duration-300 z-10 border-2"
                style={{
                  background: "var(--vietnam-yellow)",
                  borderColor: "var(--vietnam-red)",
                  color: "var(--vietnam-red)",
                }}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 font-bold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header with gold theme */}
              <div className="text-center mb-10 relative">
                <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
                  <span
                    className="font-black text-lg px-4 py-1 rounded-full border-2"
                    style={{
                      color: "var(--vietnam-yellow)",
                      borderColor: "var(--vietnam-yellow)",
                      background: "rgba(0,0,0,0.3)",
                      textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    ⭐ ĐIỂM DỪNG {currentStopIndex + 1}/{journeyStops.length} ⭐
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ color: "var(--vietnam-white)" }}
                  >
                    {selectedStop.date}
                  </span>
                  {selectedStop.alias && (
                    <span
                      className="text-base italic font-semibold px-3 py-1 rounded-full border"
                      style={{
                        color: "var(--vietnam-yellow)",
                        borderColor: "rgba(255,235,211,0.3)",
                        background: "rgba(0,0,0,0.2)",
                      }}
                    >
                      "{selectedStop.alias}"
                    </span>
                  )}
                </div>

                <h3
                  className="text-4xl md:text-5xl font-black mb-3"
                  style={{
                    color: "var(--vietnam-yellow)",
                    textShadow: `
                      0 0 20px var(--vietnam-yellow),
                      2px 2px 8px rgba(0,0,0,0.9),
                      -1px -1px 4px rgba(255,235,211,0.5)
                    `,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {selectedStop.location}
                </h3>
                <p
                  className="text-2xl font-bold"
                  style={{
                    color: "var(--vietnam-white)",
                    textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {selectedStop.city}, {selectedStop.country}
                </p>

                {/* Golden divider */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-[var(--vietnam-yellow)] to-[var(--vietnam-yellow)]" />
                  <svg className="w-5 h-5" viewBox="0 0 50 50">
                    <polygon
                      points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                      fill="var(--vietnam-yellow)"
                      style={{
                        filter: "drop-shadow(0 0 8px var(--vietnam-yellow))",
                      }}
                    />
                  </svg>
                  <div className="h-1 w-24 rounded-full bg-gradient-to-l from-transparent via-[var(--vietnam-yellow)] to-[var(--vietnam-yellow)]" />
                </div>
              </div>

              {/* Content Grid - 2 Columns */}
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Left Column - Image */}
                {selectedStop.imageUrl && (
                  <div className="flex items-start mb-6 md:mb-0">
                    <div className="relative w-full">
                      <img
                        src={selectedStop.imageUrl}
                        alt={selectedStop.location}
                        className="rounded-2xl shadow-2xl w-full object-cover border-3"
                        style={{
                          maxHeight: "350px",
                          minHeight: "250px",
                          borderColor: "var(--vietnam-yellow)",
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(139,0,0,0.5) 0%, transparent 50%)",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Right Column - Content with red-gold theme */}
                <div className="space-y-4">
                  <div
                    className="p-5 rounded-xl border-2 relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,235,211,0.15) 0%, rgba(255,215,0,0.1) 100%)",
                      borderColor: "var(--vietnam-yellow)",
                    }}
                  >
                    <h4
                      className="font-black text-base mb-3 flex items-center"
                      style={{
                        color: "var(--vietnam-yellow)",
                        textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      <span className="mr-2 text-lg">📍</span> SỰ KIỆN
                    </h4>
                    <p
                      className="text-sm leading-relaxed font-medium"
                      style={{ color: "var(--vietnam-white)" }}
                    >
                      {selectedStop.event}
                    </p>
                  </div>

                  <div
                    className="p-5 rounded-xl border-2 relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(139,0,0,0.2) 100%)",
                      borderColor: "rgba(255,235,211,0.5)",
                    }}
                  >
                    <h4
                      className="font-black text-base mb-3 flex items-center"
                      style={{
                        color: "var(--vietnam-yellow)",
                        textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      <span className="mr-2 text-lg">📖</span> CHI TIẾT
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {selectedStop.details}
                    </p>
                  </div>

                  <div
                    className="p-5 rounded-xl border-2 relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,235,211,0.1) 100%)",
                      borderColor: "var(--vietnam-yellow)",
                    }}
                  >
                    <h4
                      className="font-black text-base mb-3 flex items-center"
                      style={{
                        color: "var(--vietnam-yellow)",
                        textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      <span className="mr-2 text-lg">⭐</span> Ý NGHĨA
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {selectedStop.significance}
                    </p>
                  </div>

                  {selectedStop.historicalContext && (
                    <div
                      className="p-5 rounded-xl border-2 relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(139,0,0,0.2) 100%)",
                        borderColor: "rgba(255,235,211,0.5)",
                      }}
                    >
                      <h4
                        className="font-black text-base mb-3 flex items-center"
                        style={{
                          color: "var(--vietnam-yellow)",
                          textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                        }}
                      >
                        <span className="mr-2 text-lg">🌏</span> BỐI CẢNH
                      </h4>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.9)" }}
                      >
                        {selectedStop.historicalContext}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Character Age Indicator with Vietnam theme - REDESIGNED */}
              <div
                className="mt-6 pt-5 border-t-2"
                style={{ borderColor: "rgba(255,235,211,0.3)" }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 50 50">
                      <polygon
                        points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                        fill="var(--vietnam-yellow)"
                        style={{
                          filter: "drop-shadow(0 0 8px var(--vietnam-yellow))",
                        }}
                      />
                    </svg>
                    <h4
                      className="text-base font-black uppercase"
                      style={{
                        color: "var(--vietnam-yellow)",
                        textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      GIAI ĐOẠN CUỘC ĐỜI
                    </h4>
                    <svg className="w-6 h-6" viewBox="0 0 50 50">
                      <polygon
                        points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                        fill="var(--vietnam-yellow)"
                        style={{
                          filter: "drop-shadow(0 0 8px var(--vietnam-yellow))",
                        }}
                      />
                    </svg>
                  </div>

                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 transition-all duration-300 ${
                        characterAge === "young"
                          ? "scale-105 shadow-xl"
                          : "hover:scale-105"
                      }`}
                      style={{
                        color:
                          characterAge === "young"
                            ? "var(--vietnam-red)"
                            : "#999",
                        background:
                          characterAge === "young"
                            ? "linear-gradient(135deg, var(--vietnam-yellow) 0%, #FFD700 100%)"
                            : "rgba(0,0,0,0.3)",
                        borderColor:
                          characterAge === "young"
                            ? "var(--vietnam-red)"
                            : "#666",
                        textShadow:
                          characterAge === "young"
                            ? "0 2px 4px rgba(0,0,0,0.5)"
                            : "none",
                        boxShadow:
                          characterAge === "young"
                            ? "0 0 20px rgba(255,235,211,0.6)"
                            : "none",
                      }}
                    >
                      🌱 Tuổi Trẻ (1911-1924)
                    </button>

                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 transition-all duration-300 ${
                        characterAge === "middle"
                          ? "scale-105 shadow-xl"
                          : "hover:scale-105"
                      }`}
                      style={{
                        color:
                          characterAge === "middle"
                            ? "var(--vietnam-red)"
                            : "#999",
                        background:
                          characterAge === "middle"
                            ? "linear-gradient(135deg, var(--vietnam-yellow) 0%, #FFD700 100%)"
                            : "rgba(0,0,0,0.3)",
                        borderColor:
                          characterAge === "middle"
                            ? "var(--vietnam-red)"
                            : "#666",
                        textShadow:
                          characterAge === "middle"
                            ? "0 2px 4px rgba(0,0,0,0.5)"
                            : "none",
                        boxShadow:
                          characterAge === "middle"
                            ? "0 0 20px rgba(255,235,211,0.6)"
                            : "none",
                      }}
                    >
                      🔥 Trung Niên (1924-1933)
                    </button>

                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 transition-all duration-300 ${
                        characterAge === "old"
                          ? "scale-105 shadow-xl"
                          : "hover:scale-105"
                      }`}
                      style={{
                        color:
                          characterAge === "old"
                            ? "var(--vietnam-red)"
                            : "#999",
                        background:
                          characterAge === "old"
                            ? "linear-gradient(135deg, var(--vietnam-yellow) 0%, #FFD700 100%)"
                            : "rgba(0,0,0,0.3)",
                        borderColor:
                          characterAge === "old"
                            ? "var(--vietnam-red)"
                            : "#666",
                        textShadow:
                          characterAge === "old"
                            ? "0 2px 4px rgba(0,0,0,0.5)"
                            : "none",
                        boxShadow:
                          characterAge === "old"
                            ? "0 0 20px rgba(255,235,211,0.6)"
                            : "none",
                      }}
                    >
                      ⭐ Trưởng Thành (1933-1941)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Arrow Buttons */}
        {currentStopIndex > 0 && (
          <button
            onClick={goToPreviousStop}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-30 bg-[var(--vietnam-red)] border-2 border-[var(--vietnam-yellow)] text-[var(--vietnam-yellow)] rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#8a0109] hover:scale-110 transition-all duration-300"
            aria-label="Previous Stop"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}

        {currentStopIndex < journeyStops.length - 1 && (
          <button
            onClick={goToNextStop}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-30 bg-[var(--vietnam-red)] border-2 border-[var(--vietnam-yellow)] text-[var(--vietnam-yellow)] rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#8a0109] hover:scale-110 transition-all duration-300"
            aria-label="Next Stop"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        )}

        {/* Journey Timeline with Vietnam flag theme */}
        <div
          className="backdrop-blur-sm p-6 rounded-3xl border-4 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(218,41,28,0.3) 0%, rgba(139,0,0,0.5) 50%, rgba(218,41,28,0.3) 100%)",
            borderColor: "var(--vietnam-yellow)",
            boxShadow: "0 0 40px rgba(255,235,211,0.3)",
          }}
        >
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="grid grid-cols-8 gap-4 p-4">
              {[...Array(32)].map((_, i) => (
                <svg key={i} className="w-8 h-8" viewBox="0 0 50 50">
                  <polygon
                    points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                    fill="var(--vietnam-yellow)"
                  />
                </svg>
              ))}
            </div>
          </div>

          <h3
            className="text-2xl font-black mb-4 text-center relative z-10"
            style={{
              color: "var(--vietnam-yellow)",
              textShadow: `
                0 0 20px var(--vietnam-yellow),
                2px 2px 6px rgba(0,0,0,0.9)
              `,
              fontFamily: "var(--font-heading)",
            }}
          >
            ⭐ DÒNG THỜI GIAN HÀNH TRÌNH ⭐
          </h3>

          <div className="flex overflow-x-auto space-x-4 pb-4 relative z-10 scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-red-900">
            {journeyStops.map((stop, index) => {
              const isActive = index === currentStopIndex;
              const isPast = index < currentStopIndex;

              return (
                <button
                  key={stop.id}
                  onClick={() => {
                    setSelectedStop(stop);
                    setCurrentStopIndex(index);
                  }}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl border-3 transition-all duration-300 min-w-[200px] relative overflow-hidden ${
                    isActive
                      ? "scale-110 shadow-2xl"
                      : isPast
                      ? "hover:scale-105"
                      : "opacity-50 hover:opacity-75"
                  }`}
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, var(--vietnam-yellow) 0%, #FFD700 100%)"
                      : isPast
                      ? "linear-gradient(135deg, rgba(218,41,28,0.6) 0%, rgba(139,0,0,0.6) 100%)"
                      : "linear-gradient(135deg, rgba(100,100,100,0.3) 0%, rgba(50,50,50,0.3) 100%)",
                    borderWidth: "3px",
                    borderColor: isActive
                      ? "var(--vietnam-red)"
                      : isPast
                      ? "var(--vietnam-yellow)"
                      : "#666",
                    boxShadow: isActive
                      ? "0 0 30px rgba(255,235,211,0.8), inset 0 0 20px rgba(218,41,28,0.3)"
                      : "0 4px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Star decoration for active stop */}
                  {isActive && (
                    <div className="absolute top-1 right-1">
                      <svg
                        className="w-6 h-6 animate-spin-slow"
                        viewBox="0 0 50 50"
                      >
                        <polygon
                          points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                          fill="var(--vietnam-red)"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="text-left relative z-10">
                    <div
                      className="text-xs font-bold mb-1"
                      style={{
                        color: isActive
                          ? "var(--vietnam-red)"
                          : isPast
                          ? "var(--vietnam-yellow)"
                          : "#999",
                      }}
                    >
                      {stop.date}
                    </div>
                    <div
                      className="font-black text-sm mb-1"
                      style={{
                        color: isActive
                          ? "var(--vietnam-red)"
                          : "var(--vietnam-white)",
                        textShadow: isActive
                          ? "0 2px 4px rgba(0,0,0,0.5)"
                          : "none",
                      }}
                    >
                      {stop.city}
                    </div>
                    <div
                      className="text-xs font-semibold"
                      style={{
                        color: isActive
                          ? "var(--vietnam-red)"
                          : isPast
                          ? "rgba(255,235,211,0.8)"
                          : "#666",
                      }}
                    >
                      {stop.country}
                    </div>
                  </div>

                  {/* Progress indicator */}
                  {isPast && !isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--vietnam-yellow)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div
            className="mt-4 h-2 rounded-full overflow-hidden relative"
            style={{
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${
                  ((currentStopIndex + 1) / journeyStops.length) * 100
                }%`,
                background:
                  "linear-gradient(90deg, var(--vietnam-red) 0%, var(--vietnam-yellow) 50%, var(--vietnam-red) 100%)",
                boxShadow: "0 0 20px rgba(255,235,211,0.6)",
              }}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: "var(--vietnam-yellow)" }}
              />
              <span style={{ color: "var(--vietnam-white)" }}>Đang xem</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: "var(--vietnam-red)" }}
              />
              <span style={{ color: "var(--vietnam-white)" }}>Đã qua</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-500" />
              <span style={{ color: "var(--vietnam-white)" }}>Chưa xem</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1Journey;
