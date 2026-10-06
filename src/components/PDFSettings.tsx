import { Settings2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { PDFSettings, ImageQuality } from "@/types";

interface PDFSettingsPanelProps {
  settings: PDFSettings;
  onChange: (settings: PDFSettings) => void;
}

const PAGE_SIZE_OPTIONS: { value: PDFSettings["pageSize"]; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
  { value: "legal", label: "Legal" },
  { value: "a3", label: "A3" },
  { value: "a5", label: "A5" },
];

const ORIENTATION_OPTIONS: { value: PDFSettings["orientation"]; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

const FIT_OPTIONS: { value: PDFSettings["imageFit"]; label: string }[] = [
  { value: "fit", label: "Fit" },
  { value: "fill", label: "Fill" },
  { value: "original", label: "Original Size" },
];

const MARGIN_OPTIONS: { value: PDFSettings["margin"]; label: string }[] = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
];

const QUALITY_LABELS: Record<ImageQuality, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function PDFSettingsPanel({
  settings,
  onChange,
}: PDFSettingsPanelProps) {
  const update = <K extends keyof PDFSettings>(
    key: K,
    value: PDFSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const qualityIndex = ["low", "medium", "high"].indexOf(settings.quality);

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.value);
    const qualities: ImageQuality[] = ["low", "medium", "high"];
    update("quality", qualities[index]);
  };

  return (
    <div className="rounded-2xl border border-border-soft bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-gold" />
        <h3 className="font-serif text-xl font-semibold text-navy">
          PDF Settings
        </h3>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">
            Page Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PAGE_SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => update("pageSize", option.value)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                  settings.pageSize === option.value
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border-soft bg-white text-charcoal/80 hover:border-gold/50 hover:text-gold"
                )}
                aria-pressed={settings.pageSize === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">
            Orientation
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ORIENTATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => update("orientation", option.value)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                  settings.orientation === option.value
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border-soft bg-white text-charcoal/80 hover:border-gold/50 hover:text-gold"
                )}
                aria-pressed={settings.orientation === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">
            Image Fit
          </label>
          <div className="grid grid-cols-3 gap-2">
            {FIT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => update("imageFit", option.value)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                  settings.imageFit === option.value
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border-soft bg-white text-charcoal/80 hover:border-gold/50 hover:text-gold"
                )}
                aria-pressed={settings.imageFit === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">
            Margins
          </label>
          <div className="grid grid-cols-4 gap-2">
            {MARGIN_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => update("margin", option.value)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-sm font-medium transition-all",
                  settings.margin === option.value
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border-soft bg-white text-charcoal/80 hover:border-gold/50 hover:text-gold"
                )}
                aria-pressed={settings.margin === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border-soft pt-5">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="quality-slider"
            className="text-sm font-medium text-charcoal"
          >
            Image Quality
          </label>
          <span className="rounded-md bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">
            {QUALITY_LABELS[settings.quality]}
          </span>
        </div>
        <input
          id="quality-slider"
          type="range"
          min={0}
          max={2}
          step={1}
          value={qualityIndex}
          onChange={handleQualityChange}
          className="w-full"
          aria-valuetext={QUALITY_LABELS[settings.quality]}
        />
        <div className="mt-2 flex justify-between text-xs text-text-muted">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          Higher quality produces larger files with sharper images.
        </p>
      </div>
    </div>
  );
}
