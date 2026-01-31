import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeProvider";

const BackgroundEffect = () => {
  const canvasRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const animationFrameId = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, isClick: false });
  const isSleeping = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleSpacing = 40;
    const mouseRadius = 150;
    const returnSpeed = 0.08;
    let w, h;

    // Configuration
    const baseOpacity = 0.3;
    const velocityColorBoost = 0.15; // How much brighter when fast

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initParticles();
      wakeUp();
    };

    const initParticles = () => {
      particles = [];
      const cols = Math.ceil(w / particleSpacing);
      const rows = Math.ceil(h / particleSpacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * particleSpacing + particleSpacing / 2,
            y: j * particleSpacing + particleSpacing / 2,
            originX: i * particleSpacing + particleSpacing / 2,
            originY: j * particleSpacing + particleSpacing / 2,
            vx: 0,
            vy: 0,
            size: theme === "dark" ? 1.5 : 2,
          });
        }
      }
    };

    const wakeUp = () => {
      if (isSleeping.current) {
        isSleeping.current = false;
        animate();
      }
    };

    const animate = () => {
      // Optimization: If sleeping, stop the loop
      if (isSleeping.current) return;

      ctx.clearRect(0, 0, w, h);

      let totalVelocity = 0;
      const isClick = mouseRef.current.isClick;
      if (isClick) mouseRef.current.isClick = false; // Reset click trigger

      particles.forEach((p) => {
        // physics calculation
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Interaction
        if (isClick && dist < 300) {
          // Shockwave: Massive impulse
          const force = (300 - dist) / 300;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 50; // STRONG Power
          const pushY = Math.sin(angle) * force * 50;
          p.vx -= pushX;
          p.vy -= pushY;
        } else if (dist < mouseRadius) {
          // Gentle Gravity Well
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 4;
          const pushY = Math.sin(angle) * force * 4;

          p.vx -= pushX;
          p.vy -= pushY;
        }

        // Return to origin
        const dxOrigin = p.originX - p.x;
        const dyOrigin = p.originY - p.y;

        p.vx += dxOrigin * returnSpeed;
        p.vy += dyOrigin * returnSpeed;

        // Friction
        p.vx *= 0.85;
        p.vy *= 0.85;

        // Apply
        p.x += p.vx;
        p.y += p.vy;

        // Dynamic Color & Opacity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        totalVelocity += speed;

        // 1. Distance Opacity (Flashlight effect)
        // Fade radius: 800px.
        // Logic: Closer = Base Opacity. Further = Fades to near zero.
        const fadeRadius = 800;
        let distOpacity = 0;

        if (dist < fadeRadius) {
          // Linear fade: 1.0 at center -> 0.0 at radius
          distOpacity = (1 - dist / fadeRadius) * baseOpacity;
        } else {
          distOpacity = 0; // Invisible if too far
        }

        // 2. Velocity Boost (Flash on move)
        const speedFactor = Math.min(speed / 5, 1);
        const velocityOpacity = speedFactor * 0.5; // Up to +0.5 opacity if moving fast

        // Combine
        // Ensure minimal visibility (0.05) so grid isn't TOTALLY gone,
        // or user preference: "more transparent in distance" -> implied lower but maybe not 0?
        // Let's stick to user request "more transparent": so we fade distOpacity.
        let finalOpacity = Math.min(distOpacity + velocityOpacity, 1);

        // Safety clamp
        if (finalOpacity < 0) finalOpacity = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (theme === "dark") {
          ctx.fillStyle = `rgba(34, 211, 238, ${finalOpacity})`;
        } else {
          ctx.fillStyle = `rgba(100, 116, 139, ${finalOpacity})`;
        }

        ctx.fill();
      });

      // Sleep Logic
      if (totalVelocity < 0.5 && mouseRef.current.x === -9999) {
        isSleeping.current = true;
        // console.log("Sleep Mode");
      } else {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      wakeUp();
    };

    const handleClick = () => {
      mouseRef.current.isClick = true;
      wakeUp();
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleClick); // Click reaction
    window.addEventListener("mouseout", handleMouseLeave);

    // Initial setup
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default BackgroundEffect;
