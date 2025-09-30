"use client";

import React from "react";
import { Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/components/WalletContext";
import TokenBalance from "@/components/TokenBalance"; 

export default function WalletPage() {
  const { account, connect, disconnect } = useWallet();

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-4">

      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="w-full max-w-lg rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Wallet Dashboard
        </h2>

        <div className="flex flex-col items-center gap-4 mb-6">
          {account ? (
            <>
              <p className="text-sm text-zinc-400">
                Connected as{" "}
                <span className="font-mono text-violet-400">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </p>
              <button
                onClick={disconnect}
                className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-5 w-5" /> Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connect}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              <Wallet className="h-5 w-5" /> Connect Wallet
            </button>
          )}
        </div>
        <TokenBalance />
      </div>
    </div>
  );
}