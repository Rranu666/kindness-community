import { Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Vision & Mission", href: "#vision" },
  { label: "Initiatives", href: "#initiatives" },
  { label: "Leadership", href: "#leadership" },
  { label: "Partners", href: "#partners" },
  { label: "Governance", href: "#governance" },
  { label: "Community Stories", href: "#stories" },
  { label: "Contact", href: "#contact" },
];

const legalLinks = [
  { label: "Terms of Service", href: "#governance" },
  { label: "Privacy Policy", href: "#governance" },
  { label: "Governance & Ethics", href: "#governance" },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/Home";

  const scrollTo = (href) => {
    if (!isHome) {
      navigate("/" + href);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="contact" className="bg-[#080f1a]">
      {/* CTA Band */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 border-b border-white/5">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Let's build{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                something meaningful
              </span>
            </h2>
            <p className="text-white/40 text-lg">
              Ready to partner with us or learn more about our initiatives? Reach out — we'd love to hear from you.
            </p>
          </div>
          <div className="lg:flex lg:justify-end">
            <a
              href="mailto:contact@kindnesscommunityfoundation.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-rose-500/20"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div
              className="text-sm tracking-widest text-white uppercase leading-tight mb-1"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
            >
              Kindness Community
            </div>
            <div
              className="text-sm text-blue-300"
              style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 500 }}
            >
              Powered by love, driven by kindness
            </div>
          </div>
          <p className="text-xs text-white/30 leading-relaxed">
            Building sustainable systems for community impact worldwide.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="text-sm text-white/30 hover:text-rose-400 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-5">Legal</h4>
          <ul className="space-y-3">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="text-sm text-white/30 hover:text-rose-400 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-5">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="mailto:contact@kindnesscommunityfoundation.com" className="text-white/30 hover:text-rose-400 transition-colors">
                contact@kindnesscommunityfoundation.com
              </a>
            </li>
            <li className="text-white/30 leading-relaxed">
              PO Box 379<br />
              Newport Beach, CA 92662<br />
              <span className="text-white/20 text-xs">USA</span>
            </li>
            <li className="text-white/30">India &amp; USA Operations</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-white/50">
          © {new Date().getFullYear()} Kindness Community. Built by KCF LLC. All rights reserved.
        </p>
        <p className="text-sm font-medium text-white/50 flex items-center gap-1">
          Built with <Heart className="w-4 h-4 text-rose-400 fill-rose-400 mx-0.5" /> for community impact
        </p>
      </div>
    </footer>
  );
}