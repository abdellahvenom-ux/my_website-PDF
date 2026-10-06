import { useState, useRef, useCallback, useEffect } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ImagePreview } from "@/components/ImagePreview";
import { PDFSettingsPanel } from "@/components/PDFSettings";
import { ConversionProgress } from "@/components/ConversionProgress";
import { SuccessPanel } from "@/components/SuccessPanel";
import { generatePDF, downloadBlob } from "@/utils/pdf";
import { formatFileSize } from "@/utils/format";
import { generateId } from "@/utils/format";
import { useToast } from "@/hooks/useToast";
import type { ImageItem, PDFSettings, ConversionResult } from "@/types";

const DEFAULT_SETTINGS: PDFSettings = {
  pageSize: "a4",
  orientation: "auto",
  imageFit: "fit",
  margin: "normal",
  quality: "high",
};

function readFileAsImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}

async function createImageItem(file: File): Promise<ImageItem | null> {
  try {
    const previewUrl = URL.createObjectURL(file);
    const img = await readFileAsImage(file);
    return {
      id: generateId(),
      file,
      previewUrl,
      name: file.name,
      size: file.size,
      width: img.naturalWidth,
      height: img.naturalHeight,
      rotation: 0,
    };
  } catch {
    return null;
  }
}

export function Converter() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useState<PDFSettings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<"idle" | "converting" | "success">("idle");
  const [progressMessage, setProgressMessage] = useState("Preparing images...");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const prevImagesRef = useRef<ImageItem[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const currentIds = new Set(images.map((img) => img.id));
    const removed = prevImagesRef.current.filter(
      (img) => !currentIds.has(img.id)
    );
    removed.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    prevImagesRef.current = images;
  }, [images]);

  const handleFilesSelected = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);
      const newItems: ImageItem[] = [];

      for (const file of fileArray) {
        const item = await createImageItem(file);
        if (item) {
          newItems.push(item);
        }
      }

      if (newItems.length > 0) {
        setImages((prev) => [...prev, ...newItems]);
        setStatus("idle");
        setResult(null);
        showToast(
          `Added ${newItems.length} image${newItems.length === 1 ? "" : "s"}`,
          "success"
        );
      }

      if (newItems.length < fileArray.length) {
        const failed = fileArray.length - newItems.length;
        showToast(`${failed} file(s) could not be loaded.`, "error");
      }
    },
    [showToast]
  );

  const handleImagesChange = useCallback((updatedImages: ImageItem[]) => {
    setImages(updatedImages);
  }, []);

  const handleAddMore = useCallback(() => {
    addMoreInputRef.current?.click();
  }, []);

  const handleConvert = useCallback(async () => {
    if (images.length === 0) {
      showToast("Please upload at least one image first.", "error");
      return;
    }

    setStatus("converting");
    setProgressMessage("Preparing images...");

    try {
      const conversionResult = await generatePDF(images, settings, (msg) => {
        setProgressMessage(msg);
      });
      setResult(conversionResult);
      setStatus("success");
      showToast(
        `PDF created: ${conversionResult.pageCount} pages • ${formatFileSize(
          conversionResult.estimatedSize
        )}`,
        "success"
      );
    } catch (error) {
      setStatus("idle");
      showToast(
        error instanceof Error ? error.message : "Failed to create PDF.",
        "error"
      );
    }
  }, [images, settings, showToast]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    downloadBlob(result.blob, "images-to-pdf.pdf");
  }, [result]);

  const handleConvertMore = useCallback(() => {
    setImages([]);
    setResult(null);
    setStatus("idle");
  }, []);

  return (
    <section id="converter" className="scroll-mt-24">
      <input
        ref={addMoreInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="sr-only-file"
        onChange={(e) => {
          if (e.target.files) {
            handleFilesSelected(e.target.files);
          }
          e.target.value = "";
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        {status === "success" && result ? (
          <SuccessPanel
            pageCount={result.pageCount}
            estimatedSize={result.estimatedSize}
            onDownload={handleDownload}
            onConvertMore={handleConvertMore}
          />
        ) : status === "converting" ? (
          <ConversionProgress message={progressMessage} />
        ) : images.length === 0 ? (
          <UploadZone onFilesSelected={handleFilesSelected} />
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border-soft bg-white p-5 shadow-sm sm:p-6">
              <ImagePreview
                images={images}
                onImagesChange={handleImagesChange}
                onAddMore={handleAddMore}
              />
            </div>

            <PDFSettingsPanel settings={settings} onChange={setSettings} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleConvert}
                disabled={images.length === 0}
                className="flex-1 rounded-xl bg-navy px-6 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-gold hover:shadow-lg disabled:cursor-not-allowed disabled:bg-charcoal/40 disabled:shadow-none"
              >
                Convert to PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
