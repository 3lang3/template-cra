import React from 'react';

/**
 * 报错劫持
 */
export default class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorInfo: error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h3>error boundary component</h3>;
    }

    return this.props.children;
  }
}
