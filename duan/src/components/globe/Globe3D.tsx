import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Sparkles } from "@react-three/drei";
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

// GLSL Shader for Sun Surface (Plasma/Fire effect)
const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // High-quality noise functions
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 2.0;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(st * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // Turbulence for fire effect
  float turbulence(vec2 st) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      value += abs(noise(st * frequency)) * amplitude;
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    // Multi-layer animated fire effect
    vec2 uv = vUv;
    
    // Layer 1: Base fire movement (FASTER, MORE VISIBLE)
    vec2 fireUv1 = uv * 6.0 + vec2(time * 0.5, time * 0.8);
    float fire1 = fbm(fireUv1);
    
    // Layer 2: Turbulent flames (STRONGER)
    vec2 fireUv2 = uv * 10.0 - vec2(time * 0.6, time * 1.0);
    float fire2 = turbulence(fireUv2);
    
    // Layer 3: Hot spots (MORE INTENSE)
    vec2 fireUv3 = uv * 15.0 + vec2(sin(time * 0.7), cos(time * 0.8)) * 3.0;
    float fire3 = fbm(fireUv3);
    
    // Combine layers for INTENSE fire pattern
    float plasma = fire1 * 0.4 + fire2 * 0.4 + fire3 * 0.2;
    plasma = pow(plasma, 0.7); // Lower power = brighter
    
    // VIVID color gradient (deep red -> bright orange -> yellow -> white hot)
    vec3 fireColor;
    if (plasma < 0.25) {
      // Deep red-orange core
      fireColor = mix(vec3(0.8, 0.1, 0.0), color1, plasma / 0.25);
    } else if (plasma < 0.55) {
      // Bright orange flames
      fireColor = mix(color1, color2, (plasma - 0.25) / 0.3);
    } else {
      // Bright yellow-white hot spots
      fireColor = mix(color2, color3, (plasma - 0.55) / 0.45);
      fireColor += vec3(1.2, 1.1, 0.7) * (plasma - 0.55) * 1.2; // BRIGHTER hot spots
    }
    
    // INTENSE edge glow (corona effect)
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
    fireColor += fresnel * vec3(1.2, 0.8, 0.3) * 2.0; // STRONGER glow
    
    // Add MORE brightness variation
    float brightness = 1.1 + sin(time * 3.0 + plasma * 15.0) * 0.3;
    fireColor *= brightness;
    
    gl_FragColor = vec4(fireColor, 1.0);
  }
