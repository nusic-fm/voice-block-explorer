import { Box, CircularProgress, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
// import VoiceRecorderElem from "./VoiceRecorderElem";
import AudioPlayer from "./AudioPlayer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { uploadToUserUploadsStorage } from "../services/storage/userUploads.storage";
import VoiceRecorderElem from "./VoiceRecorderElem";

interface Particle {
  element: HTMLDivElement;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  angle?: number;
  speed?: number;
  radius?: number;
  segment?: number;
  depth?: number;
  targetX?: number;
  targetY?: number;
  startX?: number;
  startY?: number;
  assembleProgress?: number;
  assembleSpeed?: number;
}

const styles = {
  container: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#000",
    overflow: "hidden",
  },
  particle: {
    position: "absolute" as const,
    borderRadius: "50%",
    pointerEvents: "none",
    transformOrigin: "center",
  },
  tentacleParticle: {
    background: "rgba(0, 255, 255, 0.6)",
  },
  branchParticle: {
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
  },
  floatParticle: {
    background: "rgba(0, 255, 255, 0.4)",
    boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
  },
  percentageDisplay: {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#00ffff",
    fontSize: "2rem",
    opacity: 0,
    transition: "opacity 0.5s ease",
  },
  avaTitle: {
    position: "fixed" as const,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 11,
    textAlign: "center" as const,
    pointerEvents: "none",
    opacity: 1,
    transition: "opacity 0.5s ease",
  },
  avaText: {
    fontFamily: "Orbitron, sans-serif",
    fontSize: "12rem",
    fontWeight: 800,
    color: "rgba(0, 255, 255, 0.15)",
    textShadow: `
      0 0 20px rgba(0, 255, 255, 0.3),
      0 0 40px rgba(0, 255, 255, 0.2),
      0 0 60px rgba(0, 255, 255, 0.1)
    `,
    letterSpacing: "1rem",
    background:
      "linear-gradient(180deg, rgba(0, 255, 255, 0.2) 0%, rgba(0, 255, 255, 0.1) 50%, rgba(0, 255, 255, 0.05) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "textPulse 16s ease-in-out infinite",
  },
  avaSubtitle: {
    fontFamily: "Orbitron, sans-serif",
    fontSize: "1.8rem",
    fontWeight: 400,
    color: "rgba(0, 255, 255, 0.2)",
    letterSpacing: "0.8rem",
    marginTop: "-2rem",
    textTransform: "uppercase" as const,
    animation: "textPulse 16s ease-in-out infinite",
    animationDelay: "0.5s",
    animationFillMode: "both",
  },
  keyframes: `
    @keyframes textPulse {
      0% { opacity: 0.2; }
      25% { opacity: 1; }
      50% { opacity: 0.2; }
      75% { opacity: 0.2; }
      100% { opacity: 0.2; }
    }
  `,
};

