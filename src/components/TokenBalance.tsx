
"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "./WalletContext";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

interface TokenBalanceProps {
  tokenAddress?: string; 
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ tokenAddress }) => {
  const { account, signer } = useWallet();
  const [balance, setBalance] = useState<string>("0");
  const [symbol, setSymbol] = useState<string>("ETH");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !signer) return;

      try {
        if (tokenAddress) {
          const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
          const rawBalance = await tokenContract.balanceOf(account);
          const decimals = await tokenContract.decimals();
          const tokenSymbol = await tokenContract.symbol();

          setBalance(ethers.formatUnits(rawBalance, decimals));
          setSymbol(tokenSymbol);
        } else {
          const rawBalance = await signer.provider?.getBalance(account);
          if (rawBalance) {
            setBalance(ethers.formatEther(rawBalance));
            setSymbol("ETH");
          }
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };

    fetchBalance();
  }, [account, signer, tokenAddress]);

  if (!account) return <p>Please connect your wallet to view balances.</p>;

  return (
    <div>
      <p>
        Balance: <strong>{balance} {symbol}</strong>
      </p>
    </div>
  );
};

export default TokenBalance;
