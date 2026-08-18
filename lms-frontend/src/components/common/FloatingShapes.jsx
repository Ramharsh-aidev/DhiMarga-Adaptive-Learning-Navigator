import { useEffect, useRef } from 'react';

const FloatingShapes = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bubble configuration - Many more bubbles, much smaller size
    const bubbles = [];
    const numBubbles = 25; // Much more bubbles
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const centerRadius = 500; // 400px diameter exclusion zone

    // More vibrant purple soap bubble colors for better visibility
    const bubbleColors = [
      { main: 'rgba(167, 139, 250, 0.5)', shine: 'rgba(196, 181, 253, 0.7)' }, // violet-400
      { main: 'rgba(192, 132, 252, 0.5)', shine: 'rgba(216, 180, 254, 0.7)' }, // purple-400
      { main: 'rgba(196, 181, 253, 0.5)', shine: 'rgba(221, 214, 254, 0.7)' }, // violet-300
      { main: 'rgba(216, 180, 254, 0.5)', shine: 'rgba(233, 213, 255, 0.7)' }, // fuchsia-300
      { main: 'rgba(186, 164, 252, 0.5)', shine: 'rgba(209, 196, 253, 0.7)' }, // purple-300
    ];

    // Create bubbles - most on edges, only 2 in center
    let centerBubblesCount = 0;
    for (let i = 0; i < numBubbles; i++) {
      let x, y;
      
      // Decide if this bubble goes in center (only 2) or edges
      if (centerBubblesCount < 2 && Math.random() < 0.02) {
        // Place in center area
        x = centerX + (Math.random() - 0.5) * centerRadius;
        y = centerY + (Math.random() - 0.5) * centerRadius;
        centerBubblesCount++;
      } else {
        // Place on edges - avoid center completely
        do {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
        } while (
          Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < centerRadius
        );
      }

      const colorPair = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      
      bubbles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.15, // Even slower, gentle movement
        vy: (Math.random() - 0.5) * 0.15,
        radius: 5 + Math.random() * 10, // Much smaller bubbles 5-15px
        color: colorPair.main,
        shineColor: colorPair.shine,
        rotation: Math.random() * Math.PI * 2, // For shine effect
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble, i) => {
        // Update position
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        bubble.rotation += 0.01; // Slowly rotate shine

        // Bounce off walls
        if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > canvas.width) {
          bubble.vx *= -1;
          bubble.x = Math.max(bubble.radius, Math.min(canvas.width - bubble.radius, bubble.x));
        }
        if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > canvas.height) {
          bubble.vy *= -1;
          bubble.y = Math.max(bubble.radius, Math.min(canvas.height - bubble.radius, bubble.y));
        }

        // Check collision with other bubbles
        for (let j = i + 1; j < bubbles.length; j++) {
          const other = bubbles[j];
          const dx = other.x - bubble.x;
          const dy = other.y - bubble.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < bubble.radius + other.radius) {
            // Collision detected - bounce off each other
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Rotate velocities
            const vx1 = bubble.vx * cos + bubble.vy * sin;
            const vy1 = bubble.vy * cos - bubble.vx * sin;
            const vx2 = other.vx * cos + other.vy * sin;
            const vy2 = other.vy * cos - other.vx * sin;

            // Swap velocities (elastic collision)
            bubble.vx = vx2 * cos - vy1 * sin;
            bubble.vy = vy1 * cos + vx2 * sin;
            other.vx = vx1 * cos - vy2 * sin;
            other.vy = vy2 * cos + vx1 * sin;

            // Separate bubbles to prevent sticking
            const overlap = bubble.radius + other.radius - distance;
            const separationX = (overlap / 2) * cos;
            const separationY = (overlap / 2) * sin;
            bubble.x -= separationX;
            bubble.y -= separationY;
            other.x += separationX;
            other.y += separationY;
          }
        }

        // Draw soap bubble with iridescent shine effect
        ctx.save();
        
        // Main bubble circle with soft glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = bubble.color;
        
        // Create radial gradient for soap bubble effect
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x,
          bubble.y,
          bubble.radius
        );
        gradient.addColorStop(0, bubble.shineColor);
        gradient.addColorStop(0.4, bubble.color);
        gradient.addColorStop(1, bubble.color);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add shine spot for soap bubble effect
        ctx.shadowBlur = 0;
        const shineGradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.4,
          bubble.y - bubble.radius * 0.4,
          0,
          bubble.x - bubble.radius * 0.4,
          bubble.y - bubble.radius * 0.4,
          bubble.radius * 0.5
        );
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = shineGradient;
        ctx.beginPath();
        ctx.arc(
          bubble.x - bubble.radius * 0.4,
          bubble.y - bubble.radius * 0.4,
          bubble.radius * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Add subtle rim highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius - 1, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ opacity: 0.85 }}
    />
  );
};

export default FloatingShapes;
