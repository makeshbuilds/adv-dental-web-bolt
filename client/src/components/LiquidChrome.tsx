import React, { useEffect, useRef } from 'react';

interface LiquidChromeProps {
  className?: string;
}

export default function LiquidChrome({ className = '' }: LiquidChromeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Liquid chrome simulation parameters
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }> = [];

    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: Math.random() * 100,
        });
      }
    };

    createParticles();

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Safety check: ensure canvas has valid dimensions
      if (canvas.width === 0 || canvas.height === 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Create gradient background (blacks and deep grays)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.5, '#1a1a1a');
      gradient.addColorStop(1, '#0f0f0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.5;

        // Add some turbulence
        p.vx += (Math.random() - 0.5) * 0.3;
        p.vy += (Math.random() - 0.5) * 0.3;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle with metallic effect
        const alpha = Math.min(p.life / 50, 1) * 0.6;
        
        // Create metallic glow
        const particleGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 80);
        particleGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        particleGradient.addColorStop(0.5, `rgba(200, 200, 200, ${alpha * 0.5})`);
        particleGradient.addColorStop(1, `rgba(100, 100, 100, 0)`);

        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 80, 0, Math.PI * 2);
        ctx.fill();

        // Remove dead particles
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Spawn new particles occasionally
      if (Math.random() < 0.3) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 100,
        });
      }

      // Add subtle noise/grain effect - with safety check
      try {
        if (canvas.width > 0 && canvas.height > 0) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 20;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
          }
          ctx.putImageData(imageData, 0, 0);
        }
      } catch (e) {
        // Silently handle canvas errors
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}
