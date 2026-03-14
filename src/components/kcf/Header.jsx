import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SiteSearch from "./SiteSearch";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Vision & Mission", href: "#vision" },
  { label: "Initiatives", href: "#initiatives" },
  { label: "Leadership", href: "#leadership" },
  { label: "Partners", href: "#partners" },
  { label: "Connect Through Kindness", href: "/KindnessConnect", external: true },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/Home";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    if (!isHome) {
      // Navigate to home page with the hash so it scrolls after load
      navigate("/" + href);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12 flex items-center justify-between h-auto md:h-20 py-2 sm:py-3 md:py-0 gap-3">
        {/* Brand */}
        <button onClick={() => isHome ? scrollTo("#home") : navigate("/")} className="flex flex-col items-start group flex-shrink-0">
          <span
            className={`text-xs sm:text-sm md:text-[17px] leading-tight md:leading-none tracking-widest uppercase transition-colors duration-300 ${scrolled ? "text-[#1a2e4a]" : "text-white"}`}
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
          >
            KCF
          </span>
          <span
            className={`text-[8px] sm:text-[10px] md:text-[13px] mt-0.5 transition-colors duration-300 ${scrolled ? "text-[#6b7fa8]" : "text-blue-200"}`}
            style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 500 }}
          >
            Kindness Community
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) =>
            link.external ? (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  scrolled
                    ? "text-slate-500 hover:text-[#0d1b2a] hover:bg-slate-100"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  scrolled
                    ? "text-slate-500 hover:text-[#0d1b2a] hover:bg-slate-100"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            )
          )}
          <button
            onClick={() => setSearchOpen(true)}
            className={`p-2 rounded-full transition-all duration-300 ${scrolled ? "text-slate-500 hover:bg-slate-100" : "text-white/70 hover:text-white hover:bg-white/10"}`}
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/TeamPortal')}
            className={`ml-2 px-6 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
              scrolled
                ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg"
                : "bg-gradient-to-r from-blue-400 to-pink-400 text-white hover:shadow-lg"
            }`}
          >
            Team Portal
          </button>
        </nav>

        {/* Mobile Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className={`lg:hidden p-2 rounded-xl transition-colors ${scrolled ? "text-[#1B3A5C]" : "text-white"}`}
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className={`lg:hidden p-2 rounded-xl transition-colors ${
            scrolled ? "text-[#1B3A5C]" : "text-white"
          }`}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {mobileOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white border-t border-slate-100"
        >
          <nav className="px-3 sm:px-6 py-2 sm:py-4 space-y-1" aria-label="Mobile navigation">
            {navLinks.map((link) =>
              link.external ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-slate-700 hover:text-[#1B3A5C] hover:bg-[#1B3A5C]/5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-slate-700 hover:text-[#1B3A5C] hover:bg-[#1B3A5C]/5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                >
                  {link.label}
                </a>
              )
            )}
            <button
              onClick={() => {
                navigate('/TeamPortal');
                setMobileOpen(false);
              }}
              className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-bold hover:shadow-lg mt-2"
            >
              Team Portal
            </button>
          </nav>
        </motion.div>
      )}
      </AnimatePresence>

      <SiteSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}