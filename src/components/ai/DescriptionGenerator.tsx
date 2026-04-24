import { useState } from "react";
import { Sparkles, Loader2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateCampaignDescription, GenerateCampaignInput, hasAIKey } from "@/lib/ai";
import { toast } from "sonner";

interface Props {
  input: GenerateCampaignInput;
  onUse: (text: string) => void;
  disabled?: boolean;
}

export default function DescriptionGenerator({ input, onUse, disabled }: Props) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!input.title || !input.category) {
      toast.error("Please enter a title and pick a category first.");
      return;
    }
    setLoading(true);
    try {
      const text = await generateCampaignDescription(input);
      setOutput(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm">AI description assist</div>
            <div className="text-[11px] text-muted-foreground">
              {hasAIKey() ? "Claude-powered" : "Template-based (add API key for AI)"}
            </div>
          </div>
        </div>
        <Button
          size="sm"
          type="button"
          disabled={loading || disabled}
          onClick={generate}
          className="rounded-full"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span className="ml-2">{output ? "Regenerate" : "Generate"}</span>
        </Button>
      </div>

      {output && (
        <div className="space-y-3">
          <div className="rounded-lg bg-background border border-border p-3 text-sm whitespace-pre-line max-h-60 overflow-y-auto leading-relaxed">
            {output}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied to clipboard");
              }}
              className="rounded-full"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onUse(output);
                toast.success("Applied to description");
              }}
              className="rounded-full"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" /> Use this
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
