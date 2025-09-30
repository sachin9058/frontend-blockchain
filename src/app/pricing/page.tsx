// /app/page.tsx or your main page file

"use client"; // Add this if it's not already there

import { Token, TokenDisplay } from "@/components/Table";
import TokenPricesCard from "@/components/TokenPrice";
import { useState } from "react";

export default function Home() {
  // 1. Lift the state for the selected token to the parent
  const [selectedToken, setSelectedToken] = useState<Token>("ETH");

  return (
    <main className="min-h-screen w-full bg-black text-white p-4 lg:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">

        <div className="lg:col-span-3">
          <TokenDisplay onTokenSelect={setSelectedToken} />
        </div>

        <div className="lg:col-span-2">
          <TokenPricesCard token={selectedToken} />
        </div>

      </div>
    </main>
  );
}