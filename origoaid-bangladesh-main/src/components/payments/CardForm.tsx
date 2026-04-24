import { useState } from "react";
import { CreditCard, Lock, Calendar, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  onReady: (ready: boolean, data: { number: string; name: string; exp: string; cvv: string }) => void;
}

const formatCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExp = (v: string) => {
  const n = v.replace(/\D/g, "").slice(0, 4);
  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}/${n.slice(2)}`;
};

export default function CardForm({ onReady }: Props) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");

  const update = (n: string, na: string, e: string, c: string) => {
    setNumber(n);
    setName(na);
    setExp(e);
    setCvv(c);
    const ready = n.replace(/\s/g, "").length >= 15 && na.length >= 2 && e.length === 5 && c.length >= 3;
    onReady(ready, { number: n, name: na, exp: e, cvv: c });
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-300 to-amber-500" />
            <ShieldCheck className="w-5 h-5 opacity-60" />
          </div>
          <div className="font-mono text-xl tracking-[0.2em] mb-4">
            {number || "•••• •••• •••• ••••"}
          </div>
          <div className="flex items-center justify-between text-xs opacity-90">
            <div>
              <div className="uppercase text-[9px] opacity-60 mb-0.5">Cardholder</div>
              <div>{name.toUpperCase() || "YOUR NAME"}</div>
            </div>
            <div>
              <div className="uppercase text-[9px] opacity-60 mb-0.5">Expiry</div>
              <div className="font-mono">{exp || "MM/YY"}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">Card number</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={number}
            onChange={(e) => update(formatCard(e.target.value), name, exp, cvv)}
            placeholder="1234 5678 9012 3456"
            className="pl-9 h-11 font-mono"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">Cardholder name</Label>
        <Input
          value={name}
          onChange={(e) => update(number, e.target.value, exp, cvv)}
          placeholder="As printed on card"
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Expiry</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={exp}
              onChange={(e) => update(number, name, formatExp(e.target.value), cvv)}
              placeholder="MM/YY"
              className="pl-9 h-11 font-mono"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">CVV</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              value={cvv}
              onChange={(e) => update(number, name, exp, e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="•••"
              className="pl-9 h-11 font-mono"
              maxLength={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
