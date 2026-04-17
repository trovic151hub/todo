import { useEffect, useRef } from "react";

const COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#ec4899", "#8b5cf6", "#f97316",
  "#14b8a6", "#eab308",
];

export default function Confetti({ active }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const pieces = [];

    for (let i = 0; i < 90; i++) {
      const el        = document.createElement("div");
      const size      = Math.random() * 9 + 5;
      const color     = COLORS[Math.floor(Math.random() * COLORS.length)];
      const left      = Math.random() * 100;
      const delay     = Math.random() * 0.9;
      const duration  = Math.random() * 1.8 + 2.2;
      const rotate    = Math.random() * 720 - 360;
      const isCircle  = Math.random() > 0.55;
      const drift     = (Math.random() - 0.5) * 120;

      el.className = "confetti-piece";
      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${isCircle ? size : size * 0.5}px;
        background: ${color};
        border-radius: ${isCircle ? "50%" : "2px"};
        left: ${left}%;
        top: -16px;
        opacity: 0;
        animation: confetti-fall ${duration}s ease-in ${delay}s forwards;
        --drift: ${drift}px;
        --rotate: ${rotate}deg;
      `;
      container.appendChild(el);
      pieces.push(el);
    }

    const timer = setTimeout(() => {
      pieces.forEach(el => el.remove());
    }, 5000);

    return () => {
      clearTimeout(timer);
      pieces.forEach(el => el.remove());
    };
  }, [active]);

  return <div ref={containerRef} className="confetti-wrap" aria-hidden="true" />;
}
