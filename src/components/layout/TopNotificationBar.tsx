import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { useSiteConfig } from "@/hooks/useAdminData";

interface TopNotificationBarProps {
  messages?: string[];
}

const TopNotificationBar = ({ messages = [] }: TopNotificationBarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { data: siteConfig } = useSiteConfig();

  const displayMessages = useMemo(() => {
    if (siteConfig && siteConfig.show_promo_bar === false) return [];
    if (messages.length > 0) return messages;
    if (!siteConfig?.announcement_text) return [];
    const parts = [siteConfig.announcement_text];
    if (siteConfig.countdown_end) {
      const formatted = format(new Date(siteConfig.countdown_end), "PPP");
      parts.push(`শেষ সময়: ${formatted}`);
    }
    return [parts.join(" • ")];
  }, [messages, siteConfig]);

  if (!isVisible || displayMessages.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 relative overflow-hidden">
      <div className="flex items-center justify-center">
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="inline-flex animate-slide-left">
            {displayMessages.map((msg, idx) => (
              <span key={idx} className="mx-8 text-sm font-medium">
                {msg}
              </span>
            ))}
            {displayMessages.map((msg, idx) => (
              <span key={`dup-${idx}`} className="mx-8 text-sm font-medium">
                {msg}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TopNotificationBar;
