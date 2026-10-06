export type PageSize =
  | "auto"
  | "a4"
  | "letter"
  | "legal"
  | "a3"
  | "a5";

export type Orientation = "auto" | "portrait" | "landscape";

export type ImageFit = "fit" | "fill" | "original";

export type Margin = "none" | "small" | "normal" | "large";

export type ImageQuality = "low" | "medium" | "high";

export interface PDFSettings {
  pageSize: PageSize;
  orientation: Orientation;
  imageFit: ImageFit;
  margin: Margin;
  quality: ImageQuality;
}

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  width: number;
  height: number;
  rotation: number;
}

export interface ConversionResult {
  blob: Blob;
  pageCount: number;
  estimatedSize: number;
}
