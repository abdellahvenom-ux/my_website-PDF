import { Loader2 } from "lucide-react";

interface ConversionProgressProps {
  message: string;
}

export function ConversionProgress({ message }: ConversionProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border-soft bg-white p-10 text-center shadow-sm sm:p-14">
      <div className="relative mb-5">
        <div className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
          <Loader2 className="h-7 w-7 animate-spin-slow text-gold" />
        </div>
      </div>
      <h3 className="font-serif text-xl font-semibold text-navy">
        Converting your images
      </h3>
      <p className="mt-2 text-sm text-text-muted">{message}</p>
    </div>
  );
}
