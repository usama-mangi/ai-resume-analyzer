import { useEffect, useState, useCallback } from 'react';

export type NetworkStatus = 'online' | 'offline' | 'slow';

let networkStatus: NetworkStatus = 'online';
const listeners = new Set<(status: NetworkStatus) => void>();

function notifyListeners() {
  listeners.forEach(cb => cb(networkStatus));
}

function checkConnection(): Promise<void> {
  return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/health`, {
    method: 'HEAD',
    cache: 'no-cache',
    signal: AbortSignal.timeout(3000),
  })
    .then(() => {
      if (networkStatus !== 'online') {
        networkStatus = 'online';
        notifyListeners();
      }
    })
    .catch(() => {
      if (networkStatus !== 'offline') {
        networkStatus = 'offline';
        notifyListeners();
      }
    });
}

function checkSpeed(): Promise<void> {
  const start = performance.now();
  return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/health`, {
    method: 'HEAD',
    cache: 'no-cache',
    signal: AbortSignal.timeout(5000),
  })
    .then(() => {
      const duration = performance.now() - start;
      const newStatus: NetworkStatus = duration > 2000 ? 'slow' : 'online';
      if (networkStatus !== newStatus) {
        networkStatus = newStatus;
        notifyListeners();
      }
    })
    .catch(() => {
      if (networkStatus !== 'offline') {
        networkStatus = 'offline';
        notifyListeners();
      }
    });
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

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(networkStatus);

  useEffect(() => {
    listeners.add(setStatus);
    return () => {
      listeners.delete(setStatus);
    };
  }, []);

  return status;
}

export function useOnlineStatus(): boolean {
  const status = useNetworkStatus();
  return status !== 'offline';
}

export function getNetworkStatus(): NetworkStatus {
  return networkStatus;
}

export function subscribeToNetworkStatus(callback: (status: NetworkStatus) => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function useNetworkRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  retry: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await fn();
        setData(result);
        setIsLoading(false);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, delay * Math.pow(2, attempt)));
        }
      }
    }
    
    setError(lastError);
    setIsLoading(false);
  }, [fn, retries, delay]);

  return { data, error, isLoading, retry: execute };
}