/// <reference lib="webworker" />

export type Trade = {
  id: string;
  symbol: string;
  price: number;
  amount: number;
  timestamp: number;
};

let dataset: Trade[] = [];

const generateData = (count: number) => {
  dataset = Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    symbol: ["BTC", "ETH", "SOL", "ADA"][i % 4],
    price: Math.random() * 50000,
    amount: Math.random() * 10,
    timestamp: Date.now(),
  }));
  return dataset;
};

const sortData = (field: keyof Trade, direction: "asc" | "desc") => {
  const sorted = [...dataset].sort((a, b) => {
    return direction === "asc"
      ? a[field] > b[field]
        ? 1
        : -1
      : a[field] < b[field]
      ? 1
      : -1;
  });
  return sorted;
};

self.onmessage = (e) => {
  const { type, payload } = e.data;

  switch (type) {
    case "GENERATE":
      const data = generateData(payload);
      self.postMessage({ type: "DATA_READY", payload: data });
      break;
    case "SORT":
      const sorted = sortData(payload.field, payload.direction);
      self.postMessage({ type: "DATA_UPDATED", payload: sorted });
      break;
  }
};
