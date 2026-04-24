import { Link } from "react-router-dom";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <Link to="/" className="flex flex-col leading-none hover:opacity-80 transition-opacity">
        <span className="font-display text-xl md:text-2xl font-bold tracking-tighter">
          Origo<span className="text-brand-emerald">Aid</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Bangladesh</span>
        </div>
      </Link>
    </div>
  );
}
