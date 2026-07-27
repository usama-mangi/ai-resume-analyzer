import { type TextareaHTMLAttributes, forwardRef } from "react";
import { Label } from "./Label";
import { cn } from "~/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, id, maxLength, showCharacterCount = false, ...props }, ref) => {
    const textareaId = id || props.name;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const counterId = showCharacterCount && maxLength ? `${textareaId}-counter` : undefined;

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={textareaId} required={props.required}>
            {label}
          </Label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            maxLength={maxLength}
            className={cn(
              "w-full px-3.5 py-2 rounded-lg text-sm text-gray-900 bg-white border transition-all duration-150 resize-y min-h-[100px]",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
              "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
              error
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 hover:border-gray-300",
              showCharacterCount && "pr-16",
              className,
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={cn(errorId, hintId, counterId)}
            {...props}
          />
          {showCharacterCount && maxLength && (
            <span
              id={counterId}
              className="absolute bottom-2 right-3 text-xs text-gray-400 pointer-events-none"
              aria-live="polite"
            >
              {typeof props.value === 'string' ? props.value.length : Array.isArray(props.value) ? props.value.length : 0}/{maxLength}
            </span>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-gray-400">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;