"use client";

import { useEffect, useState } from "react";
import { Contract, JsonRpcProvider, type BigNumberish } from "ethers";

const FEEDS: Record<string, string> = {
  ETH: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH/USD
  BTC: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c", // BTC/USD
  LINK: "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c", // LINK/USD
  SOL: "0x4ffC43a60e009B551865A93d232E33Fce9f01507", // SOL/USD
};

const ABI = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
];

export function useTokenPrices(
  rpcUrl: string = process.env.NEXT_PUBLIC_RPC_URL || "https://eth.llamarpc.com"
) {
  const [prices, setPrices] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const provider = new JsonRpcProvider(rpcUrl);

    async function fetchPrices() {
      try {
        const results: Record<string, number> = {};
        for (const [symbol, address] of Object.entries(FEEDS)) {
          const contract = new Contract(address, ABI, provider);
          const decimals = Number(await contract.decimals());
          const roundData = await contract.latestRoundData();

          // Convert BigInt to number safely
          const answer = BigInt(roundData.answer);
          const price = Number(answer) / 10 ** decimals;

          results[symbol] = price;
        }
        setPrices(results);
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [rpcUrl]);

  return prices;
}
