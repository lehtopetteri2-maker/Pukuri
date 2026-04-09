import { Sun, Shirt, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export interface TabItem {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  { id: "today", labelKey: "tab.today", icon: <Sun className="h-5 w-5" /> },
  { id: "outfit", labelKey: "tab.outfit", icon: <Shirt className="h-5 w-5" /> },
  { id: "family", labelKey: "tab.family", icon: <Users className="h-5 w-5" /> },
  { id: "settings", labelKey: "tab.settings", icon: <Settings className="h-5 w-5" /> },
];

interface BottomNavBarProps {
  activeIndex: number;
  onTabChange: (index: number) => void;
}

export const TAB_COUNT = tabs.length;

export default function BottomNavBar({ activeIndex, onTabChange }: BottomNavBarProps) {
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md safe-area-bottom">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(i)}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-2 pt-2.5 transition-colors duration-200",
              i === activeIndex
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            <span className="text-[10px] font-medium leading-tight">
              {t(tab.labelKey as any)}
            </span>
            {i === activeIndex && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
