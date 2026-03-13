import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DualRecommendation } from "@/lib/dualRecommendation";
import { useLanguage, TranslationKey } from "@/lib/i18n";
import { AgeGroup } from "@/lib/weatherData";

interface ShareButtonProps {
  dual: DualRecommendation;
  ageGroup: AgeGroup;
}

export default function ShareButton({ dual, ageGroup }: ShareButtonProps) {
  const { t } = useLanguage();

  const buildMessage = () => {
    const ageName = t(`age.${ageGroup}` as TranslationKey);
    const morningItems = dual.morningClothing.map((c) => `${c.emoji} ${c.name}`).join(", ");
    const afternoonItems = dual.isDual
      ? dual.afternoonClothing.map((c) => `${c.emoji} ${c.name}`).join(", ")
      : "";

    let msg = `${t("share.messageIntro")} 🌦️\n`;
    msg += `👶 ${ageName}\n`;
    msg += `🌅 ${t("dual.morning")}: ${morningItems}\n`;
    if (dual.isDual) {
      msg += `☀️ ${t("dual.afternoon")}: ${afternoonItems}\n`;
    }
    if (dual.mudFactor) {
      msg += `💧 ${t("share.rememberMud")}\n`;
    }
    msg += `\n🔗 https://saavahti-weather-buddy.lovable.app`;
    return msg;
  };

  const handleShare = async () => {
    const text = buildMessage();

    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // user cancelled or not supported
      }
    }

    // Fallback: WhatsApp
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <Button
      variant="outline"
      className="w-full gap-2 border-primary/20 hover:bg-primary/5"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
      {t("share.button")}
    </Button>
  );
}
