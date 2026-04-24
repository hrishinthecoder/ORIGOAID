import { CreditCard, Building2, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Donation } from "@/data/campaigns";

export type PaymentMethod = Donation["method"];

export const METHODS: {
  id: PaymentMethod;
  name: string;
  sub: string;
  color: string;
  initial: string;
  icon?: React.ComponentType<{ className?: string }>;
  emoji?: string;
}[] = [
  {
    id: "bkash",
    name: "bKash",
    sub: "Mobile Wallet",
    color: "from-[#E2136E] to-[#b50e5a]",
    initial: "bK",
  },
  {
    id: "nagad",
    name: "Nagad",
    sub: "Mobile Wallet",
    color: "from-[#ec1c24] to-[#a80007]",
    initial: "ন",
  },
  {
    id: "upay",
    name: "Upay",
    sub: "Mobile Wallet",
    color: "from-[#00a651] to-[#006a33]",
    initial: "উ",
  },
  {
    id: "rocket",
    name: "Rocket",
    sub: "DBBL Mobile",
    color: "from-[#8a32a4] to-[#531e63]",
    initial: "R",
  },
  {
    id: "card",
    name: "Card",
    sub: "Visa · Mastercard",
    color: "from-slate-700 to-slate-900",
    initial: "",
    icon: CreditCard,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    sub: "BD Banks · NPSB",
    color: "from-brand-ocean to-blue-800",
    initial: "",
    icon: Building2,
  },
  {
    id: "international",
    name: "International",
    sub: "SWIFT · Wise",
    color: "from-brand-emerald-dark to-emerald-900",
    initial: "",
    icon: Globe2,
  },
];

interface Props {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}

export default function PaymentMethods({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {METHODS.map((m) => {
        const active = m.id === value;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={cn(
              "relative rounded-xl border-2 p-3 text-left transition-all flex items-center gap-3",
              active ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border hover:border-primary/50"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg bg-gradient-to-br grid place-items-center text-white font-bold text-sm shrink-0",
                m.color
              )}
            >
              {m.icon ? <m.icon className="w-5 h-5" /> : m.initial}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{m.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{m.sub}</div>
            </div>
            {active && (
              <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-primary">
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-60" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
