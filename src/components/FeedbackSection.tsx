import { useState } from "react";
import { Star, Send, MessageSquareHeart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const FeedbackSection = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSend = () => {
    const subject = encodeURIComponent("Säävahti-sovelluksen palaute");
    const body = encodeURIComponent(
      `Tähtiarvosana: ${"⭐".repeat(rating)} (${rating}/5)\n\nPalaute:\n${text}`
    );
    window.open(`mailto:lehtopetteri@hotmail.com?subject=${subject}&body=${body}`, "_self");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setText("");
    }, 4000);
  };

  const displayRating = hoveredRating || rating;

  if (submitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center space-y-2">
          <MessageSquareHeart className="h-8 w-8 text-primary mx-auto" />
          <p className="text-sm font-medium text-foreground">
            Kiitos palautteestasi!
          </p>
          <p className="text-xs text-muted-foreground">
            Autat meitä tekemään Säävahdista paremman.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <MessageSquareHeart className="h-4 w-4" />
          Anna palautetta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
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
          placeholder="Mitä voisimme parantaa?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="resize-none text-sm"
          rows={3}
        />

        <Button
          onClick={handleSend}
          disabled={rating === 0}
          className="w-full gap-2"
          size="sm"
        >
          <Send className="h-4 w-4" />
          Lähetä palaute
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
