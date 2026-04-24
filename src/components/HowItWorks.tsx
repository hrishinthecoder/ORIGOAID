import { Search, HeartHandshake, Wallet, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse verified campaigns by category, district or urgency.",
    color: "from-brand-emerald/20 to-transparent",
    iconColor: "text-brand-emerald",
  },
  {
    icon: HeartHandshake,
    title: "Support",
    description: "Choose any amount and pay through your favorite local method.",
    color: "from-brand-red/20 to-transparent",
    iconColor: "text-brand-red",
  },
  {
    icon: Wallet,
    title: "Track",
    description: "Receive real-time updates and track every taka on the timeline.",
    color: "from-blue-500/20 to-transparent",
    iconColor: "text-blue-400",
  },
  {
    icon: PartyPopper,
    title: "Celebrate",
    description: "See the outcome with photos and impact reports from the ground.",
    color: "from-yellow-500/20 to-transparent",
    iconColor: "text-yellow-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden bg-[#1a0a0d] text-white">
      {/* Production-Ready Animated Gradient Background - Always Dark */}
      <motion.div 
        animate={{ 
          background: [
            "radial-gradient(circle at 100% 0%, #2e0d11 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, #2e0d11 0%, transparent 50%)",
            "radial-gradient(circle at 100% 0%, #2e0d11 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0"
      />

      {/* Blueprint Grid Pattern */}
      <div 
        className="absolute inset-0 z-1 opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(to right, #E81C3F 1px, transparent 1px), linear-gradient(to bottom, #E81C3F 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30 inline-block mb-4"
          >
            How it works
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight"
          >
            Simple, transparent, <br/>
            <span className="text-brand-emerald">and direct.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-base max-w-lg mx-auto leading-relaxed"
          >
            Whether you're supporting a cause or starting your own, OrigoAid makes it simple.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative p-6 rounded-[24px] bg-white/5 backdrop-blur-xl border border-white/10 hover:border-brand-emerald/40 transition-all group overflow-hidden shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-brand-emerald group-hover:text-white transition-all ${step.iconColor}`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2 tracking-tight text-white group-hover:text-brand-emerald transition-colors">{step.title}</h3>
                <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
