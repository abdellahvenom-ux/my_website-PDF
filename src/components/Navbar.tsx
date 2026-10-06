import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface NavbarProps {
  onConvertClick: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Image to PDF", href: "#converter" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar({ onConvertClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-border-soft bg-white/95 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#home");
          }}
          className="group flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10">
            <span className="font-serif text-lg font-bold text-gold">P</span>
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight text-navy">
            PicToPDF
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-sm font-medium text-charcoal/80 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              onConvertClick();
              handleNavClick("#converter");
            }}
            className="rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gold hover:shadow-md"
          >
            Convert Images
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-soft text-navy md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile nav */}
      <div
        className={cn(
          "overflow-hidden border-b border-border-soft bg-white transition-all duration-300 md:hidden",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-2 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal/80 transition-colors hover:bg-cream hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              onConvertClick();
              handleNavClick("#converter");
            }}
            className="mt-2 rounded-lg bg-navy px-3 py-2.5 text-sm font-medium text-white transition-all hover:bg-gold"
          >
            Convert Images
          </button>
        </div>
      </div>
    </header>
  );
}
