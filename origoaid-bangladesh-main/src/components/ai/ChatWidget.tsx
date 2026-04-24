import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatReply, ChatMessage } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

const SEED: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hi! I'm OrigoBot. I can help you find campaigns, explain payment methods, or help you start your own. What's on your mind?",
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(SEED);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  
  // Start as a small circular icon in the Hero area (near the top-left of the headline)
  // Transition to the bottom-right corner as the user scrolls
  const x = useTransform(scrollY, [0, 400], ["40px", "calc(100% - 80px)"]);
  const y = useTransform(scrollY, [0, 400], ["280px", "calc(100vh - 100px)"]);
  const scale = useTransform(scrollY, [0, 400], [0.9, 1]);

  const smoothX = useSpring(x, { stiffness: 120, damping: 25 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 25 });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
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
      setMessages([...next, { role: "assistant", content: "Sorry, I'm offline. Try later!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Small Icon - Starts in Hero, moves to corner */}
      <motion.div
        style={{ 
          left: smoothX, 
          top: smoothY, 
          scale,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed z-[100] w-14 h-14 cursor-pointer rounded-2xl shadow-2xl shadow-brand-emerald/40 overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-emerald to-brand-emerald-dark"
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="w-6 h-6 text-white" />
        
        {/* Subtle Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white rounded-full mix-blend-overlay" 
        />
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="fixed inset-0 md:inset-auto md:bottom-28 md:right-8 z-[110] w-full md:w-[400px] h-full md:h-[600px] bg-card/95 backdrop-blur-2xl border border-white/10 md:rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-5 bg-gradient-to-r from-brand-emerald to-brand-emerald-dark text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">OrigoBot</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-70">AI Support</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm", m.role === "user" ? "bg-brand-emerald text-white" : "bg-muted text-brand-emerald")}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm", m.role === "user" ? "bg-brand-emerald text-white" : "bg-muted text-foreground")}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Bot className="w-4 h-4" /></div><div className="bg-muted px-4 py-3 rounded-2xl animate-pulse text-xs">Thinking...</div></div>}
              <div ref={endRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-4 border-t border-border bg-card flex gap-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="flex-1 bg-muted rounded-2xl px-5 py-3 text-sm outline-none border border-transparent focus:border-brand-emerald/30" />
              <Button type="submit" size="icon" className="w-12 h-12 rounded-2xl bg-brand-emerald hover:bg-brand-emerald-dark" disabled={!input.trim() || loading}><Send className="w-5 h-5" /></Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
