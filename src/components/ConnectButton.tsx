"use client";
import { useWallet } from "@/components/WalletContext";

export default function WalletButton() {
  const { account, connect, disconnect } = useWallet();

  return (
    <div>
      {account ? (
        <>
          <p>Connected: {account}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
