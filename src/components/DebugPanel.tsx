import { useState } from "react";
import { ChevronDown, ChevronUp, Bug } from "lucide-react";
import { WeatherData } from "@/lib/weatherData";

interface DebugPanelProps {
  weather: WeatherData;
  onOverride: (tempOverride: number | null) => void;
}

const QUICK_TESTS = [
  { label: "-15 °C", value: -15, desc: "Lapaset & kerrastot" },
  { label: "+2 °C", value: 2, desc: "Pipo + hanskat + kuravaatteet" },
  { label: "+15 °C", value: 15, desc: "Kevyt takki, ei pipoa" },
] as const;

export default function DebugPanel({ weather, onOverride }: DebugPanelProps) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(weather.temperature);
  const [active, setActive] = useState(false);

  const apply = (v: number) => {
    setTemp(v);
    setActive(true);
    onOverride(v);
  };

  const reset = () => {
    setActive(false);
    onOverride(null);
  };

  return (
    <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/30 p-3 space-y-3 animate-fade-in">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left text-sm font-bold text-red-700 dark:text-red-400"
      >
        <Bug className="h-4 w-4" />
        🛠️ TESTIPANEELI (Debug) — {active ? `Ohitus: ${temp} °C` : "Ei aktiivinen"}
        {open ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
      </button>

      {open && (
        <div className="space-y-4">
          {/* Slider */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-red-600 dark:text-red-400">
              Lämpötilan simulointi: {temp} °C
            </label>
            <input
              type="range"
              min={-30}
              max={25}
              step={1}
              value={temp}
              onChange={(e) => apply(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>-30 °C</span>
              <span>0 °C</span>
              <span>+25 °C</span>
            </div>
          </div>

          {/* Quick test buttons */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-red-600 dark:text-red-400">Pikatestit:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TESTS.map((qt) => (
                <button
                  key={qt.value}
                  onClick={() => apply(qt.value)}
                  className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${
                    active && temp === qt.value
                      ? "bg-red-500 text-white border-red-600"
                      : "bg-white dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100"
                  }`}
                >
                  {qt.label}
                  <span className="ml-1 opacity-70">({qt.desc})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {active && (
            <button
              onClick={reset}
              className="text-xs px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 font-medium"
            >
              ↩ Palauta oikea säädata
            </button>
          )}

          <p className="text-[10px] text-red-400 italic">
            ⚠️ Testipaneeli — poista ennen julkaisua!
          </p>
        </div>
      )}
    </div>
  );
}
