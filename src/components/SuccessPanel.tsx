import { CheckCircle, Download, RotateCcw, FileText } from "lucide-react";
import { formatFileSize } from "@/utils/format";

interface SuccessPanelProps {
  pageCount: number;
  estimatedSize: number;
  onDownload: () => void;
  onConvertMore: () => void;
}

export function SuccessPanel({
  pageCount,
  estimatedSize,
  onDownload,
  onConvertMore,
}: SuccessPanelProps) {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/5 to-white p-8 text-center shadow-md sm:p-12">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle className="h-8 w-8 text-emerald-600" />
      </div>

      <h3 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
        Your PDF is ready!
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
        Your images have been converted into a single PDF document.
      </p>

      <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 rounded-xl border border-border-soft bg-white p-4 text-left shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/5">
            <FileText className="h-5 w-5 text-navy" />
          </div>
          <div>
            <p className="text-sm font-medium text-navy">images-to-pdf.pdf</p>
            <p className="text-xs text-text-muted">
              {pageCount} {pageCount === 1 ? "page" : "pages"} •{" "}
              {formatFileSize(estimatedSize)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={onDownload}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gold hover:shadow-md sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
        <button
          onClick={onConvertMore}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-soft bg-white px-6 py-3 text-sm font-medium text-charcoal transition-all hover:border-gold/50 hover:text-gold sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" />
          Convert More Images
        </button>
      </div>
    </div>
  );
}
