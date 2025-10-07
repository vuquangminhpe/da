import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import type { JourneyStop } from "../../data/journeyData";

interface Globe3DProps {
  currentStopIndex: number;
  journeyStops: JourneyStop[];
  isAutoPlaying: boolean;
  onStopClick?: (stop: JourneyStop) => void;
}

// Convert lat/lon to 3D coordinates
const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

// Earth component
function Earth({
  journeyStops,
  currentStopIndex,
  isAutoPlaying,
}: Globe3DProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Load Earth texture
  const earthTexture = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    // Using a public CDN Earth texture
    loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
      (texture) => {
        earthTexture.current = texture;
        if (earthRef.current) {
          (earthRef.current.material as THREE.MeshStandardMaterial).map =
            texture;
          (
            earthRef.current.material as THREE.MeshStandardMaterial
          ).needsUpdate = true;
        }
      }
    );
  }, []);

  // Rotate earth slowly when not auto-playing
  useFrame(() => {
    if (groupRef.current && !isAutoPlaying) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Camera and Earth rotation animation to current stop
  useEffect(() => {
    if (!isAutoPlaying || currentStopIndex < 0 || !groupRef.current) return;

    const stop = journeyStops[currentStopIndex];
    const [lon, lat] = stop.coordinates;

    // FIX: Calculate rotation to FACE the location (front view, not back)
    // We need to rotate so the location faces the camera (positive Z axis)
    const targetRotationY = (lon * Math.PI) / 180; // Changed from negative
    const targetRotationX = -(lat * Math.PI) / 180; // Changed sign

    // Animate Earth rotation
    const startRotationY = groupRef.current.rotation.y;
    const startRotationX = groupRef.current.rotation.x;

    // Camera zoom closer
    const startCameraZ = camera.position.z;
    const targetCameraZ = 5.5; // Closer zoom for better view

    const startTime = Date.now();
    const duration = 2000; // 2 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease in-out
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Rotate Earth to face location (FRONT view)
      if (groupRef.current) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          startRotationY,
          targetRotationY,
          eased
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          startRotationX,
          targetRotationX * 0.3, // Gentle vertical tilt
          eased
        );
      }

      // Zoom camera
      camera.position.z = THREE.MathUtils.lerp(
        startCameraZ,
        targetCameraZ,
        eased
      );
      camera.lookAt(0, 0, 0);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [currentStopIndex, isAutoPlaying, journeyStops, camera]);

  return (
    <group ref={groupRef}>
      {/* Earth sphere with real map texture - LARGER */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[3, 128, 128]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.01}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Journey markers with labels */}
      {journeyStops.map((stop, index) => {
        const [lon, lat] = stop.coordinates;
        const position = latLonToVector3(lat, lon, 3.08); // Updated for larger radius
        const isActive = index === currentStopIndex;
        const isVisited = index < currentStopIndex;
        const shouldShowLabel = isActive || isVisited; // Show labels for active and visited

        return (
          <group key={stop.id} position={position}>
            {/* Marker pin - LARGER */}
            <mesh>
              <sphereGeometry args={[isActive ? 0.12 : 0.06, 16, 16]} />
              <meshStandardMaterial
                color={isActive ? "#fbbf24" : isVisited ? "#60a5fa" : "#94a3b8"}
                emissive={
                  isActive ? "#fbbf24" : isVisited ? "#3b82f6" : "#000000"
                }
                emissiveIntensity={isActive ? 2.5 : isVisited ? 1.2 : 0}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Pulsing rings for active marker - LARGER */}
            {isActive && (
              <>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.15, 0.2, 32]} />
                  <meshBasicMaterial
                    color="#fbbf24"
                    transparent
                    opacity={0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Second ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.22, 0.26, 32]} />
                  <meshBasicMaterial
                    color="#fbbf24"
                    transparent
                    opacity={0.5}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </>
            )}

            {/* HTML Label - MUCH LARGER text */}
            {shouldShowLabel && (
              <Html
                position={[0, 0.35, 0]}
                center
                distanceFactor={4} // Increased for larger labels
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                <div
                  className={`px-6 py-3 rounded-xl font-black whitespace-nowrap shadow-2xl transition-all duration-300 ${
                    isActive
                      ? "text-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-4 border-yellow-300 scale-125"
                      : "text-lg bg-blue-900/90 text-blue-200 border-2 border-blue-500/50 scale-100"
                  }`}
                  style={{
                    boxShadow: isActive
                      ? "0 0 40px rgba(251, 191, 36, 1)"
                      : "0 0 15px rgba(59, 130, 246, 0.6)",
                    textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {isActive ? "📍" : "•"} {stop.city}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Main Globe3D component
export default function Globe3D(props: Globe3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        style={{ background: "linear-gradient(to bottom, #0a0e1a, #1a1f35)" }}
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 3, 5]}
          intensity={2.5}
          color="#ffffff"
        />
        <directionalLight
          position={[-5, -3, -5]}
          intensity={0.8}
          color="#4da6ff"
        />
        <pointLight position={[0, 0, 0]} intensity={0.8} color="#fbbf24" />
        <hemisphereLight
          color="#4da6ff"
          groundColor="#0a2463"
          intensity={0.6}
        />

        {/* Enhanced Starfield */}
        <Stars
          radius={300}
          depth={60}
          count={8000}
          factor={5}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Earth with markers */}
        <Earth {...props} />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={15}
          enableDamping
          dampingFactor={0.05}
          autoRotate={!props.isAutoPlaying}
          autoRotateSpeed={0.3}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
