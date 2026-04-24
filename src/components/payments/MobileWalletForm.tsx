import { useState } from "react";
import { Lock, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  provider: string;
  providerColor: string;
  onReady: (ready: boolean, data: { phone: string; otp: string; pin: string }) => void;
}

export default function MobileWalletForm({ provider, providerColor, onReady }: Props) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");

  const update = (p: string, o: string, pn: string) => {
    setPhone(p);
    setOtp(o);
    setPin(pn);
    const ready = /^01[0-9]{9}$/.test(p) && o.length === 6 && pn.length >= 4;
    onReady(ready, { phone: p, otp: o, pin: pn });
  };

  return (
    <div className="space-y-4">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${providerColor} text-white text-sm flex items-center gap-2`}>
        <Lock className="w-4 h-4" />
        Secure checkout via {provider}. You'll confirm on your phone.
      </div>

      <div>
        <Label htmlFor="phone" className="text-xs mb-1.5 block">{provider} registered mobile number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(e) => update(e.target.value.replace(/\D/g, "").slice(0, 11), otp, pin)}
            className="pl-9 h-11 text-base font-mono"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="otp" className="text-xs mb-1.5 block">Verification code (sent via SMS)</Label>
        <Input
          id="otp"
          inputMode="numeric"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => update(phone, e.target.value.replace(/\D/g, "").slice(0, 6), pin)}
          className="h-11 text-base font-mono tracking-[0.4em] text-center"
          maxLength={6}
        />
        <div className="text-[11px] text-muted-foreground mt-1">
          Demo mode — any 6 digits will work. Real integration requires a merchant account.
        </div>
      </div>

      <div>
        <Label htmlFor="pin" className="text-xs mb-1.5 block">{provider} PIN</Label>
        <Input
          id="pin"
          type="password"
          placeholder="••••"
          value={pin}
          onChange={(e) => update(phone, otp, e.target.value.replace(/\D/g, "").slice(0, 5))}
          className="h-11 text-base font-mono"
          maxLength={5}
        />
      </div>
    </div>
  );
}
