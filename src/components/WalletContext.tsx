"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ethers, Eip1193Provider } from "ethers";
interface MetaMaskProvider extends Eip1193Provider {
  on(eventName: string | symbol, listener: (...args: unknown[]) => void): this;
  removeListener(
    eventName: string | symbol,
    listener: (...args: unknown[]) => void
  ): this;
}

declare global {
  interface Window {
    ethereum?: MetaMaskProvider;
  }
}

interface WalletContextType {
  account: string | null;
  signer: ethers.Signer | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const disconnect = useCallback(() => {
    setSigner(null);
    setAccount(null);
    console.log("Wallet disconnected");
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnect();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged as (...args: unknown[]) => void);
      window.ethereum.on("chainChanged", handleChainChanged as (...args: unknown[]) => void);

      return () => {
        window.ethereum?.removeListener(
          "accountsChanged",
          handleAccountsChanged as (...args: unknown[]) => void
        );
        window.ethereum?.removeListener(
          "chainChanged",
          handleChainChanged as (...args: unknown[]) => void
        );
      };
    } else {
      console.warn("No wallet detected. Install MetaMask!");
    }
  }, [disconnect]);

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
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: unknown }).code === 4001
      ) {
        alert("You rejected the connection request. Please try again.");
      } else {
        console.error("Connection error:", err);
      }
    }
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