import { LineChart, Line, ResponsiveContainer } from "recharts"; // 👈 ADDED recharts imports
import { Wallet, TrendingUp, TrendingDown } from "lucide-react"; // 👈 ADDED icon imports
import { PricePoint, Token } from "./Table";


// MOVED Sparkline component here
function Sparkline({ data, color }: { data: PricePoint[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// MOVED Skeleton component here
export function TokenRowSkeleton() {
    return (
        <div className="grid grid-cols-[auto,1fr,1fr,100px] items-center gap-4 p-4 border-b border-white/10 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-zinc-700"></div>
            <div className="flex flex-col gap-2">
                <div className="h-4 w-20 bg-zinc-700 rounded"></div>
                <div className="h-3 w-12 bg-zinc-700 rounded"></div>
            </div>
            <div className="h-4 w-24 bg-zinc-700 rounded"></div>
            <div className="h-10 w-full bg-zinc-700 rounded"></div>
        </div>
    );
}

type TokenRowProps = {
  token: Token;
  price: number;
  history: PricePoint[];
  error?: string;
};

const calculateChange = (history: PricePoint[]) => {
    if (history.length < 2) return { change: 0, isPositive: true };
    const lastPrice = history[history.length - 1].price;
    const yesterdayTimestamp = new Date().getTime() - 24 * 60 * 60 * 1000;
    const priorPoint = history.find(p => p.timestamp >= yesterdayTimestamp) || history[0];
    const change = ((lastPrice - priorPoint.price) / priorPoint.price) * 100;
    return {
        change: change.toFixed(2),
        isPositive: change >= 0,
    };
};

export function TokenRow({ token, price, history, error }: TokenRowProps) {
    const { change, isPositive } = calculateChange(history);

    const handleRowClick = () => {
        alert(`Showing details for ${token}. You would open a modal here.`);
    };
    
    return (
        <div 
            onClick={handleRowClick}
            className="grid grid-cols-[auto,1fr,1fr,100px] items-center gap-4 p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-zinc-400" />
                </div>
                <div>
                    <p className="font-semibold text-white">{token}</p>
                    <p className="text-sm text-zinc-400">{token}/USD</p>
                </div>
            </div>
            
            <div className="text-right">
                 {error ? <span className="text-red-500 text-sm">Error</span> : (
                     <div className={`flex items-center justify-end gap-1 font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{change}%</span>
                    </div>
                )}
            </div>

            <div className="text-right font-mono text-white">
                {error ? 'N/A' : `$${price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            
            <div className="h-10 w-full">
                {!error && history.length > 0 && (
                    <Sparkline data={history} color={isPositive ? '#4ade80' : '#f87171'} />
                )}
            </div>
        </div>
    );
}