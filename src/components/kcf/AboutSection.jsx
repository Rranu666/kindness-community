import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Briefcase, ShieldCheck, TrendingUp } from "lucide-react";

const purposes = [
  { icon: Users, title: "Connect People", desc: "Building bridges between communities and opportunities" },
  { icon: Briefcase, title: "Enable Livelihoods", desc: "Creating pathways to sustainable employment" },
  { icon: ShieldCheck, title: "Build Digital Trust", desc: "Fostering trust in digital ecosystems" },
  { icon: TrendingUp, title: "Fund Impact", desc: "Driving social change through ethical enterprise" },
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="about" className="py-32 lg:py-40 bg-gradient-to-b from-white via-white to-slate-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="text-rose-500 text-xs font-bold tracking-widest uppercase">About Us</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0d1b2a] leading-tight mb-8 max-w-3xl">
            Kindness must be{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400">
              structured, sustainable, and scalable
            </span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-8 max-w-3xl">
            <p className="text-slate-600 text-lg leading-relaxed">
              Founded by <span className="text-[#0d1b2a] font-semibold">Fred A. Behr</span>, Kindness Community operates on one principle: that kindness, when given structure, becomes the most powerful engine for lasting change.
            </p>
            <p className="text-slate-500 text-lg leading-relaxed">
              We don&#39;t rely solely on donations. We build sustainable infrastructure that generates revenue, creates opportunity, and scales impact across communities worldwide.
            </p>
          </div>
        </motion.div>

        {/* Asymmetric Card Grid */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 auto-rows-max"
        >
          {/* Card 1 — Large (top-left, spans 2 cols) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-rose-50 to-pink-50 hover:from-[#0d1b2a] hover:to-slate-800 border border-rose-100 hover:border-rose-500/50 transition-all duration-700 cursor-default shadow-lg hover:shadow-2xl"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-rose-400 to-pink-400 transition-opacity duration-700" />
            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-rose-100 group-hover:bg-rose-500/30 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                whileHover={{ rotate: 10 }}
              >
                {(() => {
                  const IconComponent = purposes[0].icon;
                  return <IconComponent className="w-8 h-8 text-rose-500 group-hover:text-rose-300" />;
                })()}
              </motion.div>
              <h3 className="text-2xl font-bold text-[#0d1b2a] group-hover:text-white mb-3 transition-colors duration-500">
                {purposes[0].title}
              </h3>
              <p className="text-base text-slate-600 group-hover:text-white/80 transition-colors duration-500 leading-relaxed">
                {purposes[0].desc}
              </p>
            </div>
          </motion.div>

          {/* Cards 2, 3, 4 — Staggered right column */}
          {purposes.slice(1).map((item, i) => (
            <motion.div
              key={i + 1}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-[#0d1b2a] hover:to-slate-900 border border-slate-200 hover:border-rose-500/50 transition-all duration-700 cursor-default shadow-md hover:shadow-xl ${
                i === 0 ? "md:col-span-2" : i === 1 ? "md:col-span-2" : "md:col-span-2"
              }`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-rose-400 to-pink-400 transition-opacity duration-700" />
              <div className="relative z-10">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-rose-100 group-hover:bg-rose-500/20 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-105"
                  whileHover={{ rotate: -10 }}
                >
                  <item.icon className="w-6 h-6 text-rose-500 group-hover:text-rose-300 transition-colors duration-500" />
                </motion.div>
                <h3 className="font-bold text-[#0d1b2a] group-hover:text-white mb-2 transition-colors duration-500 text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 group-hover:text-white/70 transition-colors duration-500">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}