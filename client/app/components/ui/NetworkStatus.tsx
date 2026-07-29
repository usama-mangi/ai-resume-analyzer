import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { NetworkStatus } from '~/hooks/useNetworkStatus';

interface NetworkStatusContextValue {
  status: NetworkStatus;
  isOnline: boolean;
  isSlow: boolean;
}

const NetworkStatusContext = createContext<NetworkStatusContextValue | undefined>(undefined);

export function useNetworkStatus(): NetworkStatusContextValue {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within NetworkStatusProvider');
  }
  return context;
}

interface NetworkStatusProviderProps {
  children: ReactNode;
}

let networkStatus: NetworkStatus = 'online';
const listeners = new Set<(status: NetworkStatus) => void>();

function notifyListeners() {
  listeners.forEach(cb => cb(networkStatus));
}

async function checkConnection(): Promise<void> {
  try {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/health`, {
      method: 'HEAD',
      cache: 'no-cache',
      signal: AbortSignal.timeout(3000),
    });
    if (networkStatus !== 'online') {
      networkStatus = 'online';
      notifyListeners();
    }
  } catch {
    if (networkStatus !== 'offline') {
      networkStatus = 'offline';
      notifyListeners();
    }
  }
}

async function checkSpeed(): Promise<void> {
  const start = performance.now();
  try {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/health`, {
      method: 'HEAD',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000),
    });
    const duration = performance.now() - start;
    const newStatus: NetworkStatus = duration > 2000 ? 'slow' : 'online';
    if (networkStatus !== newStatus) {
      networkStatus = newStatus;
      notifyListeners();
    }
  } catch {
    if (networkStatus !== 'offline') {
      networkStatus = 'offline';
      notifyListeners();
    }
  }
}

if (typeof window !== 'undefined') {
  checkConnection();
  window.addEventListener('online', checkConnection);
  window.addEventListener('offline', () => {
    networkStatus = 'offline';
    notifyListeners();
  });

  setInterval(() => {
    if (networkStatus !== 'offline') {
      checkSpeed();
    } else {
      checkConnection();
    }
  }, 30000);
}

export function NetworkStatusProvider({ children }: NetworkStatusProviderProps) {
  const [status, setStatus] = useState<NetworkStatus>(networkStatus);

  useEffect(() => {
    const unsubscribe = subscribeToNetworkStatus(setStatus);
    return unsubscribe;
  }, []);

  return (
    <NetworkStatusContext.Provider value={{
      status,
      isOnline: status !== 'offline',
      isSlow: status === 'slow',
    }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

function subscribeToNetworkStatus(callback: (status: NetworkStatus) => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getNetworkStatus(): NetworkStatus {
  return networkStatus;
}