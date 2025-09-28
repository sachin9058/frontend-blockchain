import { NextResponse } from "next/server";

export type PricePoint = {
  timestamp: number;
  price: number;
};

// Map your tokens to CoinGecko IDs
const TOKEN_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LINK: "chainlink",
  SOL: "solana",
};

// Simple in-memory cache
let cache: Record<string, { data: PricePoint[]; timestamp: number }> = {};
const CACHE_DURATION = 60_000; // 1 min

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tokenId = url.searchParams.get("tokenId")?.toUpperCase();
  const days = url.searchParams.get("days") || "7";

  if (!tokenId || !TOKEN_MAP[tokenId]) {
    return NextResponse.json({ error: "Invalid tokenId" }, { status: 400 });
  }

  const cacheKey = `${tokenId}-${days}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    return NextResponse.json({ prices: cache[cacheKey].data });
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${TOKEN_MAP[tokenId]}/market_chart?vs_currency=usd&days=${days}`
    );

    if (!res.ok) throw new Error(`${tokenId} fetch failed`);

    const data = await res.json();
    const prices: PricePoint[] = (data.prices || []).map(([time, price]: [number, number]) => ({
      timestamp: time,
      price,
    }));

    // Update cache
    cache[cacheKey] = { data: prices, timestamp: Date.now() };

    return NextResponse.json({ prices });
  } catch (err) {
    console.error("CoinGecko fetch error:", err);
    return NextResponse.json({ prices: [] }, { status: 500 });
  }
}
