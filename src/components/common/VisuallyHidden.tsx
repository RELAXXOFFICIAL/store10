import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
}

// Component for screen reader text that's visually hidden
export default function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}