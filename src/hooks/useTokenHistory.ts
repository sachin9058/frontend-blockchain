import { useEffect, useState } from "react";

export type PricePoint = {
  timestamp: number;
  price: number;
};

export function useTokenHistory(tokenId: string, days: string) {
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchHistory = async (retries = 3) => {
      setLoading(true);
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(`/api/coin-history?tokenId=${tokenId}&days=${days}`);
          if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
          const data = await res.json();
          if (mounted) setHistory(data.prices || []);
          break;
        } catch (err) {
          console.error(`${tokenId} fetch attempt ${i + 1} failed`, err);
          if (i === retries - 1 && mounted) setHistory([]);
          await new Promise((r) => setTimeout(r, 500));
        }
      }
      if (mounted) setLoading(false);
    };

    fetchHistory();

    return () => {
      mounted = false;
    };
  }, [tokenId, days]);

  return { history, loading };
}