`;

// Sun component with GLSL shader
function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const corona1Ref = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);
  const corona3Ref = useRef<THREE.Mesh>(null);
  const corona4Ref = useRef<THREE.Mesh>(null);
  const corona5Ref = useRef<THREE.Mesh>(null);
  const flareGroupRef = useRef<THREE.Group>(null);

  // Shader material with plasma effect
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: sunVertexShader,
      fragmentShader: sunFragmentShader,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color("#FF3300") }, // Bright red-orange
        color2: { value: new THREE.Color("#FF8800") }, // Vivid orange
        color3: { value: new THREE.Color("#FFDD00") }, // Bright yellow
      },
      side: THREE.FrontSide,
      transparent: false,
    });
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.1;

    // Update shader time
    if (sunMaterial && sunMaterial.uniforms) {
      sunMaterial.uniforms.time.value = clock.getElapsedTime();
    }

    if (sunRef.current) {
      sunRef.current.position.x = Math.cos(time) * 12;
      sunRef.current.position.z = Math.sin(time) * 12;
      sunRef.current.position.y = Math.sin(time * 0.5) * 3;
      sunRef.current.rotation.y += 0.005;
    }

    // Dynamic light
    if (lightRef.current && sunRef.current) {
      lightRef.current.position.copy(sunRef.current.position);
      lightRef.current.intensity =
        Math.sin(clock.getElapsedTime() * 1.5) * 0.8 + 4.0;
    }

    // Corona pulsing - each layer independently
    if (corona1Ref.current && sunRef.current) {
      corona1Ref.current.position.copy(sunRef.current.position);
      const pulse = Math.sin(clock.getElapsedTime() * 1.2) * 0.15 + 1.0;
      corona1Ref.current.scale.setScalar(pulse);
      corona1Ref.current.rotation.y += 0.01;
    }

    if (corona2Ref.current && sunRef.current) {
      corona2Ref.current.position.copy(sunRef.current.position);
      const pulse = Math.sin(clock.getElapsedTime() * 1.1 + 0.5) * 0.18 + 1.25;
      corona2Ref.current.scale.setScalar(pulse);
      corona2Ref.current.rotation.y -= 0.008;
    }

    if (corona3Ref.current && sunRef.current) {
      corona3Ref.current.position.copy(sunRef.current.position);
      const pulse = Math.sin(clock.getElapsedTime() * 1.0 + 1.0) * 0.2 + 1.5;
      corona3Ref.current.scale.setScalar(pulse);
      corona3Ref.current.rotation.y += 0.012;
    }

    if (corona4Ref.current && sunRef.current) {
      corona4Ref.current.position.copy(sunRef.current.position);
      const pulse = Math.sin(clock.getElapsedTime() * 0.9 + 1.5) * 0.22 + 1.8;
      corona4Ref.current.scale.setScalar(pulse);
      corona4Ref.current.rotation.y -= 0.006;
    }

    if (corona5Ref.current && sunRef.current) {
      corona5Ref.current.position.copy(sunRef.current.position);
      const pulse = Math.sin(clock.getElapsedTime() * 0.8 + 2.0) * 0.25 + 2.2;
      corona5Ref.current.scale.setScalar(pulse);
      corona5Ref.current.rotation.y += 0.009;
    }

    // Solar flares rotation
    if (flareGroupRef.current && sunRef.current) {
      flareGroupRef.current.position.copy(sunRef.current.position);
      flareGroupRef.current.rotation.y += 0.02;
      flareGroupRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Main sun body with shader - VISIBLE FIRE EFFECT */}
      <mesh ref={sunRef} material={sunMaterial}>
        <sphereGeometry args={[1.8, 128, 128]} />
      </mesh>

      {/* Corona glow layers - Multiple animated layers */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[1.8, 48, 48]} />
        <meshBasicMaterial
          color="#FF6600"
          transparent
          opacity={0.6}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={corona2Ref}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#FF8800"
          transparent
          opacity={0.45}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={corona3Ref}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#FFAA00"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={corona4Ref}>
        <sphereGeometry args={[1.8, 24, 24]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={corona5Ref}>
        <sphereGeometry args={[1.8, 24, 24]} />
        <meshBasicMaterial
          color="#FFEE00"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Solar flares (particles) - Visible fire particles */}
      <group ref={flareGroupRef}>
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 2.2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 1.5) * 0.8,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial
                color={
                  i % 4 === 0
                    ? "#FF3300"
                    : i % 4 === 1
                    ? "#FF5500"
                    : i % 4 === 2
                    ? "#FF8800"
                    : "#FFAA00"
                }
                transparent
                opacity={0.9}
              />
            </mesh>
          );
        })}

        {/* ENHANCED Particle sparkles for fire effect */}
        <Sparkles
          count={300}
          scale={5}
          size={4}
          speed={1.2}
          color="#FF6600"
          opacity={0.8}
        />
      </group>

      {/* Powerful sun lights - INTENSE */}
      <pointLight
        ref={lightRef}
        color="#FFEECC"
        intensity={6.5}
        distance={50}
        decay={1.5}
      />

      <pointLight
        position={sunRef.current?.position || [0, 0, 0]}
        color="#FF5500"
        intensity={5.0}
        distance={40}
        decay={2}
      />
    </group>
  );
}

// Moon Phase Shader - Realistic lunar phases with terminator
const moonVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const moonFragmentShader = `
  uniform sampler2D moonTexture;
  uniform float phase; // 0.0 to 1.0 (new moon to full moon)
  uniform vec3 sunDirection;
  uniform float time;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    // Sample moon texture
    vec4 texColor = texture2D(moonTexture, vUv);
    
    // Calculate lighting based on sun direction
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(sunDirection);
    
    // Lambertian shading
    float diffuse = max(dot(normal, sunDir), 0.0);
    
    // Phase-based shadow (terminator line)
    float phaseAngle = (phase - 0.5) * 3.14159; // -π/2 to π/2
    vec3 phaseDir = vec3(sin(phaseAngle), 0.0, cos(phaseAngle));
    float phaseDot = dot(normalize(vPosition), phaseDir);
    
    // Smooth terminator transition
    float shadow = smoothstep(-0.1, 0.1, phaseDot);
    
    // Combine lighting
    float brightness = diffuse * shadow;
    brightness = max(brightness, 0.05); // Ambient light from Earth
    
    vec3 finalColor = texColor.rgb * brightness;
    
    // Subtle color tint
    finalColor = mix(finalColor, finalColor * vec3(1.0, 0.98, 0.95), 0.3);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Moon data interface
