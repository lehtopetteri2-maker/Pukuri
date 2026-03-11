import { useState, useRef, useCallback, useEffect } from "react";
import { AgeGroup } from "@/lib/weatherData";
import { Camera, ImagePlus, Maximize2, X, RefreshCw } from "lucide-react";

interface WeeklyScheduleProps {
  ageGroup: AgeGroup;
}

const STORAGE_KEY_PREFIX = "saavahti-viikko-ohjelma-";

function getStoredImage(ageGroup: AgeGroup): string | null {
  return localStorage.getItem(STORAGE_KEY_PREFIX + ageGroup);
}

function storeImage(ageGroup: AgeGroup, dataUrl: string): void {
  localStorage.setItem(STORAGE_KEY_PREFIX + ageGroup, dataUrl);
}

function removeImage(ageGroup: AgeGroup): void {
  localStorage.removeItem(STORAGE_KEY_PREFIX + ageGroup);
}

export default function WeeklySchedule({ ageGroup }: WeeklyScheduleProps) {
  const [image, setImage] = useState<string | null>(() => getStoredImage(ageGroup));
  const [fullscreen, setFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when ageGroup changes
  useEffect(() => {
    setImage(getStoredImage(ageGroup));
  }, [ageGroup]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        storeImage(ageGroup, dataUrl);
        setImage(dataUrl);
      };
      reader.readAsDataURL(file);
      // Reset so same file can be re-selected
      e.target.value = "";
    },
    [ageGroup],
  );

  const handleRemove = useCallback(() => {
    removeImage(ageGroup);
    setImage(null);
  }, [ageGroup]);

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
                Näytä koko näytöllä
              </span>
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
                Poista
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
              Lisää viikko-ohjelma
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

      {/* Fullscreen overlay */}
      {fullscreen && image && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 bg-card/90 rounded-full p-2 shadow-lg hover:bg-card transition-colors"
            onClick={() => setFullscreen(false)}
          >
            <X className="h-6 w-6 text-foreground" />
          </button>
          <img
            src={image}
            alt="Viikko-ohjelma — koko näyttö"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
