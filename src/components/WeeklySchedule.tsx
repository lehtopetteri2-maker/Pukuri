import { useState, useRef, useCallback, useEffect } from "react";
import { AgeGroup } from "@/lib/weatherData";
import { Camera, ImagePlus, Maximize2, X, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WeeklyScheduleProps {
  ageGroup: AgeGroup;
}

const STORAGE_KEY_PREFIX = "saavahti-viikko-ohjelma-";
const MAX_WIDTH = 1200;

function getStoredImage(ageGroup: AgeGroup): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_PREFIX + ageGroup);
  } catch {
    return null;
  }
}

function storeImage(ageGroup: AgeGroup, dataUrl: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + ageGroup, dataUrl);
  } catch (error) {
    console.error("Error storing image:", error);
    throw error;
  }
}

function removeImage(ageGroup: AgeGroup): void {
  localStorage.removeItem(STORAGE_KEY_PREFIX + ageGroup);
}

function compressImage(file: File, maxWidth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context not available"));

        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function WeeklySchedule({ ageGroup }: WeeklyScheduleProps) {
  const [image, setImage] = useState<string | null>(() => getStoredImage(ageGroup));
  const [fullscreen, setFullscreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastDistRef = useRef<number | null>(null);
  const lastCenterRef = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImage(getStoredImage(ageGroup));
  }, [ageGroup]);

  // Reset zoom when opening/closing fullscreen
  useEffect(() => {
    if (fullscreen) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [fullscreen]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      try {
        const compressed = await compressImage(file, MAX_WIDTH);
        storeImage(ageGroup, compressed);
        setImage(compressed);
        toast.success("Kuva tallennettu!");
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Hups! Kuva on liian suuri tai tallennus epäonnistui. Yritä pienemmällä kuvalla.");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [ageGroup],
  );

  const handleRemove = useCallback(() => {
    removeImage(ageGroup);
    setImage(null);
  }, [ageGroup]);

  // Pinch-to-zoom handlers
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      if (lastDistRef.current !== null && lastCenterRef.current !== null) {
        const ratio = dist / lastDistRef.current;
        setScale((s) => Math.min(Math.max(s * ratio, 1), 5));
        setTranslate((t) => ({
          x: t.x + (cx - lastCenterRef.current!.x),
          y: t.y + (cy - lastCenterRef.current!.y),
        }));
      }
      lastDistRef.current = dist;
      lastCenterRef.current = { x: cx, y: cy };
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastDistRef.current = null;
    lastCenterRef.current = null;
  }, []);

  // Double-tap to reset zoom
  const lastTapRef = useRef(0);
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
    lastTapRef.current = now;
  }, []);

  const ageLabels: Record<AgeGroup, string> = {
    vauva: "Vauvan",
    taapero: "Taaperon",
    "leikki-ikäinen": "Leikki-ikäisen",
    koululainen: "Koululaisen",
  };

  return (
    <>
      <div className="rounded-lg bg-card p-6 shadow-sm border border-border animate-fade-in">
        <h2 className="text-lg font-display font-700 text-foreground mb-1">
          📋 {ageLabels[ageGroup]} viikko-ohjelma
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Lisää kuva lukujärjestyksestä tai päiväkodin viikko-ohjelmasta
        </p>

        {image ? (
          <div className="space-y-3">
            {/* Thumbnail */}
            <div
              className="relative rounded-md overflow-hidden border border-border cursor-pointer group"
              onClick={() => setFullscreen(true)}
            >
              <img
                src={image}
                alt="Viikko-ohjelma"
                className="w-full max-h-60 object-cover transition-transform group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 rounded-full p-2 shadow">
                  <Maximize2 className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 text-[10px] bg-card/80 text-muted-foreground px-2 py-0.5 rounded-full backdrop-blur-sm">
                Katso isona
              </span>
              {/* Change photo icon overlay */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute top-2 right-2 bg-card/90 rounded-full p-1.5 shadow hover:bg-card transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors px-3 py-2 rounded-md border border-primary/20 hover:bg-primary/5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Vaihda kuva
              </button>
              <button
                onClick={handleRemove}
                className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors px-3 py-2 rounded-md border border-destructive/20 hover:bg-destructive/5"
              >
                <X className="h-3.5 w-3.5" />
                Poista kuva
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-3 p-8 rounded-md border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Camera className="h-5 w-5" />
              <ImagePlus className="h-5 w-5" />
            </div>
            <span className="text-sm font-display font-600 text-muted-foreground">
              Lisää lukujärjestys
            </span>
            <span className="text-xs text-muted-foreground/70">
              Ota kuva tai valitse galleriasta
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Fullscreen pinch-to-zoom overlay */}
      {fullscreen && image && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center"
          onClick={() => setFullscreen(false)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="absolute top-4 right-4 z-10 bg-card/90 rounded-full p-2 shadow-lg hover:bg-card transition-colors"
            onClick={() => setFullscreen(false)}
          >
            <X className="h-6 w-6 text-foreground" />
          </button>
          <span className="absolute top-4 left-4 text-card/80 text-xs select-none">
            {scale > 1 ? "Kaksoisnapautus nollataksesi" : "Nipistä zoomataksesi"}
          </span>
          <img
            src={image}
            alt="Viikko-ohjelma — koko näyttö"
            className="max-w-full max-h-full object-contain rounded-lg select-none"
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transition: lastDistRef.current ? "none" : "transform 0.2s ease",
              touchAction: "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDoubleTap();
            }}
            draggable={false}
          />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-card/70 text-xs select-none">
            Sulje
          </span>
        </div>
      )}
    </>
  );
}