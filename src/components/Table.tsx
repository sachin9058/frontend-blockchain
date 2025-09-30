"use client";

import { useEffect, useState } from "react";
import { TokenRow, TokenRowSkeleton } from "./TokenRow"; // 👈 IMPORT the new components

// ✅ EXPORT the types so other files can use them
export type PricePoint = {
  timestamp: number;
  price: number;
};

export const TOKEN_LIST = ["BTC", "ETH", "LINK", "SOL"] as const;
export type Token = typeof TOKEN_LIST[number];

// The Main Component
export function TokenDisplay({ onTokenSelect }: { onTokenSelect: (token: Token) => void }) {
  const [prices, setPrices] = useState<Record<Token, number>>({} as any);
  const [histories, setHistories] = useState<Record<Token, PricePoint[]>>({} as any);
  const [errors, setErrors] = useState<Record<Token, string>>({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Your fetchData logic remains exactly the same.
    async function fetchData() {
        let mounted = true;
        const pricesResult: Partial<Record<Token, number>> = {};
        const historiesResult: Partial<Record<Token, PricePoint[]>> = {};
        const errorsResult: Partial<Record<Token, string>> = {};

        await Promise.all(
            TOKEN_LIST.map(async (token) => {
                try {
                    const priceRes = await fetch(`/api/coin-history?tokenId=${token}&days=1`);
                    if (!priceRes.ok) throw new Error(`Failed to fetch price for ${token}`);
                    const priceData = await priceRes.json();
                    if (priceData.error) throw new Error(priceData.error);
                    const lastPrice = priceData.prices?.at(-1)?.price || 0;
                    pricesResult[token] = lastPrice;

                    const histRes = await fetch(`/api/coin-history?tokenId=${token}&days=7`);
                    if (!histRes.ok) throw new Error(`Failed to fetch history for ${token}`);
                    const histData = await histRes.json();
                    if (histData.error) throw new Error(histData.error);
                    historiesResult[token] = histData.prices || [];
                } catch (err: any) {
                    errorsResult[token] = err.message || "Failed to fetch";
                }
            })
        );
        if (mounted) {
            setPrices(pricesResult as Record<Token, number>);
            setHistories(historiesResult as Record<Token, PricePoint[]>);
            setErrors(errorsResult as Record<Token, string>);
            setLoading(false);
        }
    }
    fetchData();
    return () => { /* cleanup */ };
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white flex justify-center p-4 pt-10">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
            Market Overview
        </h1>
        <p className="text-center text-zinc-400 mb-8">Live prices and 7-day trends</p>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
            <div className="grid grid-cols-[auto,1fr,1fr,100px] items-center gap-4 p-4 border-b border-white/10 text-sm font-semibold text-zinc-400">
                <div className="pl-14">Asset</div>
                <div></div>
                <div className="text-right">Price</div>
                <div className="text-center">7D Trend</div>
            </div>
            <div>
                 {loading ? (
                    <>
                        <TokenRowSkeleton />
                        <TokenRowSkeleton />
                        <TokenRowSkeleton />
                        <TokenRowSkeleton />
                    </>
                ) : (
                    TOKEN_LIST.map((token) => (
                        <TokenRow
                            key={token}
                            token={token}
                            price={prices[token]}
                            history={histories[token] || []}
                            error={errors[token]}
                        />
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}