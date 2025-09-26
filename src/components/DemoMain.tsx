import ConnectButton from "@/components/ConnectButton";
import TokenBalance from "@/components/TokenBalance";


export default function Dashboard() {
  return (
    <div className="p-6">
      <ConnectButton />
      <h2 className="mt-4 font-bold">Balances:</h2>
      <TokenBalance /> 
    
      <TokenBalance tokenAddress="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" />
    </div>
  );
}
