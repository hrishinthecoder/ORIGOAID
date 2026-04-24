import { Link } from "react-router-dom";
import { Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 group relative ${className}`}>
      {/* The Clickable Logo for Navigation */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
        <div className="relative">
          <img 
            src="/logo.png" 
            alt="OrigoAid Bangladesh" 
            className="h-10 w-auto object-contain rounded-xl shadow-sm border border-border/50 bg-card/50 p-1"
          />
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-xl font-bold tracking-tighter">
            Origo<span className="text-brand-emerald">Aid</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Bangladesh
          </span>
        </div>
      </Link>

      {/* View Full Logo Feature */}
      <Dialog>
        <DialogTrigger asChild>
          <button 
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-6 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-secondary/80 hover:bg-brand-emerald hover:text-white backdrop-blur-sm border border-border/50"
            title="View Full Logo"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl border-none bg-transparent shadow-none flex items-center justify-center p-0">
          <div className="relative group p-4">
            <img 
              src="/logo.png" 
              alt="Full OrigoAid Logo" 
              className="max-h-[80vh] w-auto rounded-3xl shadow-2xl border-4 border-white/10 animate-in zoom-in-95 duration-300"
            />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/80 font-medium whitespace-nowrap">
              OrigoAid Bangladesh Official Logo
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
