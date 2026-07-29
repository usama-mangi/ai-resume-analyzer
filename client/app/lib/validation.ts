export interface ValidationRule<T = any> {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: T) => string | true;
  custom?: (value: T, allValues: Record<string, any>) => string | true;
}

export interface FieldValidation<T = Record<string, any>> {
  [key: string]: ValidationRule;
}

export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024,
    allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/html'],
    allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.html', '.htm'],
  } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(maxSize)}. Please upload a smaller file.`,
    };
  }

  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type not allowed. Supported types: ${allowedExtensions.join(', ')}`,
    };
  }

  if (!allowedTypes.includes(file.type) && file.type !== '') {
    return {
      valid: false,
      error: `File type not allowed. Please check the file format.`,
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function validateField<T>(
  value: T,
  rules: ValidationRule<T>,
  allValues?: Record<string, any>
): string | true {
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return typeof rules.required === 'string' ? rules.required : 'This field is required';
  }
  
  if (rules.minLength && value && typeof value === 'string' && value.length < rules.minLength.value) {
    return rules.minLength.message;
  }
  
  if (rules.maxLength && value && typeof value === 'string' && value.length > rules.maxLength.value) {
    return rules.maxLength.message;
  }
  
  if (rules.min && value && typeof value === 'number' && value < rules.min.value) {
    return rules.min.message;
  }
  
  if (rules.max && value && typeof value === 'number' && value > rules.max.value) {
    return rules.max.message;
  }
  
  if (rules.pattern && value && typeof value === 'string' && !rules.pattern.value.test(value)) {
    return rules.pattern.message;
  }
  
  if (rules.validate) {
    const result = rules.validate(value);
    if (result !== true) return result;
  }
  
  if (rules.custom && allValues) {
    const result = rules.custom(value, allValues);
    if (result !== true) return result;
  }
  
  return true;
}

export function composeValidations<T>(
  ...validators: Array<(value: T) => string | true>
): (value: T) => string | true {
  return (value: T) => {
    for (const validator of validators) {
      const result = validator(value);
      if (result !== true) return result;
    }
    return true;
  };
}

export const commonValidations = {
  required: (fieldName = 'This field') => ({
    required: `${fieldName} is required`,
  }),
  
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },
  
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must contain uppercase, lowercase, and number',
    },
  },
  
  url: {
    pattern: {
      value: /^https?:\/\/.+/,
      message: 'Please enter a valid URL',
    },
  },
  
  phone: {
    pattern: {
      value: /^[\d\s\-\+\(\)]{10,}$/,
      message: 'Please enter a valid phone number',
    },
  },
  
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 100, message: 'Name must be less than 100 characters' },
    pattern: {
      value: /^[a-zA-Z\s\-'\.]+$/,
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    },
  },
  
  positiveNumber: {
    min: { value: 0.01, message: 'Value must be greater than 0' },
  },
  
  integer: {
    validate: (value: number) => Number.isInteger(value) || 'Must be a whole number',
  },
};

export function createValidationSchema<T extends Record<string, any>>(
  rules: FieldValidation<T>
): FieldValidation<T> {
  return rules;
}