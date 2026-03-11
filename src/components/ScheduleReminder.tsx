import { AgeGroup } from "@/lib/weatherData";
import { useLanguage } from "@/lib/i18n";

interface ScheduleReminderProps {
  ageGroup: AgeGroup;
  onOpen: () => void;
}

const STORAGE_KEY_PREFIX = "saavahti-viikko-ohjelma-";

export default function ScheduleReminder({ ageGroup, onOpen }: ScheduleReminderProps) {
  const { t } = useLanguage();
  const hasImage = !!localStorage.getItem(STORAGE_KEY_PREFIX + ageGroup);
  if (!hasImage) return null;

  return (
    <button
      onClick={onOpen}
      className="w-full flex items-center gap-2 rounded-lg bg-accent/60 border border-accent p-3 text-left hover:bg-accent/80 transition-colors animate-fade-in"
    >
      <span className="text-lg">📋</span>
      <span className="text-sm font-display font-600 text-accent-foreground">
        {t("scheduleReminder.text")}
      </span>
    </button>
  );
}
