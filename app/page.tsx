'use client';

import { useEffect, useState } from 'react';
import { useTradeWorker } from '../app/hooks/useWorker';
import { VirtualGrid } from '../app/components/VirtualGrid';

export default function HighPerformancePage() {
  const { data, isProcessing, generateData, sortData } = useTradeWorker();
  const [count, setCount] = useState(100000); 

  useEffect(() => {
    generateData(count);
  }, []);

  return (
    <main className="p-8 bg-slate-100 min-h-screen">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">High-Frequency Data Grid</h1>
          <p className="text-slate-500">
            Rendering {data.length.toLocaleString()} rows with 60FPS using Web Workers & Virtualization
          </p>
        </div>
        
        {/* کنترل پنل */}
        <div className="flex gap-4">
          <button 
            onClick={() => sortData('price', 'desc')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Sort by Price (Worker)'}
          </button>
        </div>
      </header>

      {data.length > 0 ? (
        <VirtualGrid items={data} />
      ) : (
        <div className="text-center p-20">Generating Dataset...</div>
      )}
    </main>
  );
}