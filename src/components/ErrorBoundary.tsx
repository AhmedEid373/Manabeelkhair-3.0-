import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>حدث خطأ / Something went wrong</h1>
            <p style={{ color: '#666' }}>{this.state.error?.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
