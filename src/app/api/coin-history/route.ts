
import { NextResponse } from "next/server";

export type PricePoint = {
  timestamp: number;
  price: number;
};

const TOKEN_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LINK: "chainlink",
  SOL: "solana",
};

const cache: Record<string, { data: PricePoint[]; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60_000; // 5 minutes

async function fetchWithRetry(
  url: string,
  retries = 3,
  baseDelay = 1000
): Promise<Response> {
  let lastError: unknown;

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { cache: "no-store" });

      if (res.status === 429) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      return res;
    } catch (err) {
      lastError = err;

      if (i < retries) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw new Error(
    `Max retries reached. Last error: ${(lastError as Error)?.message || lastError}`
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tokenIdParam = url.searchParams.get("tokenId")?.toUpperCase();
  const days = url.searchParams.get("days") || "7";

  if (!tokenIdParam || !TOKEN_MAP[tokenIdParam]) {
    return NextResponse.json({ error: "Invalid tokenId" }, { status: 400 });
  }

  const cacheKey = `${tokenIdParam}-${days}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return NextResponse.json({
      prices: cache[cacheKey].data,
      cached: true,
      error: null,
    });
  }

  try {
    const coinId = TOKEN_MAP[tokenIdParam];
    const res = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    const data = await res.json();

    const prices: PricePoint[] = (data.prices || []).map(
      ([time, price]: [number, number]) => ({
        timestamp: time,
        price,
      })
    );

    cache[cacheKey] = { data: prices, timestamp: Date.now() };

    return NextResponse.json({ prices, cached: false, error: null });
  } catch (err) {
    const message = (err as Error)?.message || "Unknown error";

    if (cache[cacheKey]) {
      return NextResponse.json({
        prices: cache[cacheKey].data,
        cached: true,
        error: message,
      });
    }

    return NextResponse.json({ prices: [], cached: false, error: message }, { status: 500 });
  }
}