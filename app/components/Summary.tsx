import type { Feedback } from "types";
import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGuage";

function getScoreBarClass(score: number) {
  if (score >= 70) return "score-bar-green";
  if (score >= 40) return "score-bar-yellow";
  return "score-bar-red";
}

function Category({ title, score }: { title: string; score: number }) {
  return (
    <div className="category">
      <div className="flex flex-row gap-2 items-center justify-between w-full">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <ScoreBadge score={score} />
          </div>
          <div className="score-bar">
            <div
              className={`score-bar-fill ${getScoreBarClass(score)}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Summary({ feedback }: { feedback: Feedback }) {
  return (
    <div className="bg-white rounded-xl shadow-sm w-full border border-gray-200">
      <div className="flex flex-row items-center p-5 gap-6">
        <ScoreGauge score={feedback.overallScore} />

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-gray-900">Your resume score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      <Category title="Tone & Style" score={feedback.toneAndStyle?.score ?? 0} />
      <Category title="Content" score={feedback.content?.score ?? 0} />
      <Category title="Structure" score={feedback.structure?.score ?? 0} />
      <Category title="Skills" score={feedback.skills?.score ?? 0} />
    </div>
  );
}
