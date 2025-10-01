"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChevronDown } from 'lucide-react';
import { PricePoint, Token } from "./Table";

type TokenRowProps = {
  token: Token;
  price: number;
  history: PricePoint[];
  error?: string;
  onSelect: (token: Token) => void;
};


// This hook takes no arguments and returns an object with token prices.
const useTokenPrices = () => ({ 
    ETH: 3450.88, 
    BTC: 68123.45, 
    SOL: 168.21, 
    LINK: 18.55 
});
const useTokenHistory = (token: string, timeRange: string) => {
    const generateHistory = () => {
        const data = [];
        let price = Math.random() * 1000 + 3000;
        for (let i = 0; i < Number(timeRange) * 24; i++) {
            data.push({
                timestamp: new Date().getTime() - i * 3600000,
                price: price,
            });
            price += (Math.random() - 0.5) * 50;
        }
        return data.reverse();
    };
    return { history: generateHistory(), loading: false };
};

const TIME_RANGES = [
  { label: "1D", value: "1" },
  { label: "7D", value: "7" },
  { label: "1M", value: "30" },
  { label: "3M", value: "90" },
  { label: "1Y", value: "365" },
];

export default function TokenPricesCard({ token }: { token: Token }) {
  const prices = useTokenPrices();
  const [selectedToken, setSelectedToken] = useState<keyof typeof prices>("ETH");
  const [timeRange, setTimeRange] = useState<string>("7");
  const { history, loading } = useTokenHistory(selectedToken as string, timeRange);
  const tokenList = Object.keys(prices) as (keyof typeof prices)[];

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <div className="w-full max-w-2xl rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_10px_30px_-10px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-white">
            Crypto Price Tracker
          </h2>
          <div className="relative w-full sm:w-48">
             <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value as keyof typeof prices)}
              className="w-full appearance-none cursor-pointer rounded-lg bg-black/30 py-2 pl-4 pr-10 text-zinc-100 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {tokenList.map((token) => (
                <option key={token} value={token} className="bg-zinc-800">
                  {token}/USD
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-zinc-400">{selectedToken}/USD</p>
          {prices[selectedToken] ? (
            <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              ${prices[selectedToken]?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          ) : (
            <div className="h-[48px] flex items-center justify-center text-zinc-500">Loading...</div>
          )}
        </div>

        <div className="flex justify-center items-center gap-2 mb-6 p-2 rounded-lg bg-black/30 border border-white/10">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                timeRange === range.value
                  ? "bg-white text-black"
                  : "text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="w-full h-72">
          {loading ? (
            <p className="text-center text-zinc-400">Loading chart data...</p>
          ) : history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(t) => new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  stroke="rgb(161 161 170)"
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.2)"}}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="rgb(161 161 170)"
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.2)"}}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                  }}
                  labelFormatter={(t) => new Date(t).toLocaleString()}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-zinc-400">No chart data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}