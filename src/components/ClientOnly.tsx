'use client';

import { useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

export default function ClientOnly({ children }: ClientOnlyProps) {
  useEffect(() => {
    // Suppress hydration warnings for common browser extension attributes
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' && (
          message.includes('Extra attributes from the server') ||
          message.includes('Hydration failed') ||
          message.includes('webcrx') ||
          message.includes('chrome-extension') ||
          message.includes('moz-extension') ||
          message.includes('safari-extension') ||
          message.includes('Warning: Extra attributes from the server') ||
          message.includes('There was an error while hydrating')
        )
      ) {
        return; // Suppress these specific errors
      }
      originalError.call(console, ...args);
    };

    console.warn = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' && (
          message.includes('Extra attributes from the server') ||
          message.includes('webcrx') ||
          message.includes('chrome-extension') ||
          message.includes('moz-extension') ||
          message.includes('safari-extension')
        )
      ) {
        return; // Suppress these specific warnings
      }
      originalWarn.call(console, ...args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return <>{children}</>;
}
