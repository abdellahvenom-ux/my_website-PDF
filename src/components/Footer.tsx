const FOOTER_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Image to PDF", href: "#converter" },
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && href !== "#") {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="border-t border-border-soft bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <a href="#home" className="flex items-center justify-center gap-2 md:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 bg-gold/10">
                <span className="font-serif text-base font-bold text-gold">P</span>
              </div>
              <span className="font-serif text-lg font-semibold text-navy">
                PicToPDF
              </span>
            </a>
            <p className="mt-2 max-w-xs text-sm text-text-muted">
              Simple, fast and private image-to-PDF conversion.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm font-medium text-charcoal/80 transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-border-soft pt-6 text-center">
          <p className="text-xs text-text-muted">
            © 2026 PicToPDF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
