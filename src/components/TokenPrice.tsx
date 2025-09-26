"use client";

import { useEffect, useState } from "react";
import { useTokenPrices } from "@/hooks/useTokenPrice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PriceHistory = { timestamp: number; price: number }[];

const TOKEN_MAP: Record<string, string> = {
  ETH: "ETH",
  BTC: "BTC",
  LINK: "LINK",
  SOL: "SOL",
};

const TIME_RANGES = [
  { label: "1 Day", value: "1" },
  { label: "7 Days", value: "7" },
  { label: "30 Days", value: "30" },
  { label: "90 Days", value: "90" },
  { label: "180 Days", value: "180" },
  { label: "1 Year", value: "365" },
];

export default function TokenPricesCard() {
  const prices = useTokenPrices();
  const [selectedToken, setSelectedToken] = useState<string>("ETH");
  const [history, setHistory] = useState<PriceHistory>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<string>("7"); // default 7 days

  const tokenList = Object.keys(prices);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/coin-history?tokenId=${selectedToken}&days=${timeRange}`);
        if (!res.ok) throw new Error(`${selectedToken} fetch failed`);
        const data = await res.json();

        const formatted: PriceHistory = (data.prices || []).map(
          (p: { timestamp: number; price: number }) => ({
            timestamp: p.timestamp,
            price: p.price,
          })
        );

        setHistory(formatted);
      } catch (err) {
        console.error("Failed to fetch token history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedToken, timeRange]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Token Prices (Chainlink Oracles)
      </h2>

      <div className="mb-4 flex gap-2 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Select Token</label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            {tokenList.map((token) => (
              <option key={token} value={token}>
                {token}/USD
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 mb-6">
        <span className="text-lg font-medium mb-2">{selectedToken}/USD</span>
        {prices[selectedToken] ? (
          <span className="text-2xl font-bold text-green-600">
            ${prices[selectedToken]?.toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-500">Loading...</span>
        )}
      </div>

      <div className="w-full h-64">
        {loading ? (
          <p className="text-center text-gray-500">Loading chart...</p>
        ) : history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(t) => {
                  const date = new Date(t);
                  return timeRange === "1"
                    ? date.toLocaleTimeString()
                    : date.toLocaleDateString();
                }}
              />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                labelFormatter={(t) => new Date(t).toLocaleString()}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No chart data available.</p>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Live data from Chainlink; historical data via CoinGecko.
      </p>
    </div>
  );
}
