import { useState } from "react";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BANKS = [
  "Dutch-Bangla Bank",
  "Brac Bank",
  "The City Bank",
  "Eastern Bank Ltd",
  "Islami Bank Bangladesh",
  "Prime Bank",
  "Mutual Trust Bank",
  "Sonali Bank",
  "Janata Bank",
  "Standard Chartered BD",
  "HSBC Bangladesh",
];

interface Props {
  international?: boolean;
  onReady: (ready: boolean, data: { bank: string; account: string; name: string; swift?: string }) => void;
}

export default function BankForm({ international, onReady }: Props) {
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [swift, setSwift] = useState("");

  const update = (b: string, a: string, n: string, s: string) => {
    setBank(b);
    setAccount(a);
    setName(n);
    setSwift(s);
    const ready = b && a.length >= 8 && n.length >= 2 && (!international || s.length >= 8);
    onReady(!!ready, { bank: b, account: a, name: n, swift: s });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-ocean/10 border border-brand-ocean/20 text-sm">
        <Building2 className="w-4 h-4 text-brand-ocean mt-0.5 shrink-0" />
        <div>
          {international
            ? "Donations from abroad via SWIFT or Wise. Our treasury converts at interbank rates and we cover the transfer fee above ৳5,000."
            : "Direct bank transfer via NPSB / BEFTN. Settlement typically within 24 hours on banking days."}
        </div>
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">{international ? "Originating bank" : "Your bank"}</Label>
        <Select value={bank} onValueChange={(v) => update(v, account, name, swift)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder={international ? "e.g. Chase, HSBC UK" : "Select your bank"} />
          </SelectTrigger>
          <SelectContent>
            {(international
              ? ["HSBC UK", "Barclays", "Chase", "Wells Fargo", "Citibank", "Standard Chartered", "Emirates NBD", "Other"]
              : BANKS
            ).map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">Account number / IBAN</Label>
        <Input
          value={account}
          onChange={(e) => update(bank, e.target.value.replace(/\s/g, "").toUpperCase(), name, swift)}
          placeholder={international ? "GB00 XXXX 0000 0000 0000 00" : "1234567890"}
          className="h-11 font-mono"
        />
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">Account holder name</Label>
        <Input
          value={name}
          onChange={(e) => update(bank, account, e.target.value, swift)}
          placeholder="As per bank records"
          className="h-11"
        />
      </div>

      {international && (
        <div>
          <Label className="text-xs mb-1.5 block">SWIFT / BIC code</Label>
          <Input
            value={swift}
            onChange={(e) => update(bank, account, name, e.target.value.toUpperCase().slice(0, 11))}
            placeholder="HSBCGB2L"
            className="h-11 font-mono"
          />
        </div>
      )}
    </div>
  );
}
