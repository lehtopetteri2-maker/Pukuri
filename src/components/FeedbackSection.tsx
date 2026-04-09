import { useState, useEffect } from "react";
import { Star, Send, MessageSquareHeart, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage, TranslationKey } from "@/lib/i18n";
import { AgeGroup } from "@/lib/weatherData";
import emailjs from "@emailjs/browser";

// ─── EmailJS configuration ───────────────────────────────────
const EMAILJS_SERVICE_ID = "service_xtocc7d";
const EMAILJS_TEMPLATE_ID = "template_cewm9fd";
const EMAILJS_PUBLIC_KEY = "h0dKeSIzygs76pRKA";
// ──────────────────────────────────────────────────────────────

interface FeedbackSectionProps {
  ageGroup?: AgeGroup;
}

const FeedbackSection = ({ ageGroup }: FeedbackSectionProps) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSend = async () => {
    if (rating === 0) return;

    setSending(true);
    try {
      const templateParams = {
        rating: `${"⭐".repeat(rating)} (${rating}/5)`,
        message: text || "(ei tekstipalautetta)",
        child_name: "(ei annettu)",
        child_age_group: ageGroup
          ? t(`age.${ageGroup}` as TranslationKey)
          : "Ei valittu",
        timestamp: new Date().toLocaleString("fi-FI"),
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log("EmailJS status:", response);
      setSubmitted(true);
      setRating(0);
      setText("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("[Säävahti] EmailJS error:", err);
      import("sonner").then(({ toast }) =>
        toast.error(
          "Lähetys epäonnistui. Tarkista yhteys tai yritä myöhemmin uudelleen."
        )
      );
    } finally {
      setSending(false);
    }
  };

  const displayRating = hoveredRating || rating;

  if (submitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center space-y-2">
          <MessageSquareHeart className="h-8 w-8 text-primary mx-auto" />
          <p className="text-sm font-medium text-foreground">Kiitos palautteesta! Se auttaa kehittämään Pukuria.</p>
          <p className="text-xs text-muted-foreground">{t("feedback.thanksDesc")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <MessageSquareHeart className="h-4 w-4" />
          {t("feedback.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star}/5`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= displayRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
        <Textarea
          placeholder={t("feedback.placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="resize-none text-sm"
          rows={3}
        />
        <Button
          onClick={handleSend}
          disabled={rating === 0 || sending}
          className="w-full gap-2"
          size="sm"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("feedback.sending")}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {t("feedback.send")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
