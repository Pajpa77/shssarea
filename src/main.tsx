import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite websocket / HMR errors that occur when HMR is disabled in container proxy environments
if (typeof window !== 'undefined') {
  const isViteBenign = (arg: unknown): boolean => {
    if (!arg) return false;
    const str = typeof arg === 'string' ? arg : (arg as { message?: string }).message || String(arg);
    return (
      str.includes("reading 'send'") ||
      str.includes('failed to connect to websocket') ||
      str.includes('WebSocket closed without opened') ||
      str.includes('vite:ws')
    );
  };

  const originalError = console.error;
  console.error = (...args) => {
    if (args.some(isViteBenign)) {
      return;
    }
    originalError.apply(console, args);
  };

  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args.some(isViteBenign)) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
