import { useRef, useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

interface UploadZoneProps {
  onFilesSelected: (files: FileList) => void;
}

export function UploadZone({ onFilesSelected }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { showToast } = useToast();

  const validateAndProcess = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const validFiles = Array.from(files).filter((file) =>
        ACCEPTED_TYPES.includes(file.type)
      );

      const invalidCount = files.length - validFiles.length;
      if (invalidCount > 0) {
        showToast(
          `${invalidCount} unsupported file(s) skipped. Only JPG, PNG and WEBP are allowed.`,
          "error"
        );
      }

      if (validFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        onFilesSelected(dataTransfer.files);
      }
    },
    [onFilesSelected, showToast]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      validateAndProcess(e.dataTransfer.files);
    },
    [validateAndProcess]
  );

  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 border-dashed bg-white p-8 text-center shadow-sm transition-all duration-300 sm:p-12",
        isDragging
          ? "border-gold bg-gold/[0.03] shadow-md"
          : "border-border-soft hover:border-gold/50 hover:shadow-md"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="Upload images"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="sr-only-file"
        onChange={(e) => {
          validateAndProcess(e.target.files);
          e.target.value = "";
        }}
        aria-hidden="true"
      />

      <div
        className={cn(
          "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/10 transition-transform duration-300",
          isDragging ? "scale-110" : ""
        )}
      >
        <Upload
          className={cn(
            "h-7 w-7 text-gold transition-transform duration-300",
            isDragging ? "-translate-y-1" : ""
          )}
        />
      </div>

      <h3 className="font-serif text-xl font-semibold text-navy sm:text-2xl">
        Drop your images here
      </h3>
      <p className="mt-2 text-sm text-text-muted">or click to browse files</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-text-muted/80">
        <span className="rounded-md bg-cream px-2.5 py-1">JPG</span>
        <span className="text-border-soft">•</span>
        <span className="rounded-md bg-cream px-2.5 py-1">JPEG</span>
        <span className="text-border-soft">•</span>
        <span className="rounded-md bg-cream px-2.5 py-1">PNG</span>
        <span className="text-border-soft">•</span>
        <span className="rounded-md bg-cream px-2.5 py-1">WEBP</span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gold hover:shadow-md"
      >
        Choose Images
      </button>
    </div>
  );
}
