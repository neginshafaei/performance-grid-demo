"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ArrowDown,
  ArrowUp,
  Activity,
  Hash,
  Clock,
  DollarSign,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VirtualGrid({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-125">
      <div className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200 z-10 grid grid-cols-4 px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5" /> Symbol
        </div>
        <div className="flex items-center gap-2 justify-end pr-8">
          <DollarSign className="w-3.5 h-3.5" /> Price (USD)
        </div>
        <div className="flex items-center gap-2 justify-end pr-4">
          <Activity className="w-3.5 h-3.5" /> Amount
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Clock className="w-3.5 h-3.5" /> Time
        </div>
      </div>

      <div
        ref={parentRef}
        className="overflow-auto flex-1 custom-scrollbar bg-white relative"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = items[virtualRow.index];

            const isBuy = virtualRow.index % 2 === 0;
            const trendColor = isBuy
              ? "text-emerald-600 bg-emerald-50/50"
              : "text-rose-600 bg-rose-50/50";
            const trendIcon = isBuy ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            );

            return (
              <div
                key={virtualRow.index}
                className={`absolute top-0 left-0 w-full grid grid-cols-4 items-center px-4 border-b border-slate-100 transition-colors hover:bg-slate-50 group`}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isBuy
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 text-sm block">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ETH-PAIR
                    </span>
                  </div>
                </div>

                <div className="text-right pr-8">
                  <div
                    className={`font-mono font-medium text-sm inline-flex items-center gap-1 ${trendColor} px-2 py-0.5 rounded`}
                  >
                    {item.price.toFixed(2)}
                    {trendIcon}
                  </div>
                </div>

                <div className="text-right pr-4 font-mono text-sm text-slate-600 tabular-nums">
                  {item.amount.toFixed(4)}
                </div>

                <div className="text-right text-xs text-slate-400 font-mono tabular-nums">
                  {new Date(item.timestamp).toLocaleTimeString()}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-[10px] bg-slate-200 px-1 rounded text-slate-600">
                    LATEST
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
