import { useState, useRef, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ImageCard } from "@/components/ImageCard";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";
import type { ImageItem } from "@/types";

interface ImagePreviewProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  onAddMore: () => void;
}

export function ImagePreview({
  images,
  onImagesChange,
  onAddMore,
}: ImagePreviewProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);
  const { showToast } = useToast();

  const handleRotateLeft = useCallback(
    (id: string) => {
      onImagesChange(
        images.map((img) =>
          img.id === id ? { ...img, rotation: (img.rotation - 90) % 360 } : img
        )
      );
    },
    [images, onImagesChange]
  );

  const handleRotateRight = useCallback(
    (id: string) => {
      onImagesChange(
        images.map((img) =>
          img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
        )
      );
    },
    [images, onImagesChange]
  );

  const normalizeRotation = (rotation: number): number => {
    return ((rotation % 360) + 360) % 360;
  };

  // Normalize rotations after changes
  const normalizedImages = images.map((img) => ({
    ...img,
    rotation: normalizeRotation(img.rotation),
  }));

  const handleDelete = useCallback(
    (id: string) => {
      onImagesChange(normalizedImages.filter((img) => img.id !== id));
    },
    [normalizedImages, onImagesChange]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index <= 0) return;
      const newImages = [...normalizedImages];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      onImagesChange(newImages);
    },
    [normalizedImages, onImagesChange]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index >= normalizedImages.length - 1) return;
      const newImages = [...normalizedImages];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      onImagesChange(newImages);
    },
    [normalizedImages, onImagesChange]
  );

  const handleClearAll = useCallback(() => {
    if (confirm("Are you sure you want to remove all images?")) {
      onImagesChange([]);
      showToast("All images removed", "info");
    }
  }, [onImagesChange, showToast]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      setDraggingIndex(index);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
      // Add a subtle delay so the drag image is captured before opacity changes
      requestAnimationFrame(() => {
        const target = e.target as HTMLElement;
        target.classList.add("dragging");
      });
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      dragOverIndex.current = index;
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      const sourceIndex = Number(e.dataTransfer.getData("text/plain"));
      if (
        Number.isNaN(sourceIndex) ||
        sourceIndex === index ||
        sourceIndex < 0 ||
        sourceIndex >= normalizedImages.length
      ) {
        return;
      }

      const newImages = [...normalizedImages];
      const [moved] = newImages.splice(sourceIndex, 1);
      newImages.splice(index, 0, moved);
      onImagesChange(newImages);
    },
    [normalizedImages, onImagesChange]
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove("dragging");
    setDraggingIndex(null);
    dragOverIndex.current = null;
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-xl font-semibold text-navy">
          {normalizedImages.length}{" "}
          {normalizedImages.length === 1 ? "image" : "images"} ready
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddMore}
            className="inline-flex items-center gap-2 rounded-lg border border-border-soft bg-white px-4 py-2 text-sm font-medium text-charcoal transition-all hover:border-gold/50 hover:text-gold"
          >
            <Plus className="h-4 w-4" />
            Add More Images
          </button>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-danger-soft px-4 py-2 text-sm font-medium text-danger transition-all hover:bg-danger hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          "grid-cols-1 xs:grid-cols-2",
          "sm:grid-cols-2 md:grid-cols-3",
          "lg:grid-cols-4"
        )}
      >
        {normalizedImages.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            index={index}
            total={normalizedImages.length}
            isDragging={draggingIndex === index}
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-text-muted">
        Tip: Drag and drop cards to reorder pages in your final PDF.
      </p>
    </div>
  );
}
