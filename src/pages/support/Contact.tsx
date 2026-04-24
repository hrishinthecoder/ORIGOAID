import { useState } from "react";
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const REASONS = [
  "General question",
  "Issue with a donation",
  "Report a problem",
  "Partnership inquiry",
  "Press / media",
  "Organizer support",
];

export default function Contact() {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in name, email, and your message.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    toast.success("Thanks! We'll respond within one business day.");
    setName(""); setEmail(""); setMessage(""); setReason(REASONS[0]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We read every message. Usual response time: under 24 hours.
            </p>
          </header>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Form */}
            <section className="card-elevated p-6 md:p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Your name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anisur Rahman"
                    className="h-11"
                  />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    className="h-11"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">What's this about?</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind…"
                  rows={7}
                  maxLength={1500}
                />
                <div className="text-[11px] text-muted-foreground text-right mt-1">
                  {message.length} / 1500
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={submit}
                  disabled={sending}
                  className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark"
                >
                  {sending ? "Sending…" : (<><Send className="w-4 h-4 mr-1.5" /> Send message</>)}
                </Button>
              </div>
            </section>

            {/* Sidebar */}
            <aside className="space-y-3">
              <div className="card-elevated p-5">
                <h3 className="font-display font-bold mb-3">Reach us directly</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">hello@origoaid.bd</div>
                      <div className="text-xs text-muted-foreground">General + support</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">+880 1700 000 000</div>
                      <div className="text-xs text-muted-foreground">Mon–Fri · 10:00–18:00</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">Banani, Dhaka 1213</div>
                      <div className="text-xs text-muted-foreground">Bangladesh</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card-elevated p-5 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Response time
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We reply to all messages within <strong className="text-foreground">one business day</strong>.
                  Urgent safety issues? Use the <a href="/report" className="text-primary hover:underline">Report a campaign</a> page.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
