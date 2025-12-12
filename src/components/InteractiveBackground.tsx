'use client';

import { useEffect, useRef } from 'react';

interface MouseTrail {
  x: number;
  y: number;
  timestamp: number;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const mouseTrailRef = useRef<MouseTrail[]>([]);
  const dotsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Grid configuration
    const dotSpacing = 24;
    const dotRadius = 1;
    const connectionDistance = 120;
    const trailLength = 15;
    const trailFadeTime = 800;

    // Set canvas size and regenerate dots
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Regenerate grid when size changes
      dotsRef.current = [];
      for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
          dotsRef.current.push({ x, y });
        }
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Get theme colors
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dotColor = isDarkMode ? 'rgba(139, 169, 109, 0.2)' : 'rgba(124, 179, 66, 0.15)';

    // Mouse move handler with trail tracking
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Add to trail
      mouseTrailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: now,
      });

      // Keep trail limited in length
      if (mouseTrailRef.current.length > trailLength) {
        mouseTrailRef.current.shift();
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      const mouse = mouseRef.current;

      // Clean up old trail points
      mouseTrailRef.current = mouseTrailRef.current.filter(
        (point) => now - point.timestamp < trailFadeTime
      );

      // Draw all dots with trail highlighting
      dotsRef.current.forEach((dot) => {
        ctx.beginPath();

        // Check if dot is close to cursor
        const distanceToMouse = Math.sqrt(
          Math.pow(mouse.x - dot.x, 2) + Math.pow(mouse.y - dot.y, 2)
        );
        const isNearCursor = distanceToMouse < connectionDistance;

        // Check if dot is in trail path
        let maxTrailInfluence = 0;
        mouseTrailRef.current.forEach((trailPoint) => {
          const age = now - trailPoint.timestamp;
          const ageRatio = age / trailFadeTime;
          const distance = Math.sqrt(
            Math.pow(trailPoint.x - dot.x, 2) + Math.pow(trailPoint.y - dot.y, 2)
          );

          if (distance < connectionDistance) {
            const distanceInfluence = (1 - distance / connectionDistance);
            const timeInfluence = (1 - ageRatio);
            const influence = distanceInfluence * timeInfluence;
            maxTrailInfluence = Math.max(maxTrailInfluence, influence);
          }
        });

        // Size and color based on proximity and trail
        let size = dotRadius;

        if (isNearCursor && distanceToMouse < 60) {
          // Closest dots get biggest
          const scale = 3 - (distanceToMouse / 60) * 1.5;
          size = dotRadius * scale;
          const opacity = 0.4;
          ctx.fillStyle = isDarkMode
            ? `rgba(168, 201, 131, ${opacity})`
            : `rgba(124, 179, 66, ${opacity})`;
        } else if (maxTrailInfluence > 0.1) {
          // Trail dots get medium highlight
          size = dotRadius * (1 + maxTrailInfluence * 1.5);
          const opacity = 0.15 + maxTrailInfluence * 0.2;
          ctx.fillStyle = isDarkMode
            ? `rgba(168, 201, 131, ${opacity})`
            : `rgba(124, 179, 66, ${opacity})`;
        } else {
          // Regular dots
          ctx.fillStyle = dotColor;
        }

        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      style={{ background: 'transparent' }}
    />
  );
}