interface MoonData {
  time: string;
  phase: number;
  age: number;
  diameter: number;
  distance: number;
  subsolar: { lon: number; lat: number };
  subearth: { lon: number; lat: number };
  posangle: number;
}

// Moon component - NASA data-driven with realistic phases
function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const [currentMoonData, setCurrentMoonData] = useState<MoonData | null>(null);

  // Load moonlight.json data
  useEffect(() => {
    fetch("/moonlight.json")
      .then((res) => res.json())
      .then((data: MoonData[]) => {
        // Set initial moon phase (current date)
        const now = new Date();
        const dayOfYear = Math.floor(
          (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) /
            86400000
        );
        const hourOfDay = now.getHours();
        const index = Math.min(dayOfYear * 24 + hourOfDay, data.length - 1);
        setCurrentMoonData(data[index]);

        console.log(
          `🌙 Moon Phase Loaded: ${data[index].phase.toFixed(1)}% | Age: ${data[
            index
          ].age.toFixed(2)} days`
        );
      })
      .catch((err) => console.error("Failed to load moon data:", err));
  }, []);

  // Create moon shader material
  const moonMaterial = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const material = new THREE.ShaderMaterial({
      vertexShader: moonVertexShader,
      fragmentShader: moonFragmentShader,
      uniforms: {
        moonTexture: { value: null },
        phase: { value: 0.5 }, // Full moon by default
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
        time: { value: 0 },
      },
    });

    // Load moon texture
    loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg",
      (texture) => {
        material.uniforms.moonTexture.value = texture;
        material.needsUpdate = true;
      }
    );

    return material;
  }, []);

  // Update moon phase from data
  useEffect(() => {
    if (currentMoonData && moonMaterial.uniforms) {
      // Phase: 0 = new moon, 50 = full moon, 100 = new moon again
      // Normalize to 0.0-1.0 where 0.5 = full moon
      const normalizedPhase = currentMoonData.phase / 100.0;
      moonMaterial.uniforms.phase.value = normalizedPhase;
    }
  }, [currentMoonData, moonMaterial]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.15;

    // Calculate moon size based on distance (if data available)
    const baseSize = 0.6;
    const moonSize = currentMoonData
      ? baseSize * (1900 / currentMoonData.diameter) // Scale based on angular diameter
      : baseSize;

    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(-time + Math.PI) * 8;
      moonRef.current.position.z = Math.sin(-time + Math.PI) * 8;
      moonRef.current.position.y = Math.cos(time * 0.7) * 2;

      // Apply size variation
      moonRef.current.scale.setScalar(moonSize / baseSize);

      // Rotation based on subsolar longitude
      if (currentMoonData) {
        moonRef.current.rotation.y =
          (currentMoonData.subsolar.lon * Math.PI) / 180;
      } else {
        moonRef.current.rotation.y += 0.003;
      }
    }

    // Update sun direction for shader
    if (moonMaterial.uniforms && moonRef.current) {
      // Sun position relative to moon
      const sunPos = new THREE.Vector3(
        Math.cos(time * 0.1) * 12,
        Math.sin(time * 0.05) * 3,
        Math.sin(time * 0.1) * 12
      );
      const moonPos = moonRef.current.position.clone();
      const sunDir = sunPos.sub(moonPos).normalize();
      moonMaterial.uniforms.sunDirection.value = sunDir;
      moonMaterial.uniforms.time.value = clock.getElapsedTime();
    }

    // Subtle glow pulse
    if (innerGlowRef.current && moonRef.current) {
      innerGlowRef.current.position.copy(moonRef.current.position);
      const pulse = Math.sin(clock.getElapsedTime() * 1.2) * 0.03 + 1.08;
      innerGlowRef.current.scale.setScalar(pulse);
    }

    if (outerGlowRef.current && moonRef.current) {
      outerGlowRef.current.position.copy(moonRef.current.position);
      const pulse = Math.sin(clock.getElapsedTime() * 0.9 + 1) * 0.04 + 1.2;
      outerGlowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {/* Main moon body - Shader material with NASA phase data */}
      <mesh ref={moonRef} material={moonMaterial}>
        <sphereGeometry args={[0.6, 256, 256]} />
      </mesh>

      {/* Bright edge highlight (rim light effect) - subtle */}
      {currentMoonData &&
        currentMoonData.phase > 20 &&
        currentMoonData.phase < 80 && (
          <mesh position={moonRef.current?.position || [0, 0, 0]}>
            <sphereGeometry args={[0.605, 128, 128]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.12}
              side={THREE.BackSide}
            />
          </mesh>
        )}

      {/* Inner atmospheric glow - very subtle white */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshBasicMaterial
          color="#E8E8E8"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow - soft white halo */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color="#D8D8D8"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Far glow - very soft diffuse */}
      <mesh position={moonRef.current?.position || [0, 0, 0]} scale={1.5}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshBasicMaterial
          color="#CCCCCC"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Moon Phase Info Label */}
      {currentMoonData && moonRef.current && (
        <Html
          position={[
            moonRef.current.position.x,
            moonRef.current.position.y + 1.2,
            moonRef.current.position.z,
          ]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            className="px-4 py-2 rounded-lg bg-slate-900/90 border border-blue-400/50 backdrop-blur-sm"
            style={{
              boxShadow: "0 0 20px rgba(96, 165, 250, 0.4)",
            }}
          >
            <div className="text-xs text-blue-200 font-semibold">
              🌙{" "}
              {currentMoonData.phase < 25
                ? "🌑 New Moon"
                : currentMoonData.phase < 45
                ? "🌒 Waxing Crescent"
                : currentMoonData.phase < 55
                ? "🌕 Full Moon"
                : currentMoonData.phase < 75
                ? "🌘 Waning Crescent"
                : "🌑 New Moon"}
            </div>
            <div className="text-[10px] text-blue-300/80 mt-1">
              Phase: {currentMoonData.phase.toFixed(1)}% | Age:{" "}
              {currentMoonData.age.toFixed(1)}d
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Shooting Star component
function ShootingStar({ delay = 0 }: { delay?: number }) {
  const starRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Only appear after delay and periodically
    if (time > delay && (time - delay) % 10 < 0.1 && !visible) {
      setVisible(true);
    }

    if (visible && starRef.current) {
      // Move diagonally across the sky
      const progress = ((time - delay) % 10) / 2;

      if (progress > 1) {
        setVisible(false);
        return;
      }

      starRef.current.position.x = -15 + progress * 30;
      starRef.current.position.y = 10 - progress * 15;
      starRef.current.position.z = -10 + progress * 5;

      // Fade in and out
      const opacity =
        progress < 0.1
          ? progress * 10
          : progress > 0.9
          ? (1 - progress) * 10
          : 1;

      if (starRef.current.material && "opacity" in starRef.current.material) {
        (starRef.current.material as THREE.MeshBasicMaterial).opacity =
          opacity * 0.8;
      }
    }
  });

  if (!visible) return null;

  return (
    <group>
      <mesh ref={starRef}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
      </mesh>

      {/* Trail effect */}
      <mesh ref={starRef} position={[-0.5, 0.3, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ADD8E6" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

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
        {/* Enhanced Lighting for realistic celestial bodies */}
        <ambientLight intensity={0.3} />

        {/* Main sun-like directional light */}
        <directionalLight
          position={[10, 5, 10]}
          intensity={2}
          color="#FFF8DC"
          castShadow
        />

        {/* Moonlight effect */}
        <directionalLight
          position={[-8, 3, -8]}
          intensity={0.5}
          color="#B0C4DE"
        />

        {/* Fill light for Earth */}
        <hemisphereLight
          color="#87CEEB"
          groundColor="#1a1f35"
          intensity={0.4}
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

        {/* Sun and Moon */}
        <Sun />
        <Moon />

        {/* Shooting Stars */}
        <ShootingStar delay={2} />
        <ShootingStar delay={7} />
        <ShootingStar delay={12} />

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
