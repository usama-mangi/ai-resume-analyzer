import { Component, type ReactNode, type ErrorInfo, useState } from 'react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
  onReset?: () => void;
}

export class ReactErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });
    this.props.onError?.(error, errorInfo);
    
    if (import.meta.env.DEV) {
      console.error('ReactErrorBoundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && this.props.resetKeys) {
      const hasResetKeyChanged = this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );
      if (hasResetKeyChanged) {
        this.reset();
      }
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[300px] items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.reset} variant="primary">
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()} variant="secondary">
                Refresh Page
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left p-3 bg-gray-100 rounded-lg text-xs">
                <summary className="font-medium text-gray-700 cursor-pointer">Error Details</summary>
                <pre className="mt-2 text-red-600 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ReactErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ReactErrorBoundary>
    );
  };
}

export function useErrorHandler(): (error: Error, errorInfo?: ErrorInfo) => void {
  const [, setError] = useState<{ error: Error; errorInfo: ErrorInfo | null } | null>(null);
  
  return (error: Error, errorInfo?: ErrorInfo) => {
    setError({ error, errorInfo: errorInfo || null });
    if (import.meta.env.DEV) {
      console.error('Error caught by useErrorHandler:', error, errorInfo);
    }
  };
}