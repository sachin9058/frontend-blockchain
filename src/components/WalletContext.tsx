"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  account: string | null;
  signer: ethers.Signer | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);


  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethProvider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(ethProvider);

      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnect();
        }
      });

  
      (window as any).ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } else {
      console.warn("No wallet detected. Install MetaMask!");
    }
  }, []);


  const connect = async () => {
    if (!provider) {
      alert("No wallet detected. Please install MetaMask.");
      return;
    }

    try {
      await provider.send("eth_requestAccounts", []);
      const s = await provider.getSigner();
      setSigner(s);

      const addr = await s.getAddress();
      setAccount(addr);

      console.log("Wallet connected:", addr);
    } catch (err: any) {
      if (err.code === 4001) {
    
        alert("You rejected the connection request. Please try again.");
      } else {
        console.error("Connection error:", err);
      }
    }
  };

  const disconnect = () => {
    setSigner(null);
    setAccount(null);
    console.log("Wallet disconnected");
  };

  return (
    <WalletContext.Provider value={{ account, signer, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }
  return context;
};
