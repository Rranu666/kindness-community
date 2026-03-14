import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Handshake } from "lucide-react";

export default function HeroSection() {
  const navigate = useNavigate();
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Element not yet in DOM (lazy-loaded section) — scroll toward bottom to trigger load, then retry
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      let attempts = 0;
      const retry = () => {
        const el2 = document.querySelector(href);
        if (el2) { el2.scrollIntoView({ behavior: "smooth" }); }
        else if (attempts++ < 10) { setTimeout(retry, 200); }
      };
      setTimeout(retry, 400);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0d1b2a]"
    >
      {/* Gradient blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-rose-500/20 to-pink-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sky-600/15 to-indigo-500/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-r from-violet-600/5 to-rose-500/5 blur-[100px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-36 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-white/60 text-sm tracking-widest uppercase font-medium">
                Powered by love, driven by kindness
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.06] tracking-tight mb-6"
          >
            Building Sustainable{" "}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300">
                Community Systems
              </span>
            </span>{" "}
            for Lasting Impact
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-2xl mb-10"
          >
            Kindness Community strengthens communities through
            technology, ethical commerce, and structured opportunity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => navigate('/TeamPortal')}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-rose-500/25"
            >
              Explore Team Portal
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo("#contact")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/8 hover:bg-white/12 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/15 transition-all duration-300"
            >
              <Handshake className="w-5 h-5" />
              Partner With Us
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { value: "6+", label: "Strategic Initiatives" },
            { value: "2", label: "Countries" },
            { value: "100%", label: "Revenue-Backed" },
            { value: "∞", label: "Impact Potential" },
          ].map((stat, i) => (
            <div
              key={i}
              className="px-6 py-5 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm hover:bg-white/8 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                {stat.value}
              </div>
              <div className="text-sm text-white/40 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}