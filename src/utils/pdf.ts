import jsPDF from "jspdf";
import type { ImageItem, PDFSettings, ConversionResult } from "@/types";

const PAGE_SIZES_MM: Record<
  Exclude<PDFSettings["pageSize"], "auto">,
  { width: number; height: number }
> = {
  a3: { width: 297, height: 420 },
  a4: { width: 210, height: 297 },
  a5: { width: 148, height: 210 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
};

const MARGINS_MM: Record<PDFSettings["margin"], number> = {
  none: 0,
  small: 5,
  normal: 10,
  large: 20,
};

const QUALITY_RATIOS: Record<PDFSettings["quality"], number> = {
  low: 0.5,
  medium: 0.75,
  high: 0.92,
};

const PDF_DPI = 150;
const PX_PER_MM = PDF_DPI / 25.4;
const MAX_CANVAS_PIXELS = 24_000_000;

interface ImageDimensions {
  width: number;
  height: number;
}

interface ProcessedImage {
  dataUrl: string;
  width: number;
  height: number;
}

function getRotatedDimensions(
  img: HTMLImageElement,
  rotation: number
): ImageDimensions {
  const isSwapped = rotation === 90 || rotation === 270;
  return {
    width: isSwapped ? img.naturalHeight : img.naturalWidth,
    height: isSwapped ? img.naturalWidth : img.naturalHeight,
  };
}

function pxToMm(px: number): number {
  return px / PX_PER_MM;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function calculateAutoPageSize(
  imgWidth: number,
  imgHeight: number,
  marginMm: number
): ImageDimensions {
  return {
    width: pxToMm(imgWidth) + marginMm * 2,
    height: pxToMm(imgHeight) + marginMm * 2,
  };
}

function getPageSize(
  settings: PDFSettings,
  imgWidth: number,
  imgHeight: number
): ImageDimensions {
  const margin = MARGINS_MM[settings.margin];

  if (settings.pageSize === "auto") {
    return calculateAutoPageSize(imgWidth, imgHeight, margin);
  }

  const size = PAGE_SIZES_MM[settings.pageSize];

  if (settings.orientation === "landscape") {
    return { width: size.height, height: size.width };
  }

  if (settings.orientation === "portrait") {
    return { width: size.width, height: size.height };
  }

  // Auto orientation
  if (imgWidth > imgHeight) {
    return { width: size.height, height: size.width };
  }
  return { width: size.width, height: size.height };
}

function getFitScale(
  pageWidth: number,
  pageHeight: number,
  marginMm: number,
  imgWidthPx: number,
  imgHeightPx: number,
  fit: PDFSettings["imageFit"]
): { widthMm: number; heightMm: number } {
  const availableWidth = pageWidth - marginMm * 2;
  const availableHeight = pageHeight - marginMm * 2;
  const imgAspect = imgWidthPx / imgHeightPx;
  const availableAspect = availableWidth / availableHeight;

  if (fit === "fill") {
    // Cover the available area
    if (imgAspect > availableAspect) {
      return {
        heightMm: availableHeight,
        widthMm: availableHeight * imgAspect,
      };
    }
    return {
      widthMm: availableWidth,
      heightMm: availableWidth / imgAspect,
    };
  }

  if (fit === "original") {
    const widthMm = pxToMm(imgWidthPx);
    const heightMm = pxToMm(imgHeightPx);
    if (widthMm > availableWidth || heightMm > availableHeight) {
      const scale = Math.min(availableWidth / widthMm, availableHeight / heightMm);
      return { widthMm: widthMm * scale, heightMm: heightMm * scale };
    }
    return { widthMm, heightMm };
  }

  // Fit
  if (imgAspect > availableAspect) {
    return { widthMm: availableWidth, heightMm: availableWidth / imgAspect };
  }
  return { widthMm: availableHeight * imgAspect, heightMm: availableHeight };
}

function calculateImagePlacement(
  pageWidth: number,
  pageHeight: number,
  marginMm: number,
  imgWidthPx: number,
  imgHeightPx: number,
  fit: PDFSettings["imageFit"]
): { x: number; y: number; width: number; height: number } {
  const availableWidth = pageWidth - marginMm * 2;
  const availableHeight = pageHeight - marginMm * 2;
  const { widthMm, heightMm } = getFitScale(
    pageWidth,
    pageHeight,
    marginMm,
    imgWidthPx,
    imgHeightPx,
    fit
  );

  const x = marginMm + (availableWidth - widthMm) / 2;
  const y = marginMm + (availableHeight - heightMm) / 2;

  return { x, y, width: widthMm, height: heightMm };
}

function cropImageData(
  img: HTMLImageElement,
  rotation: number,
  targetAspect: number,
  quality: number
): ProcessedImage {
  const dims = getRotatedDimensions(img, rotation);
  let cropWidth = dims.width;
  let cropHeight = dims.height;

  const imgAspect = dims.width / dims.height;

  if (imgAspect > targetAspect) {
    // Too wide: crop left/right
    cropWidth = dims.height * targetAspect;
  } else if (imgAspect < targetAspect) {
    // Too tall: crop top/bottom
    cropHeight = dims.width / targetAspect;
  }

  // Downsample if needed
  const cropPixelCount = cropWidth * cropHeight;
  let scale = 1;
  if (cropPixelCount > MAX_CANVAS_PIXELS) {
    scale = Math.sqrt(MAX_CANVAS_PIXELS / cropPixelCount);
  }

  const outputWidth = Math.max(1, Math.floor(cropWidth * scale));
  const outputHeight = Math.max(1, Math.floor(cropHeight * scale));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, outputWidth, outputHeight);

  ctx.translate(outputWidth / 2, outputHeight / 2);
  ctx.rotate((rotation * Math.PI) / 180);

  const srcDrawWidth = rotation === 90 || rotation === 270 ? outputHeight : outputWidth;
  const srcDrawHeight = rotation === 90 || rotation === 270 ? outputWidth : outputHeight;

  ctx.drawImage(
    img,
    -srcDrawWidth / 2,
    -srcDrawHeight / 2,
    srcDrawWidth,
    srcDrawHeight
  );

  return {
    dataUrl: canvas.toDataURL("image/jpeg", quality),
    width: outputWidth,
    height: outputHeight,
  };
}

function processImage(
  img: HTMLImageElement,
  item: ImageItem,
  quality: number
): ProcessedImage {
  const dims = getRotatedDimensions(img, item.rotation);

  let scale = 1;
  const pixelCount = dims.width * dims.height;
  if (pixelCount > MAX_CANVAS_PIXELS) {
    scale = Math.sqrt(MAX_CANVAS_PIXELS / pixelCount);
  }

  const outputWidth = Math.max(1, Math.floor(dims.width * scale));
  const outputHeight = Math.max(1, Math.floor(dims.height * scale));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, outputWidth, outputHeight);

  ctx.translate(outputWidth / 2, outputHeight / 2);
  ctx.rotate((item.rotation * Math.PI) / 180);

  const drawWidth =
    item.rotation === 90 || item.rotation === 270 ? outputHeight : outputWidth;
  const drawHeight =
    item.rotation === 90 || item.rotation === 270 ? outputWidth : outputHeight;

  ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

  return {
    dataUrl: canvas.toDataURL("image/jpeg", quality),
    width: outputWidth,
    height: outputHeight,
  };
}

