export default function ScoreBadge({ score }: { score: number }) {
  let badgeColor = "";
  let badgeText = "";

  if (score >= 70) {
    badgeColor = "bg-badge-green text-badge-green-text";
    badgeText = "Strong";
  } else if (score >= 40) {
    badgeColor = "bg-badge-yellow text-badge-yellow-text";
    badgeText = "Good start";
  } else {
    badgeColor = "bg-badge-red text-badge-red-text";
    badgeText = "Needs work";
  }

  return (
    <span className={`score-badge ${badgeColor}`}>
      <span>{score}</span>
      <span className="opacity-70">·</span>
      <span>{badgeText}</span>
    </span>
  );
}
