import { Component, type ComponentType, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Component render failed.', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export const withErrorBoundary = <P extends object>(WrappedComponent: ComponentType<P>, fallback: ReactNode) => {
  const ComponentWithErrorBoundary = (props: P) => {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };

  ComponentWithErrorBoundary.displayName = `WithErrorBoundary(${WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'})`;

  return ComponentWithErrorBoundary;
};