export async function generatePDF(
  images: ImageItem[],
  settings: PDFSettings,
  onProgress?: (message: string) => void
): Promise<ConversionResult> {
  if (images.length === 0) {
    throw new Error("No images to convert");
  }

  const quality = QUALITY_RATIOS[settings.quality];
  let pdf: jsPDF | null = null;

  for (let i = 0; i < images.length; i++) {
    onProgress?.(`Preparing images... (${i + 1}/${images.length})`);

    const item = images[i];
    const img = await loadImage(item.previewUrl);
    const dims = getRotatedDimensions(img, item.rotation);
    const pageSize = getPageSize(settings, dims.width, dims.height);
    const margin = MARGINS_MM[settings.margin];

    let processed: ProcessedImage;

    if (settings.imageFit === "fill") {
      const availableWidth = pageSize.width - margin * 2;
      const availableHeight = pageSize.height - margin * 2;
      const targetAspect = availableWidth / availableHeight;
      processed = cropImageData(img, item.rotation, targetAspect, quality);
    } else {
      processed = processImage(img, item, quality);
    }

    const placement = calculateImagePlacement(
      pageSize.width,
      pageSize.height,
      margin,
      processed.width,
      processed.height,
      settings.imageFit
    );

    if (pdf === null) {
      pdf = new jsPDF({
        unit: "mm",
        format: [pageSize.width, pageSize.height],
        compress: true,
      });
    } else {
      pdf.addPage([pageSize.width, pageSize.height]);
    }

    pdf.addImage(
      processed.dataUrl,
      "JPEG",
      placement.x,
      placement.y,
      placement.width,
      placement.height,
      undefined,
      "FAST"
    );
  }

  onProgress?.("Almost ready...");
  const blob = pdf!.output("blob");

  return {
    blob,
    pageCount: images.length,
    estimatedSize: blob.size,
  };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
