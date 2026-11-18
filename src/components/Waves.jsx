import React, { useRef, useEffect } from 'react';

export const Waves = ({
  lineColor = 'rgba(255, 255, 255, 0.22)',
  backgroundColor = 'transparent',
  waveSpeedX = 0.015,
  waveSpeedY = 0.01,
  waveAmpX = 28,
  waveAmpY = 16,
  xGap = 12,
  yGap = 32,
  friction = 0.92,
  tension = 0.008,
  maxCursorMove = 80,
  className = '',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let mouse = {
      x: -1000,
      y: -1000,
      lx: -1000,
      ly: -1000,
      sx: 0,
      sy: 0,
      v: 0,
      a: 0,
      set: false,
    };

    // Build the grid of wave lines
    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.vx = 0;
        this.vy = 0;
      }

      update(time, lineIndex, pointIndex) {
        // Natural sine/cosine wave oscillation
        const wave =
          Math.sin(time * waveSpeedX + pointIndex * 0.15 + lineIndex * 0.3) * waveAmpX +
          Math.cos(time * waveSpeedY + lineIndex * 0.2) * waveAmpY;

        const targetY = this.originY + wave;

        // Interactive mouse displacement & spring physics
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxCursorMove) {
          const force = (maxCursorMove - dist) / maxCursorMove;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * 3;
          this.vy += Math.sin(angle) * force * 3;
        }

        // Hooke's spring force returning to wave baseline
        const dTargetY = targetY - this.y;
        this.vy += dTargetY * tension;
        this.vx += (this.originX - this.x) * tension;

        // Friction dampening
        this.vx *= friction;
        this.vy *= friction;

        this.x += this.vx;
        this.y += this.vy;
      }
    }

    let lines = [];

    const initLines = () => {
      lines = [];
      const totalLines = Math.ceil(height / yGap) + 2;
      const totalPoints = Math.ceil(width / xGap) + 2;

      for (let l = 0; l < totalLines; l++) {
        const points = [];
        const y = l * yGap - yGap;
        for (let p = 0; p < totalPoints; p++) {
          const x = p * xGap - xGap;
          points.push(new Point(x, y));
        }
        lines.push(points);
      }
    };

    initLines();

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      time += 1;

      // Draw each wave line smoothly using quadratic curves
      for (let l = 0; l < lines.length; l++) {
        const points = lines[l];
        if (points.length < 2) continue;

        ctx.beginPath();

        for (let p = 0; p < points.length; p++) {
          points[p].update(time, l, p);
        }

        ctx.moveTo(points[0].x, points[0].y);

        for (let p = 0; p < points.length - 1; p++) {
          const p1 = points[p];
          const p2 = points[p + 1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
        }

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse listeners
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initLines();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    lineColor,
    backgroundColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    xGap,
    yGap,
    friction,
    tension,
    maxCursorMove,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
    />
  );
};

export default Waves;
