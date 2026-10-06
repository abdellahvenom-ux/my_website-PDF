import { Shield, Zap, Smile } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Private",
    description: "Your files stay on your device whenever possible.",
  },
  {
    icon: Zap,
    title: "Fast",
    description: "Convert multiple images into PDF in seconds.",
  },
  {
    icon: Smile,
    title: "Easy",
    description: "No registration or complicated settings required.",
  },
];

export function PrivacySection() {
  return (
    <section className="bg-soft-gray py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-navy sm:text-4xl">
            Your Images Stay Private
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
            Your images are processed directly in your browser and are not
            permanently stored on our servers.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border-soft bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                <feature.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-navy">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
