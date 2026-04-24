import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export default function Login() {
  const nav = useNavigate();
  const signIn = useStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await signIn({ email, password });
      toast.success("Welcome back!");
      nav("/dashboard");
    } catch {
      toast.error("Could not sign in. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative pt-28 pb-16 min-h-screen flex items-center">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 mesh-grid opacity-30" />

        <div className="container relative grid lg:grid-cols-2 gap-10 items-center">
          <div className="hidden lg:block">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <h1 className="font-display text-5xl font-bold mb-4 text-balance leading-tight">
              Welcome back to <span className="gradient-text">OrigoAid</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Track your campaigns and donations, get impact updates from the field, and continue the movement.
            </p>
            <div className="card-elevated p-6 max-w-md">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-accent text-lg">★</span>
                ))}
              </div>
              <p className="text-sm italic">
                "OrigoAid helped our robotics team go from zero to Paris — the Bangladeshi diaspora on this platform is unreal."
              </p>
              <div className="text-xs text-muted-foreground mt-3">— Rafi Chowdhury, team captain</div>
            </div>
          </div>

          <div className="card-elevated p-6 md:p-10 max-w-md mx-auto w-full">
            <h2 className="font-display text-3xl font-bold mb-1">Sign in</h2>
            <p className="text-sm text-muted-foreground mb-8">Continue to your dashboard.</p>

            <form onSubmit={onSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs">Password</Label>
                  <Link to="#" className="text-[11px] text-primary hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-11"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" />
              or continue with
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["Google", "Phone", "NID"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toast.info(`${p} sign-in coming soon`)}
                  className="rounded-xl border border-border py-2.5 text-xs font-semibold hover:bg-muted transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              New here?{" "}
              <Link to="/signup" className="font-semibold text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

