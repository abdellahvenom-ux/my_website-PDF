import { Upload, SlidersHorizontal, Download } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Images",
    description: "Choose or drag your JPG, PNG or WEBP images.",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Arrange & Customize",
    description: "Reorder your images and select your preferred PDF settings.",
  },
  {
    number: "03",
    icon: Download,
    title: "Download PDF",
    description: "Convert your images and download your finished PDF instantly.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-navy sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted sm:text-lg">
            Convert images to PDF in three simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {index < STEPS.length - 1 && (
                <div className="absolute left-1/2 top-16 hidden h-px w-full -translate-x-0 border-t border-dashed border-border-soft md:block" />
              )}
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                <step.icon className="h-7 w-7 text-gold" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                Step {step.number}
              </span>
              <h3 className="mt-2 font-serif text-xl font-semibold text-navy">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
