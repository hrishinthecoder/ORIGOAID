import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.warn("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative grid place-items-center bg-background overflow-hidden">
      <div className="absolute inset-0 aurora-bg opacity-60" />
      <div className="absolute inset-0 mesh-grid opacity-40" />
      <div className="absolute top-6 left-6"><Logo /></div>

      <div className="relative text-center px-6 max-w-lg">
        <div className="font-display text-[10rem] md:text-[14rem] font-bold leading-none gradient-text opacity-90">
          404
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 -mt-4">
          This campaign doesn't exist.
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for might have been moved, removed, or never existed.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark">
            <Link to="/"><Home className="w-4 h-4 mr-2" /> Back home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/browse"><Compass className="w-4 h-4 mr-2" /> Browse campaigns</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

