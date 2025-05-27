'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | undefined;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | undefined; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          retry={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error | undefined; retry: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center p-8 text-center space-y-4'>
      <AlertTriangle className='w-12 h-12 text-destructive' />
      <h2 className='text-xl font-semibold'>Something went wrong</h2>
      <p className='text-muted-foreground max-w-md'>
        {error?.message || 'An unexpected error occurred while loading the cryptocurrency data.'}
      </p>
      <Button variant='outline' onClick={retry}>
        <RefreshCw className='w-4 h-4 mr-2' />
        Try again
      </Button>
    </div>
  );
}
