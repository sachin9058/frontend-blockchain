"use client";

import { useClerk, useUser } from '@clerk/nextjs';
import { ShieldCheck, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useUser()
  const{openSignIn} = useClerk()
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="absolute top-0 left-0 -z-0 h-full w-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <main className="relative z-10 mx-auto max-w-4xl px-4 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-zinc-800/50 border border-white/10 rounded-full text-sm text-zinc-300">
          <ShieldCheck className="h-4 w-4 text-green-400" />
          <span>Secure Non-Custodial Tracking</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
          All Your Crypto Assets, in <br />
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            One Secure Dashboard
          </span>
        </h1>
        <p className="mt-6 text-lg text-zinc-300 max-w-xl">
          Connect your wallet to securely track **Ethereum, Bitcoin, USDC, LINK**, and more. Get a unified view of your portfolio balances and market trends in real-time.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() =>{isSignedIn ?  router.push("/wallets") : openSignIn(); router.push("/wallets")}} 
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Your Wallet 
            <Wallet/>
          </button>
          <button 
          onClick={() => router.push("/pricing")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Price Tracker
          </button>
        </div>
      </main>
    </div>
  );
}