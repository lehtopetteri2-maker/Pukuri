import { useState, useEffect } from "react";
import { X, Share, Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const DISMISS_KEY = "pukuri-pwa-dismissed";

export default function PwaInstallBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on mobile and if not dismissed this session
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    if (isMobile && !dismissed && !isStandalone) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div className="relative rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-sky/10 border border-primary/15 p-4 animate-fade-in">
      <button
        onClick={dismiss}
        className="absolute top-2.5 right-2.5 p-1 rounded-md hover:bg-muted/60 transition-colors"
        aria-label={t("pwa.close")}
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
          {isIos ? (
            <Share className="h-5 w-5 text-primary" />
          ) : (
            <Download className="h-5 w-5 text-primary" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-display font-700 text-foreground leading-snug">
            {t("pwa.title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {isIos ? t("pwa.instructionIos") : t("pwa.instructionAndroid")}
          </p>
        </div>
      </div>
    </div>
  );
}
