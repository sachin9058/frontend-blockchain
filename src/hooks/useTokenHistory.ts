import { useEffect, useState } from "react";

export type PricePoint = {
  timestamp: number;
  price: number;
};

export async function fetchTokenHistory(tokenId: string, days: string) {
  try {
    const res = await fetch(`/api/coin-history?tokenId=${tokenId}&days=${days}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function useTokenHistory(tokenId: string, days: string) {
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchTokenHistory(tokenId, days).then((data) => {
      if (mounted) {
        setHistory(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [tokenId, days]);

  return { history, loading };
}
