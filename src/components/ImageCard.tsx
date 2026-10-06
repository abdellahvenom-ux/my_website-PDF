import { RotateCcw, RotateCw, GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/format";
import type { ImageItem } from "@/types";

interface ImageCardProps {
  image: ImageItem;
  index: number;
  total: number;
  isDragging?: boolean;
  onRotateLeft: (id: string) => void;
  onRotateRight: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export function ImageCard({
  image,
  index,
  total,
  isDragging,
  onRotateLeft,
  onRotateRight,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: ImageCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md",
        isDragging ? "dragging border-gold/50" : "border-border-soft"
      )}
      aria-label={`Image ${index + 1}: ${image.name}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-cream">
        <div className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white shadow-sm">
          {index + 1}
        </div>

        <img
          src={image.previewUrl}
          alt={image.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ transform: `rotate(${image.rotation}deg)` }}
          draggable={false}
          loading="lazy"
        />

      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-navy" title={image.name}>
          {image.name}
        </p>
        <p className="mt-0.5 text-xs text-text-muted">
          {image.width} × {image.height}px • {formatFileSize(image.size)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onRotateLeft(image.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-soft text-charcoal/70 transition-colors hover:border-gold/50 hover:text-gold"
            aria-label={`Rotate ${image.name} left`}
            title="Rotate left"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRotateRight(image.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-soft text-charcoal/70 transition-colors hover:border-gold/50 hover:text-gold"
            aria-label={`Rotate ${image.name} right`}
            title="Rotate right"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-soft text-charcoal/70 transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40 sm:hidden"
            aria-label={`Move ${image.name} up`}
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-soft text-charcoal/70 transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40 sm:hidden"
            aria-label={`Move ${image.name} down`}
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-soft text-danger/70 transition-colors hover:border-danger/50 hover:bg-danger hover:text-white sm:hidden"
            aria-label={`Delete ${image.name}`}
            title="Delete image"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="hidden h-8 w-8 items-center justify-center rounded-lg border border-border-soft text-danger/70 transition-colors hover:border-danger/50 hover:bg-danger hover:text-white sm:flex"
            aria-label={`Delete ${image.name}`}
            title="Delete image"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div
            className="hidden h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-border-soft text-charcoal/40 active:cursor-grabbing sm:flex"
            aria-label="Drag to reorder"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
