import { NextResponse } from "next/server";

export type PricePoint = {
  timestamp: number;
  price: number;
};

// ✅ Map your tokens to exact CoinGecko IDs
const TOKEN_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LINK: "chainlink",
  SOL: "solana",
};

// Simple in-memory cache to prevent repeated requests
let cache: Record<string, PricePoint[]> = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 60_000; // 1 min

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tokenId = url.searchParams.get("tokenId")?.toUpperCase();
  const days = url.searchParams.get("days") || "7";

  if (!tokenId || !TOKEN_MAP[tokenId])
    return NextResponse.json({ error: "Invalid tokenId" }, { status: 400 });

  const cacheKey = `${tokenId}-${days}`;
  if (cache[cacheKey] && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return NextResponse.json({ prices: cache[cacheKey] });
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${TOKEN_MAP[tokenId]}/market_chart?vs_currency=usd&days=${days}`
    );

    if (!res.ok) throw new Error(`${tokenId} fetch failed`);

    const data = await res.json();

    const prices: PricePoint[] = (data.prices || []).map((p: [number, number]) => ({
      timestamp: p[0],
      price: p[1],
    }));

    // Update cache
    cache[cacheKey] = prices;
    cacheTimestamp = Date.now();

    return NextResponse.json({ prices });
  } catch (err) {
    console.error("CoinGecko fetch error:", err);
    return NextResponse.json({ prices: [] }, { status: 500 });
  }
}
