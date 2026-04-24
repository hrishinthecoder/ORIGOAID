import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, Bot, User, ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatReply, ChatMessage } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SEED: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hi! I'm OrigoBot. I'm here to help you navigate the OrigoAid platform. You can ask me about finding campaigns, payment methods (bKash/Nagad), or how to start your own fundraising journey.",
  },
];

const SUGGESTIONS = [
  "How do I start a campaign?",
  "What payment methods work?",
  "Are there any fees?",
  "How are campaigns verified?",
];

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    
    const next: ChatMessage[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const reply = await chatReply(next);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "I'm having trouble connecting to my brain right now. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground selection:bg-brand-emerald/30 overflow-hidden">
      <Navbar />
      
      {/* Dynamic Animated Background - Theme Sensitive */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-brand-emerald/10 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%] bg-brand-red/5 blur-[150px] rounded-full" 
        />
      </div>

      <main className="flex-1 pt-28 pb-6 flex flex-col container max-w-6xl mx-auto relative z-10 overflow-hidden">
        <div className="flex items-end justify-between mb-6 px-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-emerald">Secure Support Tunnel</span>
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">AI <span className="text-brand-emerald italic">Interface</span>.</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => nav("/")} className="rounded-full border-border/50 hover:bg-muted text-[9px] font-bold uppercase tracking-[0.2em] h-9 px-5">
            <ArrowLeft className="w-3 h-3 mr-2" /> Disconnect
          </Button>
        </div>

        {/* Larger Fixed Size Chat Interface */}
        <div className="flex-1 min-h-[650px] max-h-[850px] bg-card/30 backdrop-blur-3xl border border-border rounded-[40px] md:rounded-[56px] overflow-hidden flex flex-col shadow-2xl mx-4 md:mx-0">
          {/* Header Info */}
          <div className="p-6 md:p-8 bg-muted/20 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald shadow-sm">
                <Bot className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <div className="font-black text-sm tracking-tight uppercase flex items-center gap-2">
                  OrigoBot <span className="text-[9px] bg-brand-emerald/10 px-2 py-0.5 rounded-md text-brand-emerald">PRO</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mt-1">Autonomous Neural Cluster</div>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-8 px-8 py-4 rounded-[24px] bg-background/40 border border-border/50">
              <div className="flex flex-col items-start">
                <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-black">Status</span>
                <span className="text-[11px] font-bold text-brand-emerald">OPERATIONAL</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col items-start">
                <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-black">Architecture</span>
                <span className="text-[11px] font-mono text-brand-emerald font-bold uppercase">L7-Neural</span>
              </div>
            </div>
          </div>

          {/* Messages Area - Internal Scrolling Only */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-10 custom-scrollbar text-[13px]"
          >
            {messages.map((m, i) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={cn(
                  "flex gap-6 md:gap-8",
                  m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm transition-transform hover:scale-105",
                  m.role === "user" 
                    ? "bg-brand-emerald border-brand-emerald text-white" 
                    : "bg-muted border-border text-brand-emerald"
                )}>
                  {m.role === "user" ? <User className="w-5 h-5 md:w-6 md:h-6" /> : <Bot className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] md:max-w-[70%] rounded-[28px] md:rounded-[36px] px-6 md:px-8 py-4 md:py-5 leading-[1.8] font-medium shadow-sm backdrop-blur-md",
                    m.role === "user"
                      ? "bg-brand-emerald text-white rounded-tr-none shadow-brand-emerald/10"
                      : "bg-muted/50 border border-border/50 rounded-tl-none text-foreground/80"
                  )}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-6 md:gap-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-muted flex items-center justify-center border border-border">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-brand-emerald" />
                </div>
                <div className="bg-muted/50 border border-border/50 rounded-[28px] md:rounded-[36px] rounded-tl-none px-6 md:px-8 py-4 md:py-5">
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-brand-emerald" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Suggestions Tray */}
          {messages.length <= 2 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-10 md:px-14 pb-6 flex flex-wrap gap-3 md:gap-4"
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] px-4 md:px-6 py-2.5 md:py-3 rounded-2xl bg-muted hover:bg-brand-emerald hover:text-white transition-all border border-border text-muted-foreground hover:border-brand-emerald shadow-sm"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}

          {/* Input Interface - SHRUNK */}
          <div className="p-6 md:p-8 bg-muted/20 border-t border-border/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-3 md:gap-4 max-w-4xl mx-auto relative group"
            >
              <div className="absolute left-6 md:left-7 top-1/2 -translate-y-1/2 text-brand-emerald/30 group-focus-within:text-brand-emerald transition-colors pointer-events-none">
                <Terminal className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Awaiting directive..."
                className="flex-1 bg-background border border-border rounded-[20px] md:rounded-[24px] pl-14 md:pl-16 pr-6 md:pr-8 py-3.5 md:py-4 text-xs outline-none focus:border-brand-emerald/50 transition-all placeholder:text-muted-foreground/30 shadow-inner"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="w-11 h-11 md:w-14 md:h-14 rounded-[18px] md:rounded-[22px] bg-brand-emerald hover:bg-brand-emerald-dark shadow-xl shadow-brand-emerald/20 shrink-0 transition-all active:scale-95" 
                disabled={!input.trim() || loading}
              >
                <Send className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <div className="mt-8 pb-8">
        <Footer />
      </div>
    </div>
  );
}
