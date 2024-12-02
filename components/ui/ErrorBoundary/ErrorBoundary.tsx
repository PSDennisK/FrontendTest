import {Component, ReactNode} from 'react';

export class ErrorBoundary extends Component<
  {children: ReactNode; fallback: ReactNode},
  {hasError: boolean; error: Error | null}
> {
  constructor(props: {children: ReactNode; fallback: ReactNode}) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('BrandResults Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
