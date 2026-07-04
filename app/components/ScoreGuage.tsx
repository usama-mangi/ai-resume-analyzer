import { useEffect, useRef, useState } from "react";

function getScoreColors(score: number) {
  if (score >= 90) return { from: "#2563eb", to: "#7c3aed" };
  if (score >= 70) return { from: "#22c55e", to: "#10b981" };
  if (score >= 40) return { from: "#f59e06", to: "#eab308" };
  return { from: "#dc2626", to: "#f59e0b" };
}

export default function ScoreGauge({ score = 75 }: { score: number }) {
  const [pathLength, setPathLength] = useState(0);
  const [animated, setAnimated] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = score / 100;
  const colors = getScoreColors(score);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
      requestAnimationFrame(() => setAnimated(true));
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>

          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={animated ? pathLength * (1 - percentage) : pathLength}
            style={{ transition: "stroke-dashoffset 600ms ease-out" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-xl font-bold text-gray-900 pt-4">{score}</div>
          <div className="text-xs text-gray-400">/100</div>
        </div>
      </div>
    </div>
  );
}