const KrakenEffect: React.FC<{
  isLoading: boolean;
  onVoiceReady: (audioUrl: string) => void;
}> = ({ isLoading, onVoiceReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const loadingProgressRef = useRef(0);
  const percentageDisplayRef = useRef<HTMLDivElement | null>(null);
  const loadingIntervalRef = useRef<any | null>(null);
  const mouseRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const frameIntervalRef = useRef(1000 / 30);
  const lastFrameTimeRef = useRef(0);
  const transformUpdatesRef = useRef(new Map<HTMLElement, string>());
  const [isIntense, setIsIntense] = useState(false);
  // const [recorededAudioBlob, setRecorededAudioBlob] = useState<Blob | null>(
  //   null
  // );
  const [isUploading, setIsUploading] = useState(false);

  const createParticle = (
    x: number,
    y: number,
    className: string,
    size: number = 2
  ): Particle => {
    const particle = document.createElement("div");
    particle.className = `tentacle-particle ${className}`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    Object.assign(particle.style, styles.particle, styles.tentacleParticle);

    containerRef.current?.appendChild(particle);

    const particleObj = { element: particle, x, y, baseX: x, baseY: y };
    particlesRef.current.push(particleObj);
    return particleObj;
  };

  const createBranch = (
    startX: number,
    startY: number,
    length: number,
    angle: number,
    depth: number
  ) => {
    if (depth >= 3) return;

    const segments = 10 - depth * 2;
    const segmentLength = length / segments;
    let currentX = startX;
    let currentY = startY;

    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const size = 3.5 * (1 - depth / 3) * (1 - t * 0.5);

      const particle = createParticle(
        currentX,
        currentY,
        "branch-particle",
        size
      );
      Object.assign(particle, {
        baseX: currentX,
        baseY: currentY,
        angle,
        segment: t,
        depth,
      });

      if (t > 0.2 && Math.random() < 0.5 - depth * 0.15) {
        const branchAngle = angle + (Math.random() - 0.5) * Math.PI * 1.2;
        createBranch(currentX, currentY, length * 0.6, branchAngle, depth + 1);
      }

      currentX += Math.cos(angle) * segmentLength;
      currentY += Math.sin(angle) * segmentLength;
    }
  };

  const createFractals = () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Create main branches
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      createBranch(centerX, centerY, 300, angle, 0);
    }

    // Add floating particles
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 250;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const particle = createParticle(x, y, "float-particle", 2);
      particle.angle = angle;
      particle.radius = radius;
      particle.speed = 0.2 + Math.random() * 0.2;
    }
  };

  const startLoading = (onComplete?: () => void) => {
    loadingProgressRef.current = 0;

    // Keep particles visible during transition
    particlesRef.current.forEach((particle) => {
      particle.element.style.opacity = "0.8"; // Start with high opacity
    });

    // Show percentage display with a fade
    if (percentageDisplayRef.current) {
      percentageDisplayRef.current.style.opacity = "1";
      percentageDisplayRef.current.textContent = "0%";
    }

    // Calculate circle parameters
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.2;
    const totalParticles = particlesRef.current.length;

    // Assign target positions using current positions as starting points
    particlesRef.current.forEach((particle, index) => {
      const angle = (index / totalParticles) * Math.PI * 2;
      const targetX = window.innerWidth / 2 + Math.cos(angle) * radius;
      const targetY = window.innerHeight / 2 + Math.sin(angle) * radius;

      // Use current position as starting point
      const startX = particle.baseX;
      const startY = particle.baseY;

      Object.assign(particle, {
        targetX,
        targetY,
        startX,
        startY,
        angle,
        assembleProgress: 0,
        assembleSpeed: 0.02 + Math.random() * 0.01, // Slightly slower for smoother transition
      });
    });

    loadingIntervalRef.current = setInterval(() => {
      loadingProgressRef.current += 0.8; // Slightly slower progress

      // Update percentage display
      const percentage = Math.min(95, Math.floor(loadingProgressRef.current));
      if (percentageDisplayRef.current) {
        percentageDisplayRef.current.textContent = `${percentage}%`;
      }

      if (loadingProgressRef.current >= 95) {
        // clearInterval(loadingIntervalRef.current!);
        // if (percentageDisplayRef.current) {
        //   percentageDisplayRef.current.style.opacity = "0";
        // }
        // setTimeout(() => {
        //   if (onComplete) onComplete();
        // }, 500);
      }
    }, 250);
  };

  const stopLoading = () => {
    // Only proceed if we're actually in a loading state
    if (!loadingIntervalRef.current) return;

    // Clear the existing loading interval
    clearInterval(loadingIntervalRef.current);
    loadingIntervalRef.current = null;
    loadingProgressRef.current = 100;
    if (percentageDisplayRef.current) {
      percentageDisplayRef.current.textContent = "100%";
    }
    if (percentageDisplayRef.current) {
      percentageDisplayRef.current.style.opacity = "0";
    }

    // Reset particles to their original state
    particlesRef.current.forEach((particle) => {
      particle.assembleProgress = 0;
      particle.element.style.opacity = "1";
    });
  };

  const animate = (timestamp: number) => {
    if (timestamp - lastFrameTimeRef.current < frameIntervalRef.current) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTimeRef.current = timestamp;

    timeRef.current += 0.016;
    transformUpdatesRef.current.clear();

    const container = containerRef.current;
    const containerBounds = container?.getBoundingClientRect();

    // Intensity multipliers
    const intensityMultiplier = isIntense ? 2.5 : 1;
    const speedMultiplier = isIntense ? 1.8 : 1;
    const radiusMultiplier = isIntense ? 1.4 : 1;

    particlesRef.current.forEach((particle) => {
      let x = particle.baseX;
      let y = particle.baseY;

      if (particle.depth !== undefined) {
        // Increase wave amplitude and frequency for branches
        const wave =
          Math.sin(
            timeRef.current * 2.5 * speedMultiplier + particle.segment! * 5
          ) *
          (20 - particle.depth * 5) *
          intensityMultiplier;
        const wave2 =
          Math.cos(
            timeRef.current * 1.5 * speedMultiplier + particle.segment! * 3
          ) *
          (15 - particle.depth * 4) *
          intensityMultiplier;

        x += Math.cos(particle.angle!) * wave;
        y += Math.sin(particle.angle!) * wave2;
      } else {
        // Increase movement for floating particles
        particle.angle! += particle.speed! * 0.02 * speedMultiplier;
        if (containerBounds) {
          const radius =
            particle.radius! *
            (1 + Math.sin(timeRef.current * speedMultiplier) * 0.2) *
            radiusMultiplier;
          x = containerBounds.width / 2 + Math.cos(particle.angle!) * radius;
          y = containerBounds.height / 2 + Math.sin(particle.angle!) * radius;
        }
      }

      // Increase mouse interaction radius and force
      if (containerBounds) {
        const relativeMouseX = mouseRef.current.x - containerBounds.left;
        const relativeMouseY = mouseRef.current.y - containerBounds.top;

        const dx = relativeMouseX - x;
        const dy = relativeMouseY - y;
        const dist = Math.hypot(dx, dy);

        const interactionRadius = isIntense ? 200 : 150;
        const forceMultiplier = isIntense ? 25 : 15;

        if (dist < interactionRadius) {
          const force = (1 - dist / interactionRadius) * forceMultiplier;
          x += (dx / dist) * force;
          y += (dy / dist) * force;
        }
      }

      transformUpdatesRef.current.set(
        particle.element,
        `translate(${x}px, ${y}px)`
      );
    });

    transformUpdatesRef.current.forEach((transform, element) => {
      element.style.transform = transform;
    });

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    createFractals();
    requestAnimationFrame(animate);

    // Create percentage display element
    const percentageDisplay = document.createElement("div");
    percentageDisplay.className = "percentage-display";
    Object.assign(percentageDisplay.style, styles.percentageDisplay);
    document.body.appendChild(percentageDisplay);
    percentageDisplayRef.current = percentageDisplay;

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Cleanup particles
      particlesRef.current.forEach((particle) => {
        particle.element.remove();
      });
      particlesRef.current = [];
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
      percentageDisplay.remove();
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isLoading]);

  // Add keyframes to document head
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles.keyframes;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // const handleRecordingComplete = (audioBlob: Blob) => {
  //   console.log("Recording finished:", audioBlob);
  //   setRecorededAudioBlob(audioBlob);
  //   setIsIntense(false);
  // };

  // const handleRecordingStateChange = (isRecording: boolean) => {
  //   setIsIntense(isRecording);
  // };

  // const onProceedWithVoice = async () => {
  //   if (!recorededAudioBlob) return;
  //   setIsUploading(true);
  //   const randomId = Math.random().toString(36).substring(2, 15);
  //   const fileName = `${randomId}.mp3`;
  //   const uploadUrl = await uploadToUserUploadsStorage(
  //     recorededAudioBlob,
  //     fileName
  //   );
  //   console.log({ uploadUrl });
  //   onVoiceReady(uploadUrl);
  //   setIsUploading(false);
  // };

  return (
    <Box ref={containerRef} component="div" sx={styles.container}>
      <Box component="div" sx={styles.avaTitle}>
        <Box component="div" sx={styles.avaText}>
          AVA
        </Box>
        <Box component="div" sx={styles.avaSubtitle}>
          AI Voice Agents
        </Box>
      </Box>
      {/* {recorededAudioBlob ? (
        <Box
          sx={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            zIndex: 9999,
            transform: "translateX(-50%)",
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={2}
        >
          <AudioPlayer
            src={URL.createObjectURL(recorededAudioBlob)}
            title="Recorded Voice"
            showCloseButton={true}
            onClose={() => {
              setRecorededAudioBlob(null);
            }}
          />
          <IconButton onClick={onProceedWithVoice}>
            {isUploading ? <CircularProgress /> : <ArrowForwardIcon />}
          </IconButton>
        </Box>
      ) : (
        <VoiceRecorderElem
          onRecordingComplete={handleRecordingComplete}
          onRecordingStateChange={handleRecordingStateChange}
        />
      )} */}
    </Box>
  );
};

export default KrakenEffect;
