import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { geoPath, geoNaturalEarth1 } from "d3-geo";
import * as topojson from "topojson-client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  journeyStops,
  journeyPhases,
  type JourneyStop,
} from "../../data/journeyData";
import HoChiMinhCharacter from "../characters/HoChiMinhCharacter";
import BoatCharacter from "../characters/BoatCharacter";
import SoldierCharacter from "../characters/SoldierCharacter";
import VietnamFlag from "../characters/VietnamFlag";

gsap.registerPlugin(ScrollTrigger);

const Section1Journey = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [, setSelectedStop] = useState<JourneyStop | null>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [characterAge, setCharacterAge] = useState<"young" | "middle" | "old">(
    "young"
  );
  const [characterPosition, setCharacterPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(
    d3.zoomIdentity
  );
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);

  // Function to zoom to a specific stop
  const zoomToStop = (stop: JourneyStop, duration = 1500) => {
    if (!svgRef.current || !zoomRef.current) return;

    const width = mapContainerRef.current?.clientWidth || 975;
    const height = 1000;
    const projection = geoNaturalEarth1()
      .scale(width / 5)
      .translate([width / 2, height / 2.2]);

    const coords = projection(stop.coordinates);
    if (!coords) return;

    // Update character position before zoom
    setCharacterPosition({ x: coords[0], y: coords[1] });

    const scale = 3; // Zoom level
    const translate: [number, number] = [
      width / 2 - scale * coords[0],
      height / 2 - scale * coords[1],
    ];

    const transform = d3.zoomIdentity
      .translate(translate[0], translate[1])
      .scale(scale);

    // Update zoom transform state
    setZoomTransform(transform);

    d3.select(svgRef.current)
      .transition()
      .duration(duration)
      .call(zoomRef.current.transform, transform)
      .on("end", () => {
        // Ensure transform is set after animation
        setZoomTransform(transform);
      });
  };

  // Auto-play journey function
  const playJourney = () => {
    if (!svgRef.current) return;

    // Hide intro first
    setShowIntro(false);

    // Wait for intro to fade out
    setTimeout(() => {
      setIsAutoPlaying(true);

      // Initialize character position at first stop
      const width = mapContainerRef.current?.clientWidth || 975;
      const height = 1000;
      const projection = geoNaturalEarth1()
        .scale(width / 5)
        .translate([width / 2, height / 2.2]);
      const firstCoords = projection(journeyStops[0].coordinates);
      if (firstCoords) {
        setCharacterPosition({ x: firstCoords[0], y: firstCoords[1] });
      }

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

          // Calculate character position based on map projection
          const width = mapContainerRef.current?.clientWidth || 975;
          const height = 1000;
          const projection = geoNaturalEarth1()
            .scale(width / 5)
            .translate([width / 2, height / 2.2]);

          const coords = projection(stop.coordinates);
          if (coords) {
            setCharacterPosition({ x: coords[0], y: coords[1] });
          }

          zoomToStop(stop, 2000);

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

        // Wait at each stop
        tl.to({}, { duration: 3 });
      });

      timelineRef.current = tl;
    }, 800);
  };

  // Victory sequence animation
  const showVictorySequence = () => {
    // Implement Dien Bien Phu victory animation
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

  useEffect(() => {
    if (!svgRef.current || !mapContainerRef.current) return;

    const width = mapContainerRef.current.clientWidth;
    const height = 1000; // Increased from 800 to 1000 for more space

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
        g.attr("stroke-width", 1 / event.transform.k);
        // Update text sizes dynamically based on zoom
        g.selectAll(".marker text").attr(
          "font-size",
          `${11 / event.transform.k}px`
        );
        // Update zoom transform for character positioning
        setZoomTransform(event.transform);
      });

    zoomRef.current = zoom;

    // Create projection with more scale for better spacing
    const projection = geoNaturalEarth1()
      .scale(width / 5) // Changed from width/6 to width/5 for larger map
      .translate([width / 2, height / 2.2]);

    projectionRef.current = projection;

    const path = geoPath().projection(projection);

    // Create background
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#0a1929")
      .on("click", () => {
        // Reset zoom on background click
        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
        setSelectedStop(null);
      });

    const g = svg.append("g");

    // Load and draw world map from TopoJSON
    fetch("/world-110m.json")
      .then((response) => response.json())
      .then((world) => {
        const countries = topojson.feature(world, world.objects.countries);

        g.append("g")
          .attr("class", "countries")
          .selectAll("path")
          // @ts-expect-error - GeoJSON features types
          .data(countries.features)
          .join("path")
          // @ts-expect-error - D3 geoPath types
          .attr("d", path)
          .attr("fill", "#1a3a52")
          .attr("stroke", "#2d5a7b")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.8)
          .attr("cursor", "pointer")
          .on("mouseenter", function () {
            d3.select(this).attr("fill", "#2a4a62");
          })
          .on("mouseleave", function () {
            d3.select(this).attr("fill", "#1a3a52");
          });

        // Draw country borders
        g.append("path")
          .datum(
            topojson.mesh(world, world.objects.countries, (a, b) => a !== b)
          )
          .attr("class", "country-borders")
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "#4a6a8b")
          .attr("stroke-width", 0.5)
          .attr("stroke-linejoin", "round");

        // Draw journey path
        const lineGenerator = d3
          .line<JourneyStop>()
          .x((d) => projection(d.coordinates)?.[0] ?? 0)
          .y((d) => projection(d.coordinates)?.[1] ?? 0)
          .curve(d3.curveCatmullRom.alpha(0.5));

        const journeyPath = g
          .append("path")
          .datum(journeyStops)
          .attr("class", "journey-path")
          .attr("d", lineGenerator)
          .attr("fill", "none")
          .attr("stroke", "#fbbf24")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "5,5")
          .attr("opacity", 0.8);

        // Add animated character that moves along the path
        // Character animations will be handled separately

        // Add markers for each stop
        const markersGroup = g.append("g").attr("class", "markers");

        journeyStops.forEach((stop, index) => {
          const coords = projection(stop.coordinates);
          if (!coords) return;

          const markerGroup = markersGroup
            .append("g")
            .attr("class", `marker marker-${index}`)
            .attr("transform", `translate(${coords[0]}, ${coords[1]})`)
            .style("cursor", "pointer")
            .on("click", (event: MouseEvent) => {
              event.stopPropagation();
              setSelectedStop(stop);
              zoomToStop(stop);
            })
            .on("mouseenter", function () {
              d3.select(this)
                .select("circle.main-marker")
                .transition()
                .duration(200)
                .attr("r", 10);
            })
            .on("mouseleave", function () {
              d3.select(this)
                .select("circle.main-marker")
                .transition()
                .duration(200)
                .attr("r", 6);
            });

          // Pulsing background circle
          markerGroup
            .append("circle")
            .attr("r", 15)
            .attr(
              "fill",
              journeyPhases.find((p) => p.stops.includes(stop.id))?.color ||
                "#fbbf24"
            )
            .attr("opacity", 0.2)
            .attr("class", "pulse-circle");

          // Main marker circle
          markerGroup
            .append("circle")
            .attr("class", "main-marker")
            .attr("r", 6)
            .attr(
              "fill",
              journeyPhases.find((p) => p.stops.includes(stop.id))?.color ||
                "#fbbf24"
            )
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

          // Label with better positioning based on region
          const labelGroup = markerGroup
            .append("g")
            .attr("class", `label-group label-${index}`)
            .attr("data-stop-index", index);

          // Add background for better readability
          const labelText = stop.city;
          const labelBBox = { width: labelText.length * 7, height: 14 };

          labelGroup
            .append("rect")
            .attr("class", "label-bg")
            .attr("x", -labelBBox.width / 2)
            .attr("y", -30)
            .attr("width", labelBBox.width)
            .attr("height", labelBBox.height)
            .attr("fill", "rgba(0, 0, 0, 0.7)")
            .attr("rx", 3);

          labelGroup
            .append("text")
            .attr("class", "label-text")
            .attr("dy", -20)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .text(labelText);
        });

        // Animate journey path on load
        const pathLength =
          (journeyPath.node() as SVGPathElement)?.getTotalLength() || 0;

        journeyPath
          .attr("stroke-dasharray", `${pathLength} ${pathLength}`)
          .attr("stroke-dashoffset", pathLength);

        gsap.to(journeyPath.node(), {
          strokeDashoffset: 0,
          duration: 4,
          ease: "power2.inOut",
          delay: 0.5,
        });

        // Pulse animation for markers
        gsap.to(".pulse-circle", {
          attr: { r: 20 },
          opacity: 0,
          duration: 2,
          repeat: -1,
          stagger: 0.2,
          ease: "power2.out",
        });
      })
      .catch((error) => {
        console.error("Error loading world map:", error);

        // Fallback: Draw simplified map
        const graticule = d3.geoGraticule();
        g.append("path")
          .datum(graticule)
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "#1e3a5f")
          .attr("stroke-width", 0.5);
      });

    svg.call(zoom);

    // GSAP Animations
    const ctx = gsap.context(() => {
      gsap.from(".journey-title", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(".phase-card", {
        scrollTrigger: {
          trigger: ".phases-container",
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.4)",
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Effect to update label visibility when currentStopIndex changes
  useEffect(() => {
    // Add/remove class on body for CSS styling
    if (isAutoPlaying) {
      document.body.classList.add("auto-playing");
    } else {
      document.body.classList.remove("auto-playing");
    }

    if (!isAutoPlaying) {
      // Reset all labels to default state when not playing
      d3.selectAll(".label-group")
        .classed("active-label", false)
        .style("opacity", 0.6)
        .style("pointer-events", "auto");

      // Reset all label styles
      d3.selectAll(".label-bg")
        .attr("fill", "rgba(0, 0, 0, 0.7)")
        .attr("stroke", "none")
        .attr("stroke-width", 0);

      d3.selectAll(".label-text")
        .attr("fill", "#fff")
        .attr("font-size", "11px")
        .attr("font-weight", "bold");

      return;
    }

    // Hide all labels and remove active class
    d3.selectAll(".label-group")
      .classed("active-label", false)
      .transition()
      .duration(300)
      .style("opacity", 0.15)
      .style("pointer-events", "none");

    // Make visited stops slightly more visible
    for (let i = 0; i <= currentStopIndex; i++) {
      d3.select(`.label-${i}`).transition().duration(300).style("opacity", 0.3);
    }

    // Highlight current stop label - make it prominent
    const currentLabel = d3.select(`.label-${currentStopIndex}`);

    currentLabel
      .classed("active-label", true)
      .raise() // Bring to front
      .transition()
      .duration(500)
      .style("opacity", 1)
      .style("pointer-events", "auto");

    // Scale up the label background and text
    currentLabel
      .select(".label-bg")
      .transition()
      .duration(500)
      .attr("fill", "rgba(251, 191, 36, 0.95)") // Golden yellow
      .attr("stroke", "#fbbf24")
      .attr("stroke-width", 2);

    currentLabel
      .select(".label-text")
      .transition()
      .duration(500)
      .attr("fill", "#000")
      .attr("font-size", "13px")
      .attr("font-weight", "900");

    // Reset other labels' styles
    d3.selectAll(`.label-group:not(.label-${currentStopIndex}) .label-bg`)
      .transition()
      .duration(300)
      .attr("fill", "rgba(0, 0, 0, 0.7)")
      .attr("stroke", "none")
      .attr("stroke-width", 0);

    d3.selectAll(`.label-group:not(.label-${currentStopIndex}) .label-text`)
      .transition()
      .duration(300)
      .attr("fill", "#fff")
      .attr("font-size", "11px")
      .attr("font-weight", "bold");

    // Also make current marker more visible
    d3.selectAll(".marker .main-marker")
      .transition()
      .duration(300)
      .attr("r", 6)
      .attr("stroke-width", 2);

    d3.select(`.marker-${currentStopIndex} .main-marker`)
      .transition()
      .duration(500)
      .attr("r", 14)
      .attr("stroke-width", 4);
  }, [currentStopIndex, isAutoPlaying]);

  return (
    <section
      id="section-1"
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20 px-4 relative overflow-hidden"
    >
      {/* Decorative stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Intro Screen */}
      {showIntro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-red-900/95 to-slate-900/95 backdrop-blur-md">
          <div className="text-center max-w-5xl px-8 space-y-8 animate-fade-in">
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-400 to-yellow-300 mb-8 animate-pulse-slow">
              Hành trình cứu nước
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-200 mb-6">
              của Bác Hồ
            </h2>

            {/* Visual Story Section */}
            <div className="my-12 relative">
              {/* Animated Boat and Character Scene */}
              <div className="flex justify-center items-end mb-8">
                <svg
                  width="600"
                  height="300"
                  viewBox="0 0 600 300"
                  className="intro-scene"
                >
                  {/* Ocean waves */}
                  <defs>
                    <linearGradient
                      id="oceanGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>

                  {/* Waves */}
                  <path
                    d="M0,200 Q50,180 100,200 T200,200 T300,200 T400,200 T500,200 T600,200 L600,300 L0,300 Z"
                    fill="url(#oceanGradient)"
                    opacity="0.8"
                    className="wave-animation"
                  />
                  <path
                    d="M0,220 Q50,210 100,220 T200,220 T300,220 T400,220 T500,220 T600,220 L600,300 L0,300 Z"
                    fill="url(#oceanGradient)"
                    opacity="0.6"
                    className="wave-animation-2"
                  />

                  {/* Boat with Character */}
                  <g className="boat-scene" transform="translate(250, 150)">
                    <BoatCharacter y={0} scale={1.5} />
                    {/* Young Ho Chi Minh standing on boat */}
                    <g transform="translate(0, -40)">
                      <HoChiMinhCharacter age="young" scale={1.3} />
                    </g>
                  </g>

                  {/* Nha Rong Wharf text */}
                  <text
                    x="300"
                    y="150"
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    ⚓ Bến Nhà Rồng, 5/6/1911
                  </text>
                </svg>
              </div>

              {/* Story Text */}
              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 border border-yellow-400/30 max-w-3xl mx-auto">
                <p className="text-xl md:text-2xl text-blue-100 mb-4 leading-relaxed">
                  Năm 1911, thanh niên{" "}
                  <span className="text-yellow-300 font-bold">
                    Nguyễn Tất Thành
                  </span>{" "}
                  21 tuổi
                  <br />
                  lên chiếc tàu{" "}
                  <span className="text-yellow-300 font-bold">
                    Amiral de Latouche-Tréville
                  </span>
                </p>
                <p className="text-lg text-blue-200 mb-4">
                  rời Bến Nhà Rồng, Sài Gòn
                </p>
                <p className="text-xl text-yellow-200 font-semibold">
                  Khởi đầu 30 năm đi tìm đường cứu nước
                </p>
              </div>
            </div>

            {/* Journey Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
              <div className="bg-blue-900/40 backdrop-blur-md rounded-xl p-4 border border-blue-400/30">
                <p className="text-3xl font-bold text-yellow-300">30</p>
                <p className="text-sm text-blue-200">Năm tìm đường</p>
              </div>
              <div className="bg-blue-900/40 backdrop-blur-md rounded-xl p-4 border border-blue-400/30">
                <p className="text-3xl font-bold text-yellow-300">20</p>
                <p className="text-sm text-blue-200">Điểm dừng</p>
              </div>
              <div className="bg-blue-900/40 backdrop-blur-md rounded-xl p-4 border border-blue-400/30">
                <p className="text-3xl font-bold text-yellow-300">6</p>
                <p className="text-sm text-blue-200">Châu lục</p>
              </div>
            </div>

            {/* Call to Action */}
            <button
              onClick={() => {
                setShowIntro(false);
                setTimeout(() => playJourney(), 500);
              }}
              className="mt-8 px-10 p-6 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500 hover:from-yellow-600 hover:via-red-600 hover:to-yellow-600 text-white text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce-slow"
            >
              Bắt đầu hành trình
            </button>
            <p className="text-sm text-blue-300/70 mt-4">
              Nhấn để xem hành trình tự động qua các điểm dừng
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-[1600px] relative z-10">
        {/* Auto-play button */}
        <div className="absolute top-4 right-4 z-20">
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

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-8 border border-blue-500/20 mb-6 relative"
          style={{ minHeight: "1050px" }}
        >
          <svg ref={svgRef} className="w-full h-auto" />

          {/* Character overlay - Hiển thị ở vị trí chính xác trên bản đồ */}
          {isAutoPlaying &&
            currentStopIndex >= 0 &&
            currentStopIndex < journeyStops.length &&
            characterPosition && (
              <div
                className="absolute pointer-events-none z-30 transition-all duration-1000 ease-in-out"
                style={{
                  left: `${
                    characterPosition.x * zoomTransform.k + zoomTransform.x
                  }px`,
                  top: `${
                    characterPosition.y * zoomTransform.k + zoomTransform.y
                  }px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <svg
                  width={120 / Math.sqrt(zoomTransform.k)}
                  height={120 / Math.sqrt(zoomTransform.k)}
                  viewBox="-60 -60 120 120"
                >
                  {currentStopIndex === 0 ? (
                    <>
                      <HoChiMinhCharacter
                        age={characterAge}
                        scale={1}
                        className="character-animation"
                      />
                      <BoatCharacter
                        y={50}
                        scale={0.6}
                        className="boat-animation"
                      />
                    </>
                  ) : (
                    <HoChiMinhCharacter
                      age={characterAge}
                      scale={1}
                      className="character-animation"
                    />
                  )}
                </svg>
              </div>
            )}

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
                    x={350}
                    y={200}
                    scale={1.3}
                    className="victory-soldier"
                  />
                </g>
              </svg>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {journeyPhases.map((phase, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
                <span className="text-xs text-blue-100">
                  {phase.phase.split(":")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Info Bar - Thay thế popup */}
        {isAutoPlaying &&
          currentStopIndex >= 0 &&
          journeyStops[currentStopIndex] && (
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-900/95 via-slate-800/95 to-transparent backdrop-blur-md border-t border-yellow-400/30 p-6">
              <div className="container mx-auto max-w-[1600px]">
                <div className="flex items-start gap-6">
                  {/* Image section */}
                  {journeyStops[currentStopIndex].imageUrl && (
                    <div className="flex-shrink-0 w-48 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-yellow-400/30">
                      <img
                        src={journeyStops[currentStopIndex].imageUrl}
                        alt={journeyStops[currentStopIndex].location}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails
                          e.currentTarget.src = `https://via.placeholder.com/300x300/1a3a52/fbbf24?text=${encodeURIComponent(
                            journeyStops[currentStopIndex].city
                          )}`;
                        }}
                      />
                    </div>
                  )}

                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg"
                    style={{
                      backgroundColor: journeyPhases.find((p) =>
                        p.stops.includes(journeyStops[currentStopIndex].id)
                      )?.color,
                    }}
                  >
                    {journeyStops[currentStopIndex].id}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-baseline gap-4 mb-2">
                      <h3 className="text-3xl font-bold text-yellow-300">
                        {journeyStops[currentStopIndex].location}
                      </h3>
                      <p className="text-blue-200 text-lg">
                        {journeyStops[currentStopIndex].date}
                      </p>
                    </div>
                    <p className="text-white font-medium text-lg mb-2">
                      {journeyStops[currentStopIndex].event}
                    </p>
                    <p className="text-blue-100 text-base leading-relaxed mb-2">
                      {journeyStops[currentStopIndex].details}
                    </p>
                    {journeyStops[currentStopIndex].historicalContext && (
                      <p className="text-blue-300 text-sm italic mt-2 border-l-2 border-yellow-400 pl-3">
                        {journeyStops[currentStopIndex].historicalContext}
                      </p>
                    )}
                    {journeyStops[currentStopIndex].alias && (
                      <p className="text-yellow-200 text-sm mt-2">
                        {journeyStops[currentStopIndex].alias}
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-blue-300 text-sm mb-1">Tiến độ</p>
                    <p className="text-yellow-300 text-2xl font-bold">
                      {currentStopIndex + 1} / {journeyStops.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        {/* Journey Phases Timeline */}
        <div className="phases-container mt-16">
          <h3 className="text-3xl font-bold text-center text-yellow-300 mb-8">
            Các Giai Đoạn Hành Trình
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {journeyPhases.map((phase, index) => (
              <div
                key={index}
                className="phase-card group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl p-6 border-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ borderColor: phase.color }}
                onClick={() => setCurrentPhase(index)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg"
                    style={{ backgroundColor: phase.color }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xl font-bold text-yellow-300 mb-2 group-hover:text-yellow-200 transition-colors">
                      {phase.phase}
                    </h4>
                    <p className="text-blue-200 text-sm mb-3">
                      {phase.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.stops.map((stopId) => {
                        const stop = journeyStops.find((s) => s.id === stopId);
                        return stop ? (
                          <span
                            key={stopId}
                            className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded-full"
                          >
                            {stop.city}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes animate-fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes animate-pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes animate-bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes wave-motion {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes wave-motion-2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        /* Label styles */
        .label-group {
          transition: opacity 0.5s ease, transform 0.3s ease;
          pointer-events: auto;
          cursor: pointer;
        }

        .label-group .label-bg {
          transition: all 0.5s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .label-group .label-text {
          transition: all 0.5s ease;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        /* Hover effect when not auto-playing */
        .label-group:hover:not(.active-label) .label-bg {
          fill: rgba(251, 191, 36, 0.8) !important;
          filter: drop-shadow(0 4px 8px rgba(251, 191, 36, 0.4));
        }

        .label-group:hover:not(.active-label) .label-text {
          fill: #000 !important;
          font-size: 12px !important;
        }

        /* Active label - prominently displayed */
        .label-group.active-label {
          opacity: 1 !important;
          z-index: 1000;
        }

        .label-group.active-label .label-bg {
          filter: drop-shadow(0 4px 12px rgba(251, 191, 36, 0.6));
          animation: label-pulse 2s ease-in-out infinite;
        }

        @keyframes label-pulse {
          0%, 100% {
            filter: drop-shadow(0 4px 12px rgba(251, 191, 36, 0.6));
          }
          50% {
            filter: drop-shadow(0 6px 20px rgba(251, 191, 36, 0.9));
          }
        }

        /* Make non-active labels much more transparent during autoplay */
        .label-group:not(.active-label) {
          opacity: 0.2;
        }
        
        /* But when not autoplaying, show all labels with moderate opacity */
        body:not(.auto-playing) .label-group {
          opacity: 0.6 !important;
        }
        
        body:not(.auto-playing) .label-group:hover {
          opacity: 1 !important;
        }

        .animate-fade-in {
          animation: animate-fade-in 1s ease-out;
        }

        .animate-pulse-slow {
          animation: animate-pulse-slow 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: animate-bounce-slow 2s ease-in-out infinite;
        }

        .wave-animation {
          animation: wave-motion 3s ease-in-out infinite;
          transform-origin: center;
        }

        .wave-animation-2 {
          animation: wave-motion-2 3s ease-in-out infinite 0.5s;
          transform-origin: center;
        }

        .boat-scene {
          animation: float 4s ease-in-out infinite;
        }

        .intro-scene {
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
        }

        .character-animation {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .boat-animation {
          animation: sway 2s ease-in-out infinite;
        }

        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        .victory-soldier {
          animation: celebrate 1s ease-in-out infinite;
        }

        @keyframes celebrate {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-5px) scale(1.05); }
          75% { transform: translateY(-3px) scale(0.95); }
        }
      `}</style>
    </section>
  );
};

export default Section1Journey;
