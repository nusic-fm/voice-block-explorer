import React, { useEffect, useRef } from "react";

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
};

const KrakenEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const mouseRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const frameIntervalRef = useRef(1000 / 30);
  const lastFrameTimeRef = useRef(0);
  const transformUpdatesRef = useRef(new Map<HTMLElement, string>());

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
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

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

  const animate = (timestamp: number) => {
    if (timestamp - lastFrameTimeRef.current < frameIntervalRef.current) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTimeRef.current = timestamp;

    timeRef.current += 0.016;
    transformUpdatesRef.current.clear();

    particlesRef.current.forEach((particle) => {
      let x = particle.baseX;
      let y = particle.baseY;

      if (particle.depth !== undefined) {
        const wave =
          Math.sin(timeRef.current * 2 + particle.segment! * 5) *
          (20 - particle.depth * 5);
        const wave2 =
          Math.cos(timeRef.current + particle.segment! * 3) *
          (15 - particle.depth * 4);

        x += Math.cos(particle.angle!) * wave;
        y += Math.sin(particle.angle!) * wave2;
      } else {
        particle.angle! += particle.speed! * 0.02;
        const radius = particle.radius! * (1 + Math.sin(timeRef.current) * 0.1);
        x = window.innerWidth / 2 + Math.cos(particle.angle!) * radius;
        y = window.innerHeight / 2 + Math.sin(particle.angle!) * radius;
      }

      const dx = mouseRef.current.x - x;
      const dy = mouseRef.current.y - y;
      const dist = Math.hypot(dx, dy);

      if (dist < 150) {
        const force = (1 - dist / 150) * 15;
        x += (dx / dist) * force;
        y += (dy / dist) * force;
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

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Cleanup particles
      particlesRef.current.forEach((particle) => {
        particle.element.remove();
      });
      particlesRef.current = [];
    };
  }, []);

  return <div ref={containerRef} style={styles.container} />;
};

export default KrakenEffect;
