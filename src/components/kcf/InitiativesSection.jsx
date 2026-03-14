import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";
import {
  ShieldCheck, Star, Lock, TrendingUp, Award, BarChart3,
  Store, Users, DollarSign, Building2, MapPin, Target,
  Smartphone, Globe, LayoutDashboard, PieChart, Database,
  Sparkles, Heart, ArrowRight, CheckCircle2,
  MessageSquare, Calendar, Cpu, Link2,
  ChevronLeft, ChevronRight
} from "lucide-react";

const initiatives = [
  {
    id: "service-connect-pro",
    number: "01",
    title: "Service Connect Pro",
    subtitle: "By Kindness Community",
    tagline: "Find Help. Get Hired. Build Trust.",
    description: "A digital service marketplace designed to connect service seekers with verified local providers — making it easy to find trusted help or get hired quickly.",
    gradient: "from-rose-500 via-pink-500 to-rose-600",
    gradientDark: "from-rose-950 via-pink-950 to-rose-900",
    accent: "#f43f5e",
    accentLight: "rgba(244,63,94,0.15)",
    features: [
      { icon: ShieldCheck, label: "Verified Providers", desc: "Ratings & reviews for trust" },
      { icon: Star, label: "Secure Bookings", desc: "Safe payment options" },
      { icon: TrendingUp, label: "Predictable Income", desc: "Quality leads for providers" },
      { icon: Award, label: "Reputation Building", desc: "Performance history tracking" },
    ],
    tags: ["Trust", "Transparency", "Accessibility", "Community"],
  },
  {
    id: "ai-agents",
    number: "02",
    title: "AI Agent Services",
    subtitle: "By Kindness Community",
    tagline: "Intelligent Digital Team Members — Working 24/7",
    description: "We build custom AI agents that automate operations, engage users, and increase efficiency — deployed specifically for your organization.",
    gradient: "from-indigo-500 via-violet-500 to-indigo-600",
    gradientDark: "from-indigo-950 via-violet-950 to-indigo-900",
    accent: "#6366f1",
    accentLight: "rgba(99,102,241,0.15)",
    features: [
      { icon: MessageSquare, label: "24/7 Inquiries", desc: "Always-on support" },
      { icon: Users, label: "Lead Qualification", desc: "Automated filtering" },
      { icon: Calendar, label: "Appointment Booking", desc: "Seamless scheduling" },
      { icon: Cpu, label: "Team Support", desc: "Internal operations" },
    ],
    tags: ["Non-profits", "Foundations", "Social Enterprises", "Service Orgs"],
    cta: { label: "Book a Free Consultation", href: "mailto:contact@kindnesscommunityfoundation.com?subject=Book%20a%20Free%20Consultation%20with%20an%20AI%20Specialist" },
  },
  {
    id: "kcirm",
    number: "03",
    title: "KCIRM",
    subtitle: "Kindness Community Impact Retail Model",
    tagline: "Commerce with compassion.",
    description: "A revenue-generating social enterprise launching its first community-focused daily mart in India — combining essential retail with structured social reinvestment.",
    gradient: "from-emerald-500 via-teal-500 to-emerald-600",
    gradientDark: "from-emerald-950 via-teal-950 to-emerald-900",
    accent: "#10b981",
    accentLight: "rgba(16,185,129,0.15)",
    features: [
      { icon: Store, label: "Daily Essentials", desc: "Affordable products" },
      { icon: Target, label: "800–1,000 Families", desc: "Served daily" },
      { icon: Users, label: "Local Employment", desc: "Community jobs" },
      { icon: MapPin, label: "Multi-Location Scale", desc: "Across India" },
    ],
    tags: ["Retail", "Social Enterprise", "India", "Self-Sustaining"],
    quote: "Bridging commerce and compassion — moving from donation dependency to a self-sustaining community ecosystem.",
  },
  {
    id: "digital",
    number: "04",
    title: "Digital Infrastructure",
    subtitle: "By Kindness Community",
    tagline: "The technology backbone.",
    description: "Designing and launching a purpose-driven digital ecosystem where service, compassion, and community connection can thrive online and offline.",
    gradient: "from-sky-500 via-cyan-500 to-sky-600",
    gradientDark: "from-sky-950 via-cyan-950 to-sky-900",
    accent: "#0ea5e9",
    accentLight: "rgba(14,165,233,0.15)",
    features: [
      { icon: Smartphone, label: "Community App", desc: "Mobile platform for kindness" },
      { icon: Globe, label: "Digital Platform", desc: "Stories & collaboration" },
      { icon: LayoutDashboard, label: "Impact Dashboard", desc: "Transparent tracking" },
      { icon: Database, label: "CRM Infrastructure", desc: "Relationship tools" },
    ],
    tags: ["Mobile", "Transparency", "Infrastructure", "Engagement"],
  },
  {
    id: "haven",
    number: "05",
    title: "Haven on Earth",
    subtitle: "By Kindness Community",
    tagline: "Powered by next-generation NBC AI.",
    description: "A future-ready digital platform designed to enable community-driven services, meaningful human connection, and purpose-led collaboration.",
    gradient: "from-amber-400 via-orange-500 to-amber-500",
    gradientDark: "from-amber-950 via-orange-950 to-amber-900",
    accent: "#f59e0b",
    accentLight: "rgba(245,158,11,0.15)",
    future: true,
    features: [
      { icon: Sparkles, label: "NBC AI Search", desc: "Intelligent discovery engine" },
      { icon: Heart, label: "Human Connection", desc: "Community-driven services" },
      { icon: Globe, label: "Global Reach", desc: "Beyond borders" },
      { icon: Link2, label: "Unified Ecosystem", desc: "Commerce + service + community" },
    ],
    tags: ["AI-Powered", "Future Vision", "Global", "NBC AI"],
  },
  {
    id: "trust-pay",
    number: "06",
    title: "TRUST PAY",
    subtitle: "Powered by Kindness Community",
    tagline: "Secure • Transparent • Purpose-Driven Payments",
    description: "A secure digital payment and escrow platform built to serve individuals, businesses, NGOs, and community initiatives with trust-first architecture.",
    gradient: "from-purple-500 via-fuchsia-500 to-purple-600",
    gradientDark: "from-purple-950 via-fuchsia-950 to-purple-900",
    accent: "#a855f7",
    accentLight: "rgba(168,85,247,0.15)",
    features: [
      { icon: ShieldCheck, label: "Escrow Protection", desc: "Funds held securely" },
      { icon: CheckCircle2, label: "Milestone Release", desc: "Condition-based payments" },
      { icon: BarChart3, label: "Full Reporting", desc: "Complete transparency" },
      { icon: DollarSign, label: "Multi-Purpose", desc: "NGOs, business, charity" },
    ],
    tags: ["Payments", "Escrow", "Nonprofits", "Accountability"],
    quote: "Trust PAY transforms payments into accountable, milestone-driven financial commitments.",
  },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function InitiativesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setActive(index);
  }, []);

  const next = useCallback(() => {
    goTo((active + 1) % initiatives.length, 1);
  }, [active, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + initiatives.length) % initiatives.length, -1);
  }, [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, paused]);

  const initiative = initiatives[active];

  return (
    <section id="initiatives" className="py-24 lg:py-32 bg-[#0d1b2a]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="text-rose-400 text-xs font-bold tracking-widest uppercase">Strategic Initiatives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-3xl mx-auto">
            Six pillars of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
              sustainable impact
            </span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-2xl mx-auto">
            Revenue-backed, technology-enabled systems designed for long-term community sustainability.
          </p>
        </motion.div>

        {/* Pill navigation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {initiatives.map((ini, i) => (
            <button
              key={ini.id}
              onClick={() => { goTo(i, i > active ? 1 : -1); setPaused(true); }}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 border ${
                active === i
                  ? "text-white border-transparent shadow-lg scale-105"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10"
              }`}
              style={active === i ? { background: `linear-gradient(135deg, ${initiative.accent}, ${initiative.accent}cc)`, borderColor: initiative.accent } : {}}
            >
              {ini.number} {ini.title}
            </button>
          ))}
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative overflow-hidden rounded-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={active}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`bg-gradient-to-br ${initiative.gradientDark} border border-white/10 rounded-3xl overflow-hidden`}
            >
              <div className="grid lg:grid-cols-5 min-h-[460px]">
                {/* Left panel */}
                <div className={`lg:col-span-2 bg-gradient-to-br ${initiative.gradient} p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden`}>
                  <div className="absolute -bottom-8 -right-8 text-white/10 text-[10rem] font-black leading-none select-none pointer-events-none">
                    {initiative.number}
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-white/60 text-xs font-bold tracking-widest uppercase">{initiative.subtitle}</span>
                      {initiative.future && (
                        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">Coming Soon</span>
                      )}
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight">{initiative.title}</h3>
                    <p className="text-white/80 text-sm font-semibold mb-6">{initiative.tagline}</p>
                    <p className="text-white/65 text-sm leading-relaxed">{initiative.description}</p>
                  </div>
                  <div className="relative z-10 flex flex-wrap gap-2 mt-6">
                    {initiative.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right panel */}
                <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6">Key Features</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {initiative.features.map((f, i) => (
                        <div
                           key={i}
                           className="flex items-start gap-4 p-4 rounded-2xl border border-white/8 hover:border-white/20 transition-all duration-300"
                           style={{ background: initiative.accentLight }}
                         >
                           <div
                             className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                             style={{ background: `linear-gradient(135deg, ${initiative.accent}, ${initiative.accent}99)` }}
                           >
                             {(() => {
                               const IconComponent = f.icon;
                               return <IconComponent className="w-5 h-5 text-white" />;
                             })()}
                           </div>
                          <div>
                            <div className="text-white font-semibold text-sm">{f.label}</div>
                            <div className="text-white/45 text-xs mt-0.5">{f.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(initiative.quote || initiative.cta) && (
                    <div className="mt-6">
                      {initiative.quote && (
                        <div className="px-5 py-4 rounded-2xl border border-white/10 bg-white/5">
                          <p className="text-white/60 text-sm italic">"{initiative.quote}"</p>
                        </div>
                      )}
                      {initiative.cta && (
                        <a
                          href={initiative.cta.href}
                          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${initiative.accent}, ${initiative.accent}cc)` }}
                        >
                          <Calendar className="w-4 h-4" />
                          {initiative.cta.label}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next */}
          <button
            onClick={() => { prev(); setPaused(true); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { next(); setPaused(true); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Dot progress + counter */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className="text-white/30 text-xs font-mono">{String(active + 1).padStart(2, '0')} / {String(initiatives.length).padStart(2, '0')}</span>
          <div className="flex gap-2">
            {initiatives.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i, i > active ? 1 : -1); setPaused(true); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: active === i ? '24px' : '8px',
                  height: '8px',
                  background: active === i ? initiative.accent : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
          {/* Auto-play indicator */}
          <button
            onClick={() => setPaused(!paused)}
            className="text-white/30 hover:text-white/60 text-xs font-mono transition-colors"
          >
            {paused ? "▶ play" : "⏸ pause"}
          </button>
        </div>
      </div>
    </section>
  );
}