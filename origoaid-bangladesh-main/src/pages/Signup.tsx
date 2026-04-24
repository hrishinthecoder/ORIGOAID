import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User as UserIcon, Phone, ArrowLeft, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { ProfileType } from "@/data/campaigns";
import { cn } from "@/lib/utils";

const TYPES: { id: ProfileType; label: string; desc: string }[] = [
  { id: "Individual", label: "Individual", desc: "Solo donor or creator" },
  { id: "Organization", label: "Organization", desc: "NGO, Corp, Institution" },
  { id: "Group", label: "Group", desc: "Team, Club, Cause" },
];

export default function Signup() {
  const nav = useNavigate();
  const signUp = useStore((s) => s.signUp);
  const [type, setType] = useState<ProfileType>("Individual");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp({ name, email, phone, password, profileType: type });
      toast.success("Welcome to OrigoAid!");
      nav("/dashboard");
    } catch {
      toast.error("Sign up failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    "Start unlimited campaigns",
    "0% platform fees — forever",
    "Receive payouts via bKash, Nagad, or bank",
    "AI-powered description and tagging",
    "Transparent, verified public profile",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative pt-28 pb-16 min-h-screen">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="container relative grid lg:grid-cols-2 gap-10 items-start pt-8">
          <div className="hidden lg:block sticky top-28">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <h1 className="font-display text-5xl font-bold mb-4 text-balance leading-tight">
              Join the <span className="gradient-text">funding bridge</span>.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              An account takes 60 seconds. Start a campaign in minutes. Make impact forever.
            </p>
            <ul className="space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 grid place-items-center">
                    <Check className="w-3 h-3 text-primary" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-elevated p-6 md:p-10 max-w-md mx-auto lg:mx-0 w-full">
            <h2 className="font-display text-3xl font-bold mb-1">Create an account</h2>
            <p className="text-sm text-muted-foreground mb-6">Takes less than a minute.</p>

            <div className="mb-5">
              <Label className="text-xs mb-2 block">Profile type</Label>
              <div className="grid grid-cols-3 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-all",
                      type === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="text-xs font-bold">{t.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <Label className="text-xs mb-1.5 block">{type === "Individual" ? "Full name" : `${type} name`}</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={type === "Individual" ? "Firoz Ahmed" : "Your organization"}
                    className="pl-9 h-11"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9 h-11"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Phone (Bangladesh)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    placeholder="01XXXXXXXXX"
                    className="pl-9 h-11 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="pl-9 h-11"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center mt-3">
                By continuing, you agree to OrigoAid's Terms and Trust Policy.
              </p>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

