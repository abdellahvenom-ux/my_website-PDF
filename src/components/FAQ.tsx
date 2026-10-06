import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

const FAQS = [
  {
    question: "Is PicToPDF free?",
    answer:
      "Yes, the basic image-to-PDF conversion tool is free to use.",
  },
  {
    question: "What image formats are supported?",
    answer: "JPG, JPEG, PNG and WEBP.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "The converter performs processing locally in your browser whenever technically possible.",
  },
  {
    question: "Can I change the order of my images?",
    answer:
      "Yes. Drag and drop images to control the final PDF page order.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The website is fully responsive on phones, tablets and desktop computers.",
  },
  {
    question: "Can I convert multiple images into one PDF?",
    answer:
      "Yes. Users can upload multiple images and combine them into a single PDF.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-navy sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-text-muted sm:text-lg">
            Find answers to common questions about PicToPDF.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-border-soft bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base font-semibold text-navy sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-gold transition-transform duration-300",
                      isOpen ? "rotate-180" : ""
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-text-muted">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
