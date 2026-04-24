import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Megaphone, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const CoinShower = lazy(() => import("./three/CoinShower"));

export default function CTASection() {
  const [coinRef, coinInView] = useInView<HTMLDivElement>({ rootMargin: "250px" });
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-brand-emerald-dark to-[hsl(200_80%_18%)] text-primary-foreground p-10 md:p-16">
          <div ref={coinRef} className="absolute inset-0 opacity-40">
            {coinInView && (
              <Suspense fallback={null}>
                <CoinShower />
              </Suspense>
            )}
          </div>

          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl animate-glow-pulse" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-ocean/20 blur-3xl animate-glow-pulse" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5">
                <Megaphone className="w-3 h-3" />
                Your cause. Your time.
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-balance leading-tight">
                Start a campaign in under 5 minutes.
              </h2>
              <p className="text-white/85 text-lg mb-8 max-w-md">
                International competitions. Medical emergencies. Community projects. EID & winter drives.
                Whatever your cause — we've built the tools to launch it.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/95 h-12 px-7 shadow-xl">
                  <Link to="/start-campaign">
                    Start a Campaign
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="rounded-full text-white hover:bg-white/15 h-12 px-7 border border-white/20">
                  <Link to="/ai">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try AI Studio
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-3">
              {[
                { v: "0%", l: "Platform fees" },
                { v: "24h", l: "Trust review" },
                { v: "7+", l: "Payment methods" },
                { v: "100%", l: "Transparent" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5 text-center"
                >
                  <div className="font-display text-3xl font-bold">{s.v}</div>
                  <div className="text-sm text-white/80 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
