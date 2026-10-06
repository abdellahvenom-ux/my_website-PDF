import {
  Images,
  MousePointerClick,
  ArrowUpDown,
  RotateCw,
  FileStack,
  Smartphone,
  Lock,
  Timer,
} from "lucide-react";

const FEATURES = [
  {
    icon: Images,
    title: "Multiple Image Support",
    description: "Combine many images into one PDF document.",
  },
  {
    icon: MousePointerClick,
    title: "Drag & Drop Upload",
    description: "Quickly add images with a simple drag and drop.",
  },
  {
    icon: ArrowUpDown,
    title: "Reorder Pages",
    description: "Arrange images in the exact order you need.",
  },
  {
    icon: RotateCw,
    title: "Image Rotation",
    description: "Rotate images before creating your PDF.",
  },
  {
    icon: FileStack,
    title: "Multiple PDF Sizes",
    description: "Choose from A4, Letter, Legal, A3, A5 or Auto.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Works smoothly on phones, tablets and desktops.",
  },
  {
    icon: Lock,
    title: "Secure Processing",
    description: "Your images are handled locally in your browser.",
  },
  {
    icon: Timer,
    title: "Fast Conversion",
    description: "Generate PDFs in seconds without waiting.",
  },
];

export function Features() {
  return (
    <section className="bg-soft-gray py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-navy sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted sm:text-lg">
            A complete set of tools to create perfect PDFs from your images.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border-soft bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 transition-colors group-hover:bg-gold/20">
                <feature.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="font-serif text-base font-semibold text-navy">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
