import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ShieldCheck, Upload, Mail, Phone, MapPin, Globe, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { ProfileType } from "@/data/campaigns";
import { toast } from "sonner";

export default function Profile() {
  const nav = useNavigate();
  const { user, isAuthed } = useStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [type, setType] = useState<ProfileType>(user?.profileType || "Individual");
  const [website, setWebsite] = useState("");

  if (!isAuthed || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container max-w-md text-center card-elevated p-10">
            <h1 className="font-display text-2xl font-bold mb-2">Sign in required</h1>
            <Button onClick={() => nav("/login")}>Sign in</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const save = () => {
    // Persist via direct mutation of zustand state
    useStore.setState({
      user: { ...user, name, email, phone, bio, location, profileType: type },
    });
    toast.success("Profile updated");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl">
          <header className="mb-8">
            <span className="chip mb-3">Your profile</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Profile settings</h1>
            <p className="text-muted-foreground mt-2">
              The way the world sees you on OrigoAid.
            </p>
          </header>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <aside className="space-y-4">
              <div className="card-elevated p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center text-white text-3xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-display font-bold text-lg">{name}</h3>
                <div className="text-xs text-muted-foreground">{type}</div>
                {user.verified ? (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="mt-3 rounded-full">
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Get verified
                  </Button>
                )}
              </div>

              <div className="card-elevated p-5 bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="font-display font-bold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> KYC documents
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload NID, passport, organization registration, or institution ID to qualify for the verified badge.
                </p>
                <Button variant="outline" size="sm" className="w-full rounded-full">
                  Upload (demo)
                </Button>
              </div>
            </aside>

            <section className="card-elevated p-6 md:p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Display name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Profile type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as ProfileType)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Organization">Organization</SelectItem>
                      <SelectItem value="Group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 pl-9" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} className="h-11 pl-9 font-mono" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dhaka, Bangladesh" className="h-11 pl-9" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className="h-11 pl-9" />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Bio</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people who you are and what you care about."
                  rows={5}
                  maxLength={400}
                />
                <div className="text-[11px] text-muted-foreground text-right mt-1">{bio.length} / 400</div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={save} className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark">
                  <Save className="w-4 h-4 mr-1.5" /> Save changes
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      
    </div>
  );
}

