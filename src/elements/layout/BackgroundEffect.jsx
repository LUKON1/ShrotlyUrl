import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeProvider";

const BackgroundEffect = () => {
  const canvasRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const animationFrameId = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, isClick: false });
  const isSleeping = useRef(false);

  // New refs for idle behavior
  const lastInteractionTime = useRef(Date.now());
  const isIdle = useRef(false);
  const timeRef = useRef(0); // For generating ghost cursor movement
  const lastTouchTime = useRef(0); // To ignore synthetic mouse events

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
    const idleDelay = 2500; // ms before ghost cursor takes over

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
      // If sleeping and strictly not idle (shouldn't happen if logic is correct), stop
      if (isSleeping.current) return;

      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.01;

      // Check for idle state
      const now = Date.now();
      if (now - lastInteractionTime.current > idleDelay) {
        isIdle.current = true;
      } else {
        isIdle.current = false;
      }

      // Determine active target position
      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      if (isIdle.current) {
        // Ghost cursor movement (Lissajous-like pattern)
        // Center of screen
        const centerX = w / 2;
        const centerY = h / 2;
        // Wander radius
        const radiusX = w * 0.3;
        const radiusY = h * 0.3;

        targetX = centerX + Math.cos(timeRef.current * 0.7) * radiusX;
        targetY = centerY + Math.sin(timeRef.current * 1.1) * radiusY;
      }

      let totalVelocity = 0;
      const isClick = mouseRef.current.isClick;
      if (isClick) mouseRef.current.isClick = false; // Reset click trigger

      particles.forEach((p) => {
        // physics calculation
        // If mouse is off screen (-9999) and NOT idle, don't affect particles with mouse
        // But if idle, targetX/Y are valid ghost coordinates.
        let dist = 99999;
        let dx = 0;
        let dy = 0;

        // Apply force only if we have a valid target (real mouse or ghost)
        // Real mouse is valid if > -500 (simple check)
        // Ghost is always valid
        if (targetX > -500 || isIdle.current) {
          dx = targetX - p.x;
          dy = targetY - p.y;
          dist = Math.sqrt(dx * dx + dy * dy);
        }

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
      // Only sleep if completely still AND (user left screen AND not idle-mode)
      // Actually, if idle mode is on, we never sleep because ghost cursor keeps moving particles?
      // Ghost cursor moves continuously, so particles near it move. `totalVelocity` > 0.
      // So it will only sleep if user is gone AND we disable idle (which we don't).
      // Or if checking idle takes no resources?
      // Refined logic: If idle, we effectively never sleep because we WANT animation.
      // If NOT idle (user active), we only sleep if user stops moving mouse AND particles settle.

      if (totalVelocity < 0.5 && !isIdle.current && mouseRef.current.x === -9999) {
        isSleeping.current = true;
      } else {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    const handleInput = (x, y) => {
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      lastInteractionTime.current = Date.now();
      isIdle.current = false;
      wakeUp();
    };

    const handleMouseMove = (e) => {
      // Ignore synthetic mouse events fired after touch
      if (Date.now() - lastTouchTime.current < 500) return;
      handleInput(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      lastTouchTime.current = Date.now();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleInput(touch.clientX, touch.clientY);
      }
    };

    const handleClick = () => {
      mouseRef.current.isClick = true;
      lastInteractionTime.current = Date.now();
      wakeUp();
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      // Do not reset timer here, let it run out to trigger idle
    };

    const handleTouchEnd = () => {
      lastTouchTime.current = Date.now();
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      lastInteractionTime.current = Date.now(); // Reset idle timer so it doesn't jump immediately to ghost if delay hasn't passed
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("mouseout", handleMouseLeave);

    // Initial setup
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
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
