import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Monitor, Store, Eye, Maximize2, CheckCircle2 } from "lucide-react";

const points = [
  { icon: Monitor, text: "AI-powered digital platforms that create real opportunity" },
  { icon: Store, text: "Ethical retail models that generate operational funding" },
  { icon: Eye, text: "Transparent governance and financial oversight" },
  { icon: Maximize2, text: "Scalable, replicable frameworks for expansion" },
];

export default function WhyDifferent() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 lg:py-32 bg-[#0d1b2a] relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Why We&#39;re Different</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Revenue-backed{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                social impact
              </span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              Most social initiatives depend on donations. We build revenue-backed systems that sustain themselves.
            </p>
            <div className="px-6 py-5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-rose-300 font-semibold text-lg italic leading-relaxed">
                "Sustainable impact requires sustainable economics."
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            {points.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-rose-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/80 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}