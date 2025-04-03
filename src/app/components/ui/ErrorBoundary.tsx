'use client';

import React, { ReactNode } from 'react';
// import { motion } from 'framer-motion';
// 

// ===== Error Boundary Component =====
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
  }
  
  interface ErrorBoundaryState {
    hasError: boolean;
  }
  
  export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError() {
      return { hasError: true };
    }
  
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return this.props.fallback || (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            Something went wrong. Please try refreshing the page.
          </div>
        );
      }
  
      return this.props.children;
    }
  }

  