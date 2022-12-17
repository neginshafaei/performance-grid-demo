'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VirtualGrid({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, 
    overscan: 5, 
  });

  return (
    <div 
      ref={parentRef} 
      className="h-150 overflow-auto border rounded-lg bg-white shadow-sm"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              className="absolute top-0 left-0 w-full flex items-center px-4 border-b hover:bg-slate-50 transition-colors"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="w-1/4 font-mono font-bold text-slate-700">{item.symbol}</div>
              <div className="w-1/4 text-emerald-600">${item.price.toFixed(2)}</div>
              <div className="w-1/4">{item.amount.toFixed(4)}</div>
              <div className="w-1/4 text-slate-400 text-sm">{new Date(item.timestamp).toLocaleTimeString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}