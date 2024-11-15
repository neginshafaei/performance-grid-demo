"use client";

import { useEffect, useState } from "react";
import { useTradeWorker } from "../app/hooks/useWorker";
import { VirtualGrid } from "../app/components/VirtualGrid";
import { RefreshCcw, ArrowUpDown, Layers, Cpu, Loader2 } from "lucide-react";

export default function HighPerformancePage() {
  const { data, isProcessing, generateData, sortData } = useTradeWorker();

  const [rowCount, setRowCount] = useState(100000);
  const [activeSort, setActiveSort] = useState<
    "default" | "price-desc" | "price-asc"
  >("default");

  useEffect(() => {
    generateData(rowCount);
  }, []);

  const handleRegenerate = (count: number) => {
    setRowCount(count);
    setActiveSort("default");
    generateData(count);
  };

  const handleSort = () => {
    if (activeSort === "price-desc") {
      sortData("price", "asc");
      setActiveSort("price-asc");
    } else {
      sortData("price", "desc");
      setActiveSort("price-desc");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Engineering Demo
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              High-Frequency Data Grid
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl text-lg">
              Off-main-thread processing using <strong>Web Workers</strong> & UI
              virtualization. Zero UI blocking even with massive datasets.
            </p>
          </div>

          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
              isProcessing
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Cpu className="w-5 h-5" />
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                Worker Status
              </span>
              <span className="text-sm font-bold">
                {isProcessing ? "Processing..." : "Idle / Ready"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Dataset Size
              </span>
              <div className="flex gap-2">
                {[10000, 100000, 500000].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleRegenerate(size)}
                    disabled={isProcessing}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors border ${
                      rowCount === size
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {size / 1000}k Rows
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200 hidden md:block"></div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handleRegenerate(rowCount)}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex-1 md:flex-none disabled:opacity-50"
            >
              <RefreshCcw
                className={`w-4 h-4 ${isProcessing ? "animate-spin" : ""}`}
              />
              Reset Data
            </button>

            <button
              onClick={handleSort}
              disabled={isProcessing}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm transition-all flex-1 md:flex-none disabled:opacity-70 ${
                activeSort !== "default"
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              {activeSort === "default" && "Sort by Price"}
              {activeSort === "price-desc" && "Price: High to Low"}
              {activeSort === "price-asc" && "Price: Low to High"}
            </button>
          </div>
        </div>

        <div className="relative min-h-125">
          {data.length > 0 ? (
            <VirtualGrid items={data} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-slate-900">
                Generating Massive Dataset...
              </h3>
              <p className="text-slate-500 text-sm">
                Initializing {rowCount.toLocaleString()} rows in background
                thread
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between text-xs text-slate-400 px-2 font-mono">
          <span>Memory Usage: Optimized via Virtualization</span>
          <span>Rendering: {data.length.toLocaleString()} Items</span>
        </div>
      </div>
    </main>
  );
}
