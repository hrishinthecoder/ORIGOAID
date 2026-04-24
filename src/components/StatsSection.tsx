import { lazy, Suspense, useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { TrendingUp, Users, Globe as GlobeIcon, Target } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const ImpactGlobe = lazy(() => import("./three/ImpactGlobe"));

function CountUp({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (isNaN(end) || !isFinite(end) || start >= end) {
        setCount(isNaN(end) ? 0 : end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  const displayValue = count < 100 && count % 1 !== 0 
    ? count.toFixed(1) 
    : Math.floor(count).toLocaleString();

  return <span>{prefix}{displayValue}{suffix}</span>;
}

export default function StatsSection() {
  const campaigns = useStore((s) => s.campaigns) || [];
  const raised = Array.isArray(campaigns) ? campaigns.reduce((s, c) => s + (c.raised || 0), 0) : 0;
  const backers = Array.isArray(campaigns) ? campaigns.reduce((s, c) => s + (c.backers || 0), 0) : 0;
  const [globeRef, globeInView] = useInView<HTMLDivElement>({ rootMargin: "250px" });

  const stats = [
    { 
      value: raised / 10000000, 
      label: "Total Raised", 
      sub: "Crore BDT", 
      icon: TrendingUp, 
      color: "from-brand-emerald/20 to-transparent",
      iconColor: "text-brand-emerald",
      prefix: "৳",
      suffix: " Cr"
    },
    { 
      value: campaigns.length, 
      label: "Campaigns", 
      sub: "Active", 
      icon: GlobeIcon,
      color: "from-brand-red/20 to-transparent",
      iconColor: "text-brand-ruby",
      suffix: "+"
    },
    { 
      value: backers, 
      label: "Donors", 
      sub: "Worldwide", 
      icon: Users,
      color: "from-blue-500/20 to-transparent",
      iconColor: "text-blue-400",
      suffix: "+"
    },
    { 
      value: 94, 
      label: "Success Rate", 
      sub: "Goal reached", 
      icon: Target,
      color: "from-yellow-500/20 to-transparent",
      iconColor: "text-yellow-500",
      suffix: "%"
    },
  ];

  return (
    <section id="stats" className="relative py-16 md:py-24 overflow-hidden bg-[#0a1a12] text-white">
      {/* Production-Ready Animated Gradient Background - Always Dark */}
      <motion.div 
        animate={{ 
          background: [
            "radial-gradient(circle at 0% 0%, #0d2e1f 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, #0d2e1f 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, #0d2e1f 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0"
      />
      
      {/* Topographic Overlay */}
      <div 
        className="absolute inset-0 z-1 opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23138e5d' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} 
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30 inline-block mb-6"
            >
              Real-Time Impact
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight"
            >
              Every donation <span className="text-brand-emerald font-black">ripples</span> <br/>
              across Bangladesh.
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-base mb-10 max-w-md leading-relaxed"
            >
              From remote chars of Kurigram to the hills of Bandarban — OrigoAid delivers
              funding where it's needed most.
            </motion.p>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-brand-emerald/40 transition-all overflow-hidden shadow-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-brand-emerald group-hover:text-white transition-all ${s.iconColor}`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div className="font-display text-2xl font-bold mb-0.5 tracking-tight text-white">
                      <CountUp value={s.value} suffix={s.suffix} prefix={s.prefix} />
                    </div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{s.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="relative aspect-square w-full max-w-[450px] mx-auto"
          >
            <div className="absolute inset-0 bg-brand-emerald/20 blur-[100px] rounded-full scale-75 dark:bg-brand-emerald/30" />
            
            <div ref={globeRef} className="w-full h-full relative z-10">
              {globeInView && (
                <Suspense fallback={null}>
                  <ImpactGlobe height="100%" width="100%" />
                </Suspense>
              )}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-2 -right-2 md:bottom-10 md:-right-10 p-4 rounded-2xl bg-white/10 border border-brand-emerald/20 shadow-2xl max-w-[180px] z-20 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-emerald animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-emerald">Live Connections</span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-white/80">
                Currently tracking <span className="text-brand-emerald font-bold">127</span> active funding routes.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
