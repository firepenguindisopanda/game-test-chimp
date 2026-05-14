import { useEffect, useState, useRef } from "react";

interface TimerRingProps {
  duration: number; // seconds
  onTimeUp: () => void;
}

export function TimerRing({ duration, onTimeUp }: TimerRingProps) {
  const [remaining, setRemaining] = useState(duration);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setTimeout(() => {
      const next = remaining - 1;
      setRemaining(next);
      if (next <= 0) {
        onTimeUpRef.current();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [remaining]);

  const progress = remaining / duration;
  const circumference = 2 * Math.PI * 18; // r=18
  const offset = circumference * (1 - progress);

  return (
    <div className="flex items-center gap-2" role="timer" aria-label={`${remaining} seconds remaining`}>
      <svg width="44" height="44" className="rotate-[-90deg]">
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="3"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke={
            remaining <= 1 ? "#ef4444" : remaining <= 2 ? "#f97316" : "#3b82f6"
          }
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className="text-white font-mono text-lg tabular-nums w-6">
        {remaining}
      </span>
    </div>
  );
}
