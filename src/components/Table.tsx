"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type PricePoint = {
  timestamp: number;
  price: number;
};

const TOKEN_LIST = ["BTC", "ETH", "LINK", "SOL"] as const;

export function TokenTable() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [histories, setHistories] = useState<Record<string, PricePoint[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      const pricesResult: Record<string, number> = {};
      const historiesResult: Record<string, PricePoint[]> = {};

      await Promise.all(
        TOKEN_LIST.map(async (token) => {
          try {
            // Fetch current price
            const priceRes = await fetch(
              `/api/coin-history?tokenId=${token}&days=1`
            );
            const priceData = await priceRes.json();
            const lastPrice = priceData.prices?.at(-1)?.price || 0;
            pricesResult[token] = lastPrice;

            // Fetch full 7-day history
            const histRes = await fetch(
              `/api/coin-history?tokenId=${token}&days=7`
            );
            const histData = await histRes.json();
            historiesResult[token] = histData.prices || [];
          } catch (err) {
            console.error(token, err);
            pricesResult[token] = 0;
            historiesResult[token] = [];
          }
        })
      );

      if (mounted) {
        setPrices(pricesResult);
        setHistories(historiesResult);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading tokens...</p>;

  return (
    <Table>
      <TableCaption>Live Token Prices + 7-Day History</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>7-Day History</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {TOKEN_LIST.map((token) => (
          <TableRow key={token}>
            <TableCell>{token}/USD</TableCell>
            <TableCell>${prices[token]?.toFixed(2)}</TableCell>
            <TableCell>
              <div className="max-h-40 overflow-y-auto">
                {histories[token]?.map((p) => (
                  <div key={p.timestamp}>
                    {new Date(p.timestamp).toLocaleDateString()} - $
                    {p.price.toFixed(2)}
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Tokens Loaded</TableCell>
          <TableCell>{TOKEN_LIST.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
