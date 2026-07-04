function getScoreGradient(score: number) {
  if (score >= 90) return { from: "#2563eb", to: "#7c3aed", className: "score-gradient-excellent" };
  if (score >= 70) return { from: "#22c55e", to: "#10b981", className: "score-gradient-high" };
  if (score >= 40) return { from: "#f59e06", to: "#eab308", className: "score-gradient-mid" };
  return { from: "#dc2626", to: "#f59e0b", className: "score-gradient-low" };
}

function ScoreCircle({ score = 75, size = 100 }: { score: number; size?: number }) {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = score / 100;
  const strokeDashoffset = circumference * (1 - progress);
  const gradient = getScoreGradient(score);
  const gradientId = `score-grad-${size}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
        />
        <defs>
          <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradient.from} />
            <stop offset="100%" stopColor={gradient.to} />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 600ms ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-gray-900" style={{ fontSize: size * 0.2 }}>
          {score}
        </span>
        <span className="text-gray-400" style={{ fontSize: size * 0.1 }}>
          /100
        </span>
      </div>
    </div>
  );
}

export default ScoreCircle;
