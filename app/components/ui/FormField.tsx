import { type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Input } from "./Input";
import { Label } from "./Label";
import { cn } from "~/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  hint?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export function Select({
  className,
  error,
  label,
  hint,
  options,
  placeholder,
  id,
  ...props
}: SelectProps) {
  const selectId = id || props.name;
  const errorId = error ? `${selectId}-error` : undefined;
  const hintId = hint ? `${selectId}-hint` : undefined;

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={selectId} required={props.required}>
          {label}
        </Label>
      )}
      <select
        id={selectId}
        className={cn(
          "w-full px-3.5 py-2 rounded-lg text-sm text-gray-900 bg-white border appearance-none transition-all duration-150",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
          "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
          "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")]",
          "bg-[length:20px] bg-[right_8px_center] bg-no-repeat pr-10",
          error
            ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-200 hover:border-gray-300",
          className,
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={cn(errorId, hintId)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled selected>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
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
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
}

export function Textarea({ className, error, label, hint, id, ...props }: TextareaProps) {
  const textareaId = id || props.name;
  const errorId = error ? `${textareaId}-error` : undefined;
  const hintId = hint ? `${textareaId}-hint` : undefined;

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={textareaId} required={props.required}>
          {label}
        </Label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "w-full px-3.5 py-2 rounded-lg text-sm text-gray-900 bg-white border transition-all duration-150 resize-y min-h-[80px]",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
          "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
          error
            ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-200 hover:border-gray-300",
          className,
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={cn(errorId, hintId)}
        {...props}
      />
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
}

export interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, hint, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <Label required={required}>{label}</Label>
      )}
      <div>{children}</div>
      {error && <p className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-sm text-gray-400">{hint}</p>}
    </div>
  );
}

export default FormField;