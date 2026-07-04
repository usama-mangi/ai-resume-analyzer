import type { TipFeedback, Feedback } from "types";
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";
import ScoreBadge from "./ScoreBadge";

type OnRateFn = (key: string, value: 'up' | 'down' | null) => void;

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-3 items-center py-2">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const TipFeedbackButtons = ({
  tipKey,
  tipFeedback,
  onRate,
}: {
  tipKey: string;
  tipFeedback: Record<string, 'up' | 'down' | null>;
  onRate: OnRateFn;
}) => {
  const current = tipFeedback[tipKey];
  return (
    <div className="flex flex-row items-center gap-2 mt-2 pt-2 border-t border-gray-200/60">
      <span className="text-xs text-gray-400">Helpful?</span>
      <button
        onClick={() => onRate(tipKey, current === 'up' ? null : 'up')}
        title="Helpful"
        className={cn(
          "flex items-center justify-center size-7 rounded-full border transition-colors cursor-pointer",
          current === 'up'
            ? "bg-success-light border-success text-success"
            : "bg-white border-gray-200 text-gray-400 hover:text-gray-600",
        )}
      >
        <img src="/icons/thumb-up.svg" alt="thumbs up" className="size-3.5" />
      </button>
      <button
        onClick={() => onRate(tipKey, current === 'down' ? null : 'down')}
        title="Not helpful"
        className={cn(
          "flex items-center justify-center size-7 rounded-full border transition-colors cursor-pointer",
          current === 'down'
            ? "bg-danger-light border-danger text-danger"
            : "bg-white border-gray-200 text-gray-400 hover:text-gray-600",
        )}
      >
        <img src="/icons/thumb-down.svg" alt="thumbs down" className="size-3.5" />
      </button>
    </div>
  );
};

const CategoryContent = ({
  tips,
  categoryPrefix,
  tipFeedback,
  onRate,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  categoryPrefix: string;
  tipFeedback: Record<string, 'up' | 'down' | null>;
  onRate: OnRateFn;
}) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            <img
              src={
                tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
              }
              alt={tip.type === "good" ? "pass" : "warning"}
              className="size-4"
            />
            <p className="text-sm text-gray-600">{tip.tip}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => {
          const tipKey = `${categoryPrefix}_${index}`;
          return (
            <div
              key={index + tip.tip}
              className={cn(
                "flex flex-col gap-2 rounded-xl p-4",
                tip.type === "good"
                  ? "bg-success-light/30 border border-green-200 text-green-700"
                  : "bg-warning-light/30 border border-yellow-200 text-yellow-700",
              )}
            >
              <div className="flex flex-row gap-2 items-center">
                <img
                  src={
                    tip.type === "good"
                      ? "/icons/check.svg"
                      : "/icons/warning.svg"
                  }
                  alt={tip.type === "good" ? "pass" : "warning"}
                  className="size-4"
                />
                <p className="text-sm font-semibold text-gray-900">{tip.tip}</p>
              </div>
              <p className="text-sm text-gray-600">{tip.explanation}</p>
              <TipFeedbackButtons
                tipKey={tipKey}
                tipFeedback={tipFeedback}
                onRate={onRate}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Details = ({
  feedback,
  tipFeedback,
  onRate,
}: {
  feedback: Feedback;
  tipFeedback: Record<string, 'up' | 'down' | null>;
  onRate: OnRateFn;
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle?.score ?? 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent
              tips={feedback.toneAndStyle?.tips ?? []}
              categoryPrefix="toneAndStyle"
              tipFeedback={tipFeedback}
              onRate={onRate}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content?.score ?? 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent
              tips={feedback.content?.tips ?? []}
              categoryPrefix="content"
              tipFeedback={tipFeedback}
              onRate={onRate}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure?.score ?? 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent
              tips={feedback.structure?.tips ?? []}
              categoryPrefix="structure"
              tipFeedback={tipFeedback}
              onRate={onRate}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills?.score ?? 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent
              tips={feedback.skills?.tips ?? []}
              categoryPrefix="skills"
              tipFeedback={tipFeedback}
              onRate={onRate}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
