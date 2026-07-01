import { cn } from "~/lib/utils";

export interface ScoreConfig {
  min: number;
  label: string;
  color: "green" | "yellow" | "red";
  bg: string;
  text: string;
  border: string;
}

const scoreThresholds: ScoreConfig[] = [
  { min: 70, label: "Strong", color: "green", bg: "bg-badge-green", text: "text-badge-green-text", border: "border-green-300" },
  { min: 40, label: "Good start", color: "yellow", bg: "bg-badge-yellow", text: "text-badge-yellow-text", border: "border-yellow-300" },
  { min: 0, label: "Needs work", color: "red", bg: "bg-badge-red", text: "text-badge-red-text", border: "border-red-300" },
];

export function getScoreConfig(score: number): ScoreConfig {
  return scoreThresholds.find((t) => score >= t.min) || scoreThresholds[scoreThresholds.length - 1];
}

export interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  variant?: "default" | "compact" | "pill";
  className?: string;
}

const sizeStyles = {
  sm: "px-1.5 py-0.5 text-[10px] gap-0.5",
  md: "px-2 py-0.5 text-xs gap-1",
  lg: "px-3 py-1 text-sm gap-1.5",
};

export function ScoreBadge({ score, size = "md", showLabel = true, variant = "default", className }: ScoreBadgeProps) {
  const config = getScoreConfig(score);
  const label = showLabel ? config.label : `${score}/100`;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
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

  const gradientClasses = {
    green: "bg-gradient-to-r from-green-500 to-emerald-500",
    yellow: "bg-gradient-to-r from-yellow-500 to-amber-500",
    red: "bg-gradient-to-r from-red-500 to-yellow-500",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden" style={{ height: `${height}px` }}>
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", gradientClasses[config.color])}
          style={{ width: `${score}%` }}
        />
      </div>
      {showScore && (
        <div className={cn("mt-1 text-right text-xs font-medium", config.color === "green" && "text-green-600", config.color === "yellow" && "text-yellow-600", config.color === "red" && "text-red-600")}>
          {score}/100
        </div>
      )}
    </div>
  );
}

export interface ScoreCellProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreCell({ score, size = "md", className }: ScoreCellProps) {
  const config = getScoreConfig(score);

  const sizeClasses = {
    sm: "text-xs py-1 px-2",
    md: "text-sm py-1.5 px-3",
    lg: "text-base py-2 px-4",
  };

  return (
    <div
      className={cn(
        "text-center font-bold rounded-lg",
        sizeClasses[size],
        config.color === "green" && "bg-green-100 text-green-700",
        config.color === "yellow" && "bg-yellow-100 text-yellow-700",
        config.color === "red" && "bg-red-100 text-red-700",
        className,
      )}
    >
      {score}/100
    </div>
  );
}

export interface CategoryScoreProps {
  label: string;
  score: number;
  showBar?: boolean;
  className?: string;
}

export function CategoryScore({ label, score, showBar = true, className }: CategoryScoreProps) {
  const config = getScoreConfig(score);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <ScoreBadge score={score} size="sm" showLabel={false} variant="compact" />
      </div>
      {showBar && <ScoreBar score={score} height={4} showScore={false} />}
    </div>
  );
}

export default ScoreBadge;