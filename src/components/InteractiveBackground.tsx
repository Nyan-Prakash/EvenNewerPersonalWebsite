'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Grid configuration
    const dotSpacing = 24;
    const dotRadius = 1;
    const connectionDistance = 120;
    const lineOpacity = 0.3;

    // Create grid of dots
    const dots: { x: number; y: number }[] = [];
    for (let x = 0; x < canvas.width; x += dotSpacing) {
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        dots.push({ x, y });
      }
    }

    // Get theme colors
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dotColor = isDarkMode ? 'rgba(139, 169, 109, 0.2)' : 'rgba(124, 179, 66, 0.15)';
    const lineColor = isDarkMode ? 'rgba(139, 169, 109, 0.4)' : 'rgba(124, 179, 66, 0.3)';
    const highlightColor = isDarkMode ? 'rgba(168, 201, 131, 0.6)' : 'rgba(124, 179, 66, 0.5)';

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // Find the closest dot to the cursor
      let closestDot: { x: number; y: number } | null = null;
      let closestDistance = Infinity;

      dots.forEach((dot) => {
        const distance = Math.sqrt(
          Math.pow(mouse.x - dot.x, 2) + Math.pow(mouse.y - dot.y, 2)
        );

        if (distance < closestDistance && distance < connectionDistance) {
          closestDistance = distance;
          closestDot = dot;
        }
      });

      // Draw a single line to the closest dot
      if (closestDot) {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(closestDot.x, closestDot.y);
        
        // Fade based on distance
        const opacity = (1 - closestDistance / connectionDistance) * lineOpacity;
        ctx.strokeStyle = lineColor.replace('0.4', opacity.toString()).replace('0.3', opacity.toString());
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw all dots
      dots.forEach((dot) => {
        const distance = Math.sqrt(
          Math.pow(mouse.x - dot.x, 2) + Math.pow(mouse.y - dot.y, 2)
        );

        ctx.beginPath();

        // Highlight the closest dot
        if (dot === closestDot) {
          const scale = 2.5;
          ctx.arc(dot.x, dot.y, dotRadius * scale, 0, Math.PI * 2);
          ctx.fillStyle = highlightColor;
        } else {
          ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
        }
        
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
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
