import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Converter } from "@/components/Converter";
import { PrivacySection } from "@/components/PrivacySection";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/hooks/useToast";

export default function App() {
  const scrollToConverter = () => {
    const element = document.querySelector("#converter");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar onConvertClick={scrollToConverter} />
        <main className="flex-1">
          <Hero />
          <Converter />
          <div id="privacy">
            <PrivacySection />
          </div>
          <HowItWorks />
          <Features />
          <FAQ />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
