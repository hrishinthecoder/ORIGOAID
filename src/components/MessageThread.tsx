import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  organizerName: string;
  /** Visual height of the scrollable area, e.g. "h-[460px]" */
  heightClass?: string;
}

export default function MessageThread({
  slug,
  organizerName,
  heightClass = "h-[460px]",
}: Props) {
  const messages       = useStore((s) => s.messages);
  const sendMessage    = useStore((s) => s.sendMessage);
  const markThreadRead = useStore((s) => s.markThreadRead);

  const thread = messages[slug] || [];
  const [text, setText] = useState("");

  // Scroll container — we manipulate its scrollTop directly instead of using
  // element.scrollIntoView(), which was scrolling the whole page.
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.length]);

  // Mark the thread as read any time it's visible or a new message lands in it.
  // This clears the navbar badge automatically.
  useEffect(() => {
    markThreadRead(slug);
  }, [slug, thread.length, markThreadRead]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendMessage(slug, organizerName, t);
    setText("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={cn("card-elevated p-4 md:p-5 flex flex-col", heightClass)}>
      {/* Thread list */}
      <div ref={listRef} className="flex-1 overflow-y-auto pr-2 space-y-3">
        {thread.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
            <MessageCircle className="w-10 h-10 opacity-30" />
            <p className="text-sm max-w-xs">
              Say hi to {organizerName}. Ask about impact, updates, or how to get involved.
            </p>
          </div>
        ) : (
          thread.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.from === "me" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                  m.from === "me"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary rounded-bl-sm",
                )}
              >
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                <div
                  className={cn(
                    "text-[10px] mt-1 opacity-70",
                    m.from === "me" ? "text-primary-foreground" : "",
                  )}
                >
                  {timeAgo(m.at)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 pt-3 border-t border-border mt-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${organizerName}…`}
          onKeyDown={onKeyDown}
          className="h-11"
        />
        <Button
          onClick={send}
          disabled={!text.trim()}
          className="rounded-full h-11 px-4 bg-gradient-to-r from-primary to-brand-emerald-dark"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
