"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "./WalletContext";
import { Wallet as WalletIcon } from "lucide-react"; 

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const TOKENS = [
  { name: "Ethereum", symbol: "ETH", address: null },
  { name: "USD Coin", symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  { name: "Chainlink", symbol: "LINK", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA" },
];

const fetchSolPrice = async () => {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const data = await res.json();
    return data.solana.usd;
  } catch (err) {
    console.error("Failed to fetch SOL price:", err);
    return null;
  }
};

interface TokenBalance {
  name: string;
  symbol: string;
  balance: string;
}

function TokenBalanceRowSkeleton() {
    return (
        <div className="flex items-center justify-between p-4 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-zinc-700"></div>
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-20 bg-zinc-700 rounded"></div>
                    <div className="h-3 w-12 bg-zinc-700 rounded"></div>
                </div>
            </div>
            <div className="h-4 w-24 bg-zinc-700 rounded"></div>
        </div>
    );
}


export default function TokenBalance() {
  const { account, signer } = useWallet();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!account || !signer) return;
      setLoading(true);
      const results: TokenBalance[] = [];

      for (const token of TOKENS) {
        try {
          if (token.address) {
            const contract = new ethers.Contract(token.address, ERC20_ABI, signer);
            const rawBalance = await contract.balanceOf(account);
            const decimals = await contract.decimals();
            results.push({
              name: token.name, symbol: token.symbol, balance: Number(ethers.formatUnits(rawBalance, decimals)).toFixed(4),
            });
          } else {
            const rawBalance = await signer.provider?.getBalance(account);
            if (rawBalance) {
              results.push({
                name: "Ethereum", symbol: "ETH", balance: Number(ethers.formatEther(rawBalance)).toFixed(4),
              });
            }
          }
        } catch (err) { console.error(`Failed to fetch ${token.symbol}:`, err); }
      }

      const solPrice = await fetchSolPrice();
      if (solPrice) {
        results.push({ name: "Solana (Price)", symbol: "SOL", balance: `$${solPrice}` });
      }
      setBalances(results);
      setLoading(false);
    };

    fetchBalances();
  }, [account, signer]);

  if (!account) {
    return (
      <p className="text-zinc-400 text-center mt-6 text-sm">
        Connect your wallet to see your balances.
      </p>
    );
  }

  return (
    <div className="mt-6 border-t border-white/10 pt-4">
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">
        Your Assets
      </h3>
      {loading ? (
        <div className="space-y-2">
            <TokenBalanceRowSkeleton />
            <TokenBalanceRowSkeleton />
            <TokenBalanceRowSkeleton />
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {balances.map((token) => (
            <div key={token.symbol} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-zinc-800 border border-white/10">
                  <WalletIcon className="h-5 w-5 text-zinc-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">{token.name}</p>
                  <p className="text-sm text-zinc-400">{token.symbol}</p>
                </div>
              </div>
              <p className="font-mono text-white">{token.balance}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}