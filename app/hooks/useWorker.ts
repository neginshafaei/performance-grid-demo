import { useEffect, useRef, useState, useCallback } from 'react';

export function useTradeWorker() {
  const workerRef = useRef<Worker | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/data.worker.ts', import.meta.url));

    workerRef.current.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'DATA_READY' || type === 'DATA_UPDATED') {
        setData(payload);
        setIsProcessing(false);
      }
    };

    return () => workerRef.current?.terminate();
  }, []);

  const generateData = useCallback((count: number) => {
    setIsProcessing(true);
    workerRef.current?.postMessage({ type: 'GENERATE', payload: count });
  }, []);

  const sortData = useCallback((field: string, direction: 'asc' | 'desc') => {
    setIsProcessing(true);
    workerRef.current?.postMessage({ type: 'SORT', payload: { field, direction } });
  }, []);

  return { data, isProcessing, generateData, sortData };
}