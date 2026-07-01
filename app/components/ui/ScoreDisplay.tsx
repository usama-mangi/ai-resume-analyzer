import { cn } from "~/lib/utils";

export interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  variant?: "default" | "compact" | "pill";
  className?: string;
}

const scoreThresholds = [
  { min: 70, label: "Strong", color: "green", bg: "bg-badge-green", text: "text-badge-green-text" },
  { min: 40, label: "Good start", color: "yellow", bg: "bg-badge-yellow", text: "text-badge-yellow-text" },
  { min: 0, label: "Needs work", color: "red", bg: "bg-badge-red", text: "text-badge-red-text" },
];

function getScoreConfig(score: number) {
  return scoreThresholds.find((t) => score >= t.min) || scoreThresholds[scoreThresholds.length - 1];
}

export function ScoreBadge({ score, size = "md", showLabel = true, variant = "default", className }: ScoreBadgeProps) {
  const config = getScoreConfig(score);

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px] gap-0.5",
    md: "px-2 py-0.5 text-xs gap-1",
    lg: "px-3 py-1 text-sm gap-1.5",
    xl: "px-4 py-1.5 text-base gap-2",
  };

  const variantStyles = {
    default: "inline-flex items-center justify-center rounded-full font-semibold",
    compact: "inline-flex items-center justify-center rounded-full font-semibold",
    pill: "inline-flex items-center justify-center rounded-full font-medium",
  };

  const label = showLabel ? config.label : `${score}/100`;

  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-semibold",
          sizeStyles[size],
          config.bg,
          config.text,
          className,
        )}
      >
        <span>{score}</span>
        {showLabel && <span className="opacity-70">·</span>}
        {showLabel && <span>{label}</span>}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        sizeStyles[size],
        variantStyles[variant],
        config.bg,
        config.text,
        className,
      )}
    >
      <span>{score}</span>
      {showLabel && <span className="opacity-70">·</span>}
      {showLabel && <span>{label}</span>}
    </span>
  );
}

export interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  strokeWidth?: number;
  className?: string;
}

const circleSizes = {
  sm: { size: 40, stroke: 4, font: "text-xs" },
  md: { size: 56, stroke: 5, font: "text-sm" },
  lg: { size: 72, stroke: 6, font: "text-base" },
  xl: { size: 96, stroke: 8, font: "text-lg" },
};

export function ScoreCircle({ score, size = "md", showLabel = true, strokeWidth, className }: ScoreCircleProps) {
  const config = getScoreConfig(score);
  const { size: diameter, stroke: defaultStroke, font } = circleSizes[size];
  const stroke = strokeWidth ?? defaultStroke;
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const gradientId = `score-gradient-${config.color}-${size}`;

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <svg width={diameter} height={diameter} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {config.color === "green" && (
              <>
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#10b981" />
              </>
            )}
            {config.color === "yellow" && (
              <>
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#eab308" />
              </>
            )}
            {config.color === "red" && (
              <>
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#f59e0b" />
              </>
            )}
          </linearGradient>
        </defs>
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-gray-100 dark:text-gray-800"
        />
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ transformOrigin: "center" }}
        />
      </svg>
      {showLabel && (
        <div className={cn("mt-2", font, "font-bold", config.color === "green" && "text-green-600", config.color === "yellow" && "text-yellow-600", config.color === "red" && "text-red-600")}>
          {score}
        </div>
      )}
    </div>
  );
}

export interface ScoreBarProps {
  score: number;
  height?: number;
  showScore?: boolean;
  className?: string;
}

export function ScoreBar({ score, height = 6, showScore = true, className }: ScoreBarProps) {
  const config = getScoreConfig(score);

  const gradientStyles: Record<string, string> = {
    green: "bg-gradient-to-r from-green-500 to-emerald-500",
    yellow: "bg-gradient-to-r from-yellow-500 to-amber-500",
    red: "bg-gradient-to-r from-red-500 to-yellow-500",
  };

  const color = config.color as keyof typeof gradientStyles;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1" aria-hidden="true">
        {showScore && (
          <span className={cn("text-xs font-semibold", config.color === "green" && "text-green-600", config.color === "yellow" && "text-yellow-600", config.color === "red" && "text-red-600")}>
            {score}/100
          </span>
        )}
      </div>
      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`Score: ${score} out of 100`}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            gradientStyles[config.color],
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export interface ScoreDisplayProps {
  score: number;
  variant?: "badge" | "circle" | "bar" | "compact";
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
}

export function ScoreDisplay({ score, variant = "badge", size = "md", showLabel = true, className }: ScoreDisplayProps) {
  const circleSize = size === "xl" ? "lg" : size;
  switch (variant) {
    case "circle":
      return <ScoreCircle score={score} size={circleSize} showLabel={showLabel} className={className} />;
    case "bar":
      return <ScoreBar score={score} showScore={showLabel} className={className} />;
    case "compact":
      return <ScoreBadge score={score} size={size} showLabel={showLabel} variant="compact" className={className} />;
    case "badge":
    default:
      return <ScoreBadge score={score} size={size} showLabel={showLabel} className={className} />;
  }
}

export default ScoreDisplay;