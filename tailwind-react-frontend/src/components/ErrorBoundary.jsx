// src/components/ErrorBoundary.jsx
import React from 'react';

/**
 * Simple error boundary to catch rendering errors and show a generic UI
 * Prevents stack traces or raw error info leaking to end users.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(/*error*/) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log the error and component stack for server-side debugging/monitoring
    // Do not expose this to users
    console.error('[UI ERROR]', error, info);
    // Optionally forward to a monitoring service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      // Generic safe UI (no stack trace)
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded shadow text-center max-w-lg">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">An unexpected error occurred. Please try again or contact support.</p>
            <button onClick={() => window.location.assign('/')} className="px-4 py-2 bg-blue-600 text-white rounded">
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
