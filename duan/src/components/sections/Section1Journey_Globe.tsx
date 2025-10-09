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

  // Handle start overlay - play music on first interaction
  const handleStartExperience = () => {
    setShowStartOverlay(false);
    
    // Play audio after user interaction
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch(error => {
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
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(error => console.log("Play failed:", error));
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
            stopAudioRef.current.play().catch(error => {
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
      className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 px-4 relative overflow-hidden"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 overflow-hidden">
          {/* Background Music - Play once only */}
          <audio ref={audioRef} src={introSound} />
          
          {/* Start Experience Overlay */}
          {showStartOverlay && (
            <div 
              className="fixed inset-0 z-[70] flex items-center justify-center cursor-pointer"
              style={{ 
                background: 'linear-gradient(135deg, rgba(115, 1, 9, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)'
              }}
              onClick={handleStartExperience}
            >
              <div className="text-center space-y-8 px-8 animate-pulse">
                {/* Large Vietnam Star */}
                <div className="flex justify-center mb-6">
                  <svg className="w-32 h-32 animate-spin-slow" viewBox="0 0 50 50">
                    <polygon
                      points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                      fill="var(--vietnam-yellow)"
                      style={{ filter: 'drop-shadow(0 0 20px var(--vietnam-yellow))' }}
                    />
                  </svg>
                </div>
                
                {/* Text */}
                <div className="space-y-4">
                  <h2 
                    className="text-5xl md:text-7xl font-black"
                    style={{ 
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--vietnam-yellow)',
                      textShadow: '0 0 30px rgba(255, 235, 211, 0.5)'
                    }}
                  >
                    NHẤN ĐỂ BẮT ĐẦU
                  </h2>
                  
                  <p 
                    className="text-xl md:text-2xl"
                    style={{ 
                      fontFamily: 'var(--font-body)',
                      color: 'var(--vietnam-white)',
                      opacity: 0.9
                    }}
                  >
                    Click anywhere to start the journey
                  </p>
                  
                  {/* Click icon */}
                  <div className="mt-8 flex justify-center">
                    <svg className="w-16 h-16 animate-bounce" fill="var(--vietnam-yellow)" viewBox="0 0 24 24">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
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
              <svg className="w-6 h-6" fill="var(--vietnam-yellow)" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="var(--vietnam-yellow)" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            )}
          </button>
          
          {/* Vietnam Flag Background */}
          <VietnamFlagBackground />
          
          {/* Content Container */}
          <div className="relative z-10 text-center space-y-8 px-8 max-w-7xl mx-auto">
            {/* Hero Image Section */}
            <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 shadow-2xl"
                     style={{ borderColor: 'var(--vietnam-yellow)' }}>
                  <img 
                    src={bhCopy4}
                    alt="Khởi hành năm 1911"
                    className="w-full h-full object-cover object-center"
                    style={{ 
                      filter: 'contrast(110%) brightness(105%) saturate(95%)',
                      objectPosition: 'center center'
                    }}
                  />
                </div>
                
                {/* Decorative ring around image */}
                <div className="absolute inset-0 rounded-full border-2 border-opacity-30 animate-pulse"
                     style={{ borderColor: 'var(--vietnam-yellow)' }}></div>
                
                {/* Floating star decorations */}
                <div className="absolute -top-4 -right-4">
                  <svg className="w-12 h-12 animate-pulse" viewBox="0 0 50 50">
                    <polygon
                      points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                      fill="var(--vietnam-yellow)"
                      style={{ filter: 'drop-shadow(0 0 8px var(--vietnam-yellow))' }}
                    />
                  </svg>
                </div>
                
                <div className="absolute -bottom-2 -left-4">
                  <svg className="w-8 h-8 animate-pulse" viewBox="0 0 50 50" style={{ animationDelay: '1s' }}>
                    <polygon
                      points="25,5 29.4,18.1 42.5,18.1 32.1,25.8 36.8,40.5 25,32.5 13.2,40.5 17.9,25.8 7.5,18.1 20.6,18.1"
                      fill="var(--vietnam-yellow)"
                      style={{ filter: 'drop-shadow(0 0 6px var(--vietnam-yellow))' }}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 
                className="text-7xl md:text-9xl font-black animate-shimmer animate-fade-in-up"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  animationDelay: '0.5s',
                  fontSize: 'clamp(4rem, 15vw, 8rem)'
                }}
              >
                1911
              </h1>
              <div className="w-32 h-1 mx-auto rounded-full animate-fade-in-up" 
                   style={{ 
                     background: 'linear-gradient(90deg, var(--vietnam-red), var(--vietnam-yellow), var(--vietnam-red))',
                     animationDelay: '1s'
                   }}>
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-6">
              <h2 
                className="text-3xl md:text-5xl font-bold text-white animate-fade-in-up leading-tight"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  animationDelay: '1.5s',
                  textShadow: '2px 2px 4px rgba(115, 1, 9, 0.8)'
                }}
              >
                HÀNH TRÌNH TÌM ĐƯỜNG CỨU NƯỚC
              </h2>
              
              {/* Quote from Ho Chi Minh */}
              <blockquote className="animate-fade-in-up" style={{ animationDelay: '1.8s' }}>
                <p 
                  className="text-lg md:text-xl italic font-medium leading-relaxed"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--vietnam-yellow)',
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  "Tôi đi tìm đường cứu nước"
                </p>
                <cite className="text-sm opacity-80 mt-2 block" style={{ color: 'var(--vietnam-white)' }}>
                  - Nguyễn Tất Thành, 1911
                </cite>
              </blockquote>
              
              <p 
                className="text-xl md:text-2xl animate-fade-in-up"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--vietnam-yellow)',
                  animationDelay: '2s',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
                }}
              >
                30 năm • 20 quốc gia • 6 châu lục
              </p>
            </div>

            {/* Character and Boat Animation - Smaller */}
            <div className="flex justify-center items-center py-4 animate-fade-in-up" style={{ animationDelay: '2.5s' }}>
              <div className="relative">
                <svg width="300" height="150" viewBox="0 0 300 150" className="drop-shadow-xl">
                  {/* Stylized ocean waves */}
                  <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: 'var(--vietnam-red)', stopOpacity: 0.4 }} />
                      <stop offset="50%" style={{ stopColor: 'var(--vietnam-yellow)', stopOpacity: 0.6 }} />
                      <stop offset="100%" style={{ stopColor: 'var(--vietnam-red)', stopOpacity: 0.4 }} />
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
                  <circle cx="60" cy="30" r="1.5" fill="var(--vietnam-yellow)" opacity="0.8" className="animate-pulse" />
                  <circle cx="240" cy="40" r="1" fill="var(--vietnam-yellow)" opacity="0.6" className="animate-pulse" style={{ animationDelay: '1s' }} />
                </svg>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="animate-fade-in-up" style={{ animationDelay: '3s', transform: 'translateY(-10px)',  }}>
              <button
                onClick={playJourney}
                className="group relative px-12 py-4 font-bold text-xl rounded-full shadow-2xl hover:scale-110 transition-all duration-300 overflow-hidden mb-8"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  background: `linear-gradient(135deg, var(--vietnam-red) 0%, #8B0000 50%, var(--vietnam-red) 100%)`,
                  color: 'var(--vietnam-yellow)',
                  border: `2px solid var(--vietnam-yellow)`,
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span>🚢</span>
                  BẮT ĐẦU HÀNH TRÌNH
                  <span>⭐</span>
                </span>
                
                {/* Button hover effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, var(--vietnam-yellow) 0%, #FFD700 50%, var(--vietnam-yellow) 100%)`
                  }}
                ></div>
              </button>
              
              {/* Subtitle under button */}
              <p 
                className="text-sm opacity-80"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--vietnam-yellow)'
                }}
              >
                Khám phá 30 năm tìm đường cứu nước của Chủ tịch Hồ Chí Minh
              </p>
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-8 left-8 w-16 h-16 opacity-20">
            <VietnamFlag x={0} y={0} scale={0.8} waving={true} />
          </div>
          <div className="absolute top-8 right-8 w-16 h-16 opacity-20">
            <VietnamFlag x={0} y={0} scale={0.8} waving={true} />
          </div>
          <div className="absolute bottom-8 left-8 w-16 h-16 opacity-20">
            <VietnamFlag x={0} y={0} scale={0.8} waving={true} />
          </div>
          <div className="absolute bottom-8 right-8 w-16 h-16 opacity-20">
            <VietnamFlag x={0} y={0} scale={0.8} waving={true} />
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
          <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none px-4">
            <div
              className={`bg-gradient-to-br from-slate-800/98 to-blue-900/98 backdrop-blur-xl p-8 rounded-3xl border-2 border-blue-500/30 shadow-2xl max-w-6xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto ${
                isTransitioning ? "animate-scale-down" : "animate-scale-up"
              }`}
            >
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
                className="absolute top-4 right-4 text-blue-200 hover:text-white bg-blue-900/50 hover:bg-blue-800/80 rounded-full p-2 transition-all duration-300 z-10"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
                  <span className="text-yellow-400 font-bold text-base">
                    Điểm dừng {currentStopIndex + 1}/{journeyStops.length}
                  </span>
                  <span className="text-blue-300 text-base">
                    {selectedStop.date}
                  </span>
                  {selectedStop.alias && (
                    <span className="text-orange-400 text-base italic">
                      "{selectedStop.alias}"
                    </span>
                  )}
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 mb-3">
                  {selectedStop.location}
                </h3>
                <p className="text-2xl text-blue-200 font-semibold">
                  {selectedStop.city}, {selectedStop.country}
                </p>
              </div>

              {/* Content Grid - 2 Columns */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Image */}
                {selectedStop.imageUrl && (
                  <div className="flex items-start">
                    <div className="relative w-full">
                      <img
                        src={selectedStop.imageUrl}
                        alt={selectedStop.location}
                        className="rounded-2xl shadow-2xl border-4 border-blue-500/30 w-full object-cover"
                        style={{ maxHeight: "300px" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Right Column - Content */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-4 rounded-2xl border border-yellow-500/30">
                    <h4 className="text-yellow-300 font-bold text-lg mb-2 flex items-center">
                      <span className="mr-2 text-xl">📍</span> Sự kiện
                    </h4>
                    <p className="text-blue-100 text-base leading-relaxed">
                      {selectedStop.event}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-2xl border border-blue-500/30">
                    <h4 className="text-blue-300 font-bold text-lg mb-2 flex items-center">
                      <span className="mr-2 text-xl">📖</span> Chi tiết
                    </h4>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      {selectedStop.details}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-2xl border border-purple-500/30">
                    <h4 className="text-purple-300 font-bold text-lg mb-2 flex items-center">
                      <span className="mr-2 text-xl">⭐</span> Ý nghĩa
                    </h4>
                    <p className="text-purple-200 text-sm leading-relaxed">
                      {selectedStop.significance}
                    </p>
                  </div>

                  {selectedStop.historicalContext && (
                    <div className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 p-4 rounded-2xl border border-indigo-500/30">
                      <h4 className="text-indigo-300 font-bold text-lg mb-2 flex items-center">
                        <span className="mr-2 text-xl">🌏</span> Bối cảnh
                      </h4>
                      <p className="text-blue-200 text-sm leading-relaxed">
                        {selectedStop.historicalContext}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Character Age Indicator */}
              <div className="flex items-center justify-center space-x-3 pt-6 mt-6 border-t border-blue-500/20">
                <span className="text-blue-300 text-sm font-semibold">
                  Giai đoạn:
                </span>
                <div className="flex space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      characterAge === "young"
                        ? "bg-green-500/30 text-green-300 border-2 border-green-500"
                        : "bg-gray-700/30 text-gray-400 border border-gray-600"
                    }`}
                  >
                    Trẻ
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      characterAge === "middle"
                        ? "bg-blue-500/30 text-blue-300 border-2 border-blue-500"
                        : "bg-gray-700/30 text-gray-400 border border-gray-600"
                    }`}
                  >
                    Trung niên
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      characterAge === "old"
                        ? "bg-purple-500/30 text-purple-300 border-2 border-purple-500"
                        : "bg-gray-700/30 text-gray-400 border border-gray-600"
                    }`}
                  >
                    Trưởng thành
                  </span>
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
