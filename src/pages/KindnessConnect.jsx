import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/kcf/Header";
import Footer from "@/components/kcf/Footer";
import GlobalImpactMap from "@/components/kcf/GlobalImpactMap";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

const features = [
  { num: "01", icon: "📅", title: "Giving Plans", desc: "Set up a recurring monthly contribution — starting from just $5 — and let KindnessConnect direct it automatically to the causes you care about most.", tag: "From $5 / month", dark: false },
  { num: "02", icon: "🪙", title: "Micro-Donation Roundups", desc: "Link your payment card and we'll automatically round up every purchase to the nearest dollar. Those pennies pool together into real-world impact — without you thinking twice.", tag: "Automatic Roundups", dark: true },
  { num: "03", icon: "🛍️", title: "Conscious Shopping Cashback", desc: "Shop through KindnessConnect's partner brands and earn up to 15% cashback — automatically redirected as a donation to your chosen cause.", tag: "Up to 15% Back", dark: true },
  { num: "04", icon: "📊", title: "Live Impact Dashboard", desc: "Track every outcome your contributions generate — meals provided, trees planted, liters of water delivered — through a beautifully transparent dashboard updated in real time.", tag: "Real-Time Tracking", dark: false },
  { num: "05", icon: "🤝", title: "Community Giving Circles", desc: "Pool your contributions with friends or colleagues to multiply your collective impact. Giving Circles bring people together around shared values.", tag: "Group Giving", dark: false },
  { num: "06", icon: "🏆", title: "Kindness Score & Milestones", desc: "Your personal Kindness Score grows with every act of generosity. Unlock milestones, earn recognition badges, and see your cumulative impact.", tag: "Gamified Giving", dark: true },
];

const causes = [
  { emoji: "🍽️", name: "Feeding America", desc: "The largest hunger-relief network in the US, connecting 60,000+ food banks with people facing food insecurity nationwide.", sdg: "SDG 2 — Zero Hunger" },
  { emoji: "💧", name: "Water.org", desc: "A pioneering nonprofit whose market-driven approach has helped over 44 million people gain sustained access to safe water and sanitation.", sdg: "SDG 6 — Clean Water" },
  { emoji: "👧", name: "Save the Children", desc: "Operating in 100+ countries, delivering life-saving aid and long-term development programmes that protect children's rights.", sdg: "SDG 4 — Quality Education" },
  { emoji: "🌳", name: "One Tree Planted", desc: "A global reforestation charity that has planted over 40 million trees across 47 countries, restoring ecosystems worldwide.", sdg: "SDG 13 — Climate Action" },
  { emoji: "🌊", name: "Ocean Conservancy", desc: "Science-led advocacy protecting ocean ecosystems from plastic pollution, overfishing, and warming seas.", sdg: "SDG 14 — Life Below Water" },
  { emoji: "🤝", name: "UNICEF", desc: "Working in the world's most challenging environments to deliver vaccines, nutrition, education, and protection to children.", sdg: "SDG 3 — Good Health" },
];

const stats = [
  { num: "$592B", label: "Total US charitable giving in 2024 — a record high" },
  { num: "76%", label: "of US adults made a financial donation last year" },
  { num: "84%", label: "of Gen Z support a nonprofit or cause in some way" },
  { num: "6.3%", label: "growth in charitable giving year-over-year" },
];

const faqs = [
  { q: "How does KindnessConnect send money to charities?", a: "All donations are aggregated and sent monthly to our verified charity partners via bank transfer. We maintain full financial records and publish transfer confirmations in our quarterly impact reports." },
  { q: "Can I change my chosen causes at any time?", a: "Absolutely. Your cause preferences can be updated any time from your dashboard. Changes take effect from the next donation cycle. There's no lock-in, and you can pause or cancel with a single click." },
  { q: "How do Roundups work — is my card data safe?", a: "We use bank-grade Open Banking connections (read-only) to detect transactions and calculate your roundup amounts. We never store your card details, and all connections are encrypted with 256-bit TLS." },
  { q: "What percentage goes to the charity vs platform fees?", a: "For Giving Plans and Roundups, we deduct a 5% platform maintenance fee — so 95 cents in every dollar reaches your chosen charity. For Cashback Shopping, the full cashback amount is passed on with no deduction." },
  { q: "What is a Giving Circle and how do I start one?", a: "A Giving Circle is a group account that pools contributions from multiple members toward shared causes. Any member can start one, invite others via link or email, and track collective impact together." },
  { q: "Is KindnessConnect available outside the US?", a: "Currently we support users in the US and Canada. Expansion to the UK, EU, Australia, and South Asia is planned for late 2025. Sign up to our waitlist to be notified when your region goes live." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-[#d4e0d8] rounded-2xl overflow-hidden bg-white transition-all duration-200`}>
      <button
        className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-[#1B2B22] text-sm md:text-base gap-4 hover:bg-[#f4ede1]/40 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <span className={`text-[#3D6B50] text-xl flex-shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-[#657066] text-sm leading-relaxed border-t border-[#d4e0d8]/60">
          <div className="pt-4">{a}</div>
        </div>
      )}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" } }),
};

export default function KindnessConnect() {
  const navigate = useNavigate();
  const [scoreExpanded, setScoreExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("$10");

  return (
    <div className="bg-[#FDFAF5] text-[#333D35] overflow-x-hidden">
      <Header />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 px-5 md:px-10 lg:px-20 overflow-hidden bg-[#0d1b2a]">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#3D6B50]/25 blur-[130px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#D4A84B]/15 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#1B3A2A]/40 blur-[100px]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          {/* Top badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#3D6B50]/20 border border-[#3D6B50]/30 text-[#6db88a] text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6db88a] animate-pulse" />
              Powered by love, driven by kindness
            </div>
          </motion.div>

          {/* Hero headline — centered, massive */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-10">
            <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.1] text-white mb-0" style={{ fontFamily: "'Georgia', serif" }}>
              Give a little.
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.1] italic mb-8"
              style={{ fontFamily: "'Georgia', serif", background: "linear-gradient(135deg, #6db88a 0%, #D4A84B 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Change a lot.
            </h1>
            <p className="text-[#a8bdb0] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              KindnessConnect turns your everyday spending and intentions into meaningful, measurable support for the causes that shape our world.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#kc-cta"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#5C9470] to-[#3D6B50] text-white font-bold px-10 py-4 rounded-full hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[#3D6B50]/30 text-base overflow-hidden">
                <span className="relative z-10">Join the Movement</span>
                <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#6db88a] to-[#5C9470] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a href="#kc-features"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-10 py-4 rounded-full hover:border-white/50 hover:bg-white/8 transition-all duration-300 text-base backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                How It Works
              </a>
            </div>
          </motion.div>

          {/* Impact cards row — horizontal, centered */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {[
              { icon: "🍽️", num: "94,200", lbl: "Meals Funded", color: "from-[#2d4a38] to-[#1B2B22]", border: "border-[#3D6B50]/30" },
              { icon: "🌳", num: "18,750", lbl: "Trees Planted", color: "from-[#1e3828] to-[#142a1e]", border: "border-[#3D6B50]/20" },
              { icon: "💧", num: "6,400",  lbl: "Clean Water Access", color: "from-[#1a2e42] to-[#0d1b2a]", border: "border-white/10" },
              { icon: "👧", num: "4,100",  lbl: "Children in School", color: "from-[#3a2d12] to-[#1B2B22]", border: "border-[#D4A84B]/20" },
            ].map(({ icon, num, lbl, color, border }, i) => (
              <motion.div key={lbl}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-5 flex flex-col items-center text-center backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300`}>
                <span className="text-3xl mb-3">{icon}</span>
                <div className="text-white font-bold text-2xl md:text-3xl" style={{ fontFamily: "'Georgia', serif" }}>{num}</div>
                <div className="text-[#a8bdb0] text-xs mt-1">{lbl}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="bg-[#1B2B22] px-5 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.num} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <div className="text-[#D4A84B] text-3xl font-bold mb-1" style={{ fontFamily: "'Georgia', serif" }}>{s.num}</div>
              <div className="text-[#a8bdb0] text-xs leading-snug max-w-[140px] mx-auto">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="kc-features" className="py-28 px-5 md:px-10 lg:px-20 bg-[#FDFAF5]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#3D6B50]/10 text-[#3D6B50] text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-6">
              ✦ Ways to Give
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B2B22] mb-5" style={{ fontFamily: "'Georgia', serif" }}>
              Six ways to <em className="text-[#5C9470] not-italic">make it count</em>
            </h2>
            <p className="text-[#657066] text-base max-w-xl mx-auto leading-relaxed">
              Whether you give intentionally or automatically, every path through KindnessConnect turns action into lasting impact.
            </p>
          </motion.div>

          {/* Feature 1 + 2 — wide + narrow */}
          <div className="grid md:grid-cols-5 gap-5 mb-5">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="md:col-span-3 rounded-3xl p-10 bg-[#1B2B22] text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl">
              <div className="absolute -right-6 -bottom-6 text-[10rem] font-bold opacity-[0.04] leading-none select-none" style={{ fontFamily: "'Georgia', serif" }}>01</div>
              <div className="w-14 h-14 rounded-2xl bg-[#3D6B50]/40 flex items-center justify-center text-3xl mb-6">📅</div>
              <span className="inline-block bg-[#D4A84B]/20 text-[#D4A84B] text-xs font-bold px-3 py-1 rounded-full mb-4">From $5 / month</span>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Georgia', serif" }}>Giving Plans</h3>
              <p className="text-[#a8bdb0] text-sm leading-relaxed max-w-md">Set up a recurring monthly contribution — starting from just $5 — and let KindnessConnect direct it automatically to the causes you care about most.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="md:col-span-2 rounded-3xl p-10 bg-[#EAF0EC] text-[#1B2B22] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -right-6 -bottom-6 text-[10rem] font-bold opacity-[0.04] leading-none select-none" style={{ fontFamily: "'Georgia', serif" }}>02</div>
              <div className="w-14 h-14 rounded-2xl bg-[#3D6B50]/15 flex items-center justify-center text-3xl mb-6">🪙</div>
              <span className="inline-block bg-[#3D6B50]/15 text-[#3D6B50] text-xs font-bold px-3 py-1 rounded-full mb-4">Automatic Roundups</span>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Georgia', serif" }}>Micro-Donation Roundups</h3>
              <p className="text-[#657066] text-sm leading-relaxed">Link your card and we'll round up every purchase to the nearest dollar — those pennies pool into real-world impact.</p>
            </motion.div>
          </div>

          {/* Feature 3 + 4 + 5 — equal thirds */}
          <div className="grid md:grid-cols-3 gap-5 mb-5">
            {[
              { num: "03", icon: "🛍️", title: "Conscious Shopping Cashback", desc: "Shop through our partner brands and earn up to 15% cashback — automatically redirected as a donation to your chosen cause.", tag: "Up to 15% Back", bg: "bg-[#F4EDE1]", tagBg: "bg-[#D4A84B]/15 text-[#8a6820]", text: "text-[#1B2B22]", sub: "text-[#657066]" },
              { num: "04", icon: "📊", title: "Live Impact Dashboard", desc: "Track every outcome — meals provided, trees planted, liters of water delivered — through a beautifully transparent real-time dashboard.", tag: "Real-Time Tracking", bg: "bg-[#1B2B22]", tagBg: "bg-white/10 text-white/70", text: "text-white", sub: "text-[#a8bdb0]" },
              { num: "05", icon: "🤝", title: "Community Giving Circles", desc: "Pool contributions with friends or colleagues to multiply your collective impact. Giving Circles unite people around shared values.", tag: "Group Giving", bg: "bg-[#EAF0EC]", tagBg: "bg-[#3D6B50]/15 text-[#3D6B50]", text: "text-[#1B2B22]", sub: "text-[#657066]" },
            ].map((f, i) => (
              <motion.div key={f.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl ${f.bg}`}>
                <div className={`absolute -right-4 -bottom-4 text-[8rem] font-bold opacity-[0.04] leading-none select-none ${f.text}`} style={{ fontFamily: "'Georgia', serif" }}>{f.num}</div>
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-2xl mb-5">{f.icon}</div>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${f.tagBg}`}>{f.tag}</span>
                <h3 className={`text-lg font-bold mb-2 ${f.text}`} style={{ fontFamily: "'Georgia', serif" }}>{f.title}</h3>
                <p className={`text-xs leading-relaxed ${f.sub}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Feature 6 — full width banner (clickable) */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-3xl bg-gradient-to-r from-[#1B2B22] to-[#2d4a38] text-white relative overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer"
            onClick={() => setScoreExpanded(!scoreExpanded)}
          >
            <div className="p-10 md:p-14 flex flex-col md:flex-row md:items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-[#D4A84B]/20 flex items-center justify-center text-4xl flex-shrink-0">🏆</div>
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-[#D4A84B]/20 text-[#D4A84B] text-xs font-bold px-3 py-1 rounded-full mb-3">Gamified Giving</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Georgia', serif" }}>Kindness Score & Milestones</h3>
                <p className="text-[#a8bdb0] text-sm leading-relaxed">Your personal Kindness Score grows with every act of generosity. Unlock milestones, earn recognition badges, and see your cumulative impact across every cause you've ever supported.</p>
                <p className="text-[#6db88a] text-xs font-semibold mt-3">{scoreExpanded ? "▲ Hide preview" : "▼ See your dashboard preview"}</p>
              </div>
              <div className="flex md:flex-col gap-2 flex-wrap flex-shrink-0">
                {[
                  { label: "First Steps", active: true },
                  { label: "Champion", active: false },
                  { label: "Leader", active: false },
                  { label: "Ambassador", active: false },
                  { label: "Lifetime", active: false },
                ].map((b) => (
                  <span key={b.label}
                    className={`text-xs font-bold px-5 py-2 rounded-full text-center whitespace-nowrap ${b.active ? "bg-[#D4A84B] text-[#1B2B22]" : "bg-white/10 text-white/50"}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Expandable Dashboard Glimpse */}
            <AnimatePresence>
              {scoreExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-8 md:p-12">
                    {/* Mock dashboard preview */}
                    <p className="text-[#a8bdb0] text-xs uppercase tracking-widest font-bold mb-6">Dashboard Preview</p>
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      {[
                        { icon: "🍽️", value: "$240", label: "Total Donated" },
                        { icon: "🌳", value: "48", label: "Trees Planted" },
                        { icon: "⭐", value: "320", label: "Kindness Score" },
                      ].map((m) => (
                        <div key={m.label} className="bg-white/8 rounded-2xl px-5 py-4 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <span className="text-2xl">{m.icon}</span>
                          <div>
                            <div className="text-white font-bold text-lg" style={{ fontFamily: "'Georgia', serif" }}>{m.value}</div>
                            <div className="text-[#a8bdb0] text-xs">{m.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-[#a8bdb0]">Progress to Champion badge</span>
                        <span className="text-[#D4A84B] font-bold">320 / 500 pts</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#D4A84B] to-[#f0c96c]" style={{ width: "64%" }} />
                      </div>
                    </div>
                    {/* CTA buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate('/GivingDashboard')}
                        className="bg-[#D4A84B] text-[#1B2B22] font-bold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-all hover:-translate-y-0.5"
                      >
                        Open My Dashboard →
                      </button>
                      <button
                        onClick={() => base44.auth.redirectToLogin('/GivingDashboard')}
                        className="bg-white/10 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-all border border-white/20"
                      >
                        Log in to track your giving
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="kc-how" className="py-24 px-5 md:px-10 lg:px-20 bg-[#FDFAF5]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-3 text-[#3D6B50] text-xs font-bold tracking-[0.14em] uppercase mb-4">
              <span className="w-7 h-0.5 bg-[#3D6B50]" /> Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B2B22] mb-16" style={{ fontFamily: "'Georgia', serif" }}>
              Three steps to <em className="text-[#5C9470] not-italic">lasting change</em>
            </h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-[1.65rem] top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#3D6B50] to-[#D4A84B]" />
            {[
              ["1", "Create Your Profile & Choose Causes", "Sign up in minutes and browse our curated list of vetted organisations — each aligned with United Nations Sustainable Development Goals. Choose the causes that resonate with your values."],
              ["2", "Set Up Your Giving Method", "Choose one or all three ways to give: set a monthly Giving Plan, activate automated Roundups on your linked card, or shop through our conscious cashback partners."],
              ["3", "Watch Real Outcomes Unfold", "Your Impact Dashboard translates every dollar into human outcomes — meals served, trees in the ground, access to clean water, children in school. Share milestones and invite friends."],
            ].map(([n, h, p], i) => (
              <motion.div key={n} className="grid grid-cols-[4rem_1fr] gap-6 py-6 items-start" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="w-[3.4rem] h-[3.4rem] rounded-full bg-[#1B2B22] text-white flex items-center justify-center font-bold text-xl flex-shrink-0 z-10 relative shadow-lg" style={{ fontFamily: "'Georgia', serif" }}>{n}</div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-[#1B2B22] mb-2" style={{ fontFamily: "'Georgia', serif" }}>{h}</h3>
                  <p className="text-[#657066] text-sm leading-relaxed">{p}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAUSES ── */}
      <section id="kc-causes" className="py-28 px-5 md:px-10 lg:px-20 bg-[#0d1b2a] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#3D6B50]/15 blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 text-[#D4A84B] text-xs font-bold tracking-[0.18em] uppercase mb-5">
                <span className="w-7 h-0.5 bg-[#D4A84B]" /> Our Partners
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                Trusted causes,<br /><em className="text-[#6db88a] not-italic">verified impact</em>
              </h2>
            </div>
            <p className="text-[#a8bdb0] text-sm leading-relaxed max-w-xs md:mb-2">
              Every partner is independently vetted and aligned with UN Sustainable Development Goals.
            </p>
          </motion.div>

          {/* Top row — 2 large + 1 tall */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Feeding America — large accent card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="md:col-span-2 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #2d4a38 0%, #1B2B22 100%)" }}>
              <div className="absolute -right-8 -bottom-8 text-[11rem] opacity-5 leading-none select-none">🍽️</div>
              <div className="flex items-start justify-between mb-6">
                <span className="text-5xl">🍽️</span>
                <span className="bg-[#D4A84B]/20 text-[#D4A84B] text-xs font-bold px-3 py-1.5 rounded-full">{causes[0].sdg}</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>{causes[0].name}</h4>
              <p className="text-[#a8bdb0] text-sm leading-relaxed">{causes[0].desc}</p>
            </motion.div>

            {/* Water.org */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl">💧</span>
                <span className="bg-white/10 text-white/60 text-xs font-bold px-3 py-1.5 rounded-full">{causes[1].sdg}</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>{causes[1].name}</h4>
              <p className="text-[#a8bdb0] text-sm leading-relaxed">{causes[1].desc}</p>
            </motion.div>
          </div>

          {/* Bottom row — 1 tall + 2 equal */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Save the Children */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl">👧</span>
                <span className="bg-white/10 text-white/60 text-xs font-bold px-3 py-1.5 rounded-full">{causes[2].sdg}</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>{causes[2].name}</h4>
              <p className="text-[#a8bdb0] text-sm leading-relaxed">{causes[2].desc}</p>
            </motion.div>

            {/* One Tree Planted + Ocean Conservancy — stacked */}
            <div className="flex flex-col gap-4">
              {[causes[3], causes[4]].map((c, i) => (
                <motion.div key={c.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                  className="flex-1 rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
                  style={{ background: "linear-gradient(135deg, #2d4a38 0%, #1B2B22 100%)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{c.emoji}</span>
                    <span className="bg-[#D4A84B]/20 text-[#D4A84B] text-xs font-bold px-3 py-1 rounded-full">{c.sdg}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1.5" style={{ fontFamily: "'Georgia', serif" }}>{c.name}</h4>
                  <p className="text-[#a8bdb0] text-xs leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* UNICEF — accent gold */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
              className="rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #3a2d12 0%, #1B2B22 100%)", border: "1px solid rgba(212,168,75,0.2)" }}>
              <div className="absolute -right-6 -bottom-6 text-[9rem] opacity-5 leading-none select-none">🤝</div>
              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl">🤝</span>
                <span className="bg-[#D4A84B]/20 text-[#D4A84B] text-xs font-bold px-3 py-1.5 rounded-full">{causes[5].sdg}</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>{causes[5].name}</h4>
              <p className="text-[#a8bdb0] text-sm leading-relaxed">{causes[5].desc}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section id="kc-impact" className="py-28 px-5 md:px-10 lg:px-20 bg-[#FDFAF5]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 text-[#3D6B50] text-xs font-bold tracking-[0.18em] uppercase mb-5">
                <span className="w-7 h-0.5 bg-[#3D6B50]" /> Real Outcomes
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B2B22] leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                Your impact,<br /><em className="text-[#5C9470] not-italic">made visible</em>
              </h2>
            </div>
            <p className="text-[#657066] text-sm leading-relaxed max-w-xs md:mb-2">
              Every dollar tracked, every outcome published — total transparency, always.
            </p>
          </motion.div>

          {/* Big number marquee row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14">
            {[
              { icon: "🍽️", num: "94,200", lbl: "Meals Funded", color: "bg-[#1B2B22]", text: "text-white", sub: "text-[#a8bdb0]" },
              { icon: "🌳", num: "18,750", lbl: "Trees Planted", color: "bg-[#EAF0EC]", text: "text-[#1B2B22]", sub: "text-[#657066]" },
              { icon: "💧", num: "6,400", lbl: "Water Access", color: "bg-[#EAF0EC]", text: "text-[#1B2B22]", sub: "text-[#657066]" },
              { icon: "👧", num: "4,100", lbl: "Children in School", color: "bg-[#1B2B22]", text: "text-white", sub: "text-[#a8bdb0]" },
              { icon: "🌊", num: "12 t", lbl: "Ocean Plastic Removed", color: "bg-[#D4A84B]/15", text: "text-[#1B2B22]", sub: "text-[#657066]" },
            ].map((m, i) => (
              <motion.div key={m.lbl} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`rounded-3xl p-6 flex flex-col items-center text-center ${m.color} ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}>
                <span className="text-3xl mb-3">{m.icon}</span>
                <div className={`font-bold text-2xl md:text-3xl ${m.text}`} style={{ fontFamily: "'Georgia', serif" }}>{m.num}</div>
                <div className={`text-xs mt-1 ${m.sub}`}>{m.lbl}</div>
              </motion.div>
            ))}
          </div>

          {/* Allocation section — horizontal bar chart redesign */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="rounded-3xl bg-[#1B2B22] p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
              <div className="md:w-72 flex-shrink-0">
                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>How giving is allocated</h3>
                <p className="text-[#a8bdb0] text-sm leading-relaxed">Our platform transparently publishes monthly how every dollar is distributed across cause categories.</p>
              </div>
              <div className="flex-1 flex flex-col gap-5 w-full">
                {[
                  { name: "Hunger & Food Security", pct: 32, icon: "🍽️" },
                  { name: "Climate & Reforestation", pct: 26, icon: "🌳" },
                  { name: "Clean Water Access", pct: 21, icon: "💧" },
                  { name: "Education & Children", pct: 14, icon: "👧" },
                  { name: "Health & Medical Aid", pct: 7, icon: "🏥" },
                ].map((item, i) => (
                  <motion.div key={item.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-white text-sm font-semibold">{item.name}</span>
                      </div>
                      <span className="text-[#D4A84B] font-bold text-sm">{item.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-white/8 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#5C9470] to-[#D4A84B]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── GLOBAL IMPACT MAP ── */}
      <GlobalImpactMap />

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-5 md:px-10 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-3 text-[#3D6B50] text-xs font-bold tracking-[0.14em] uppercase mb-4">
              <span className="w-7 h-0.5 bg-[#3D6B50]" /> Community Voices
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B2B22] mb-14" style={{ fontFamily: "'Georgia', serif" }}>
              What our <em className="text-[#5C9470] not-italic">givers say</em>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { avatar: "👩", quote: "I've always wanted to give regularly but never managed to build the habit. With KindnessConnect's Giving Plan, my donations go out automatically every month. The dashboard showing what I've funded is genuinely moving.", name: "Sarah M.", role: "Marketing Manager, London" },
              { avatar: "👨", quote: "The roundup feature is genius — I barely notice the pennies going out, but they've turned into over $200 donated to water access projects this year. I can actually see the number of people who now have clean water.", name: "James T.", role: "Software Engineer, Manchester" },
              { avatar: "👩", quote: "Our office set up a Giving Circle and it's transformed our team culture. Seeing our collective impact score grow each month has become something everyone genuinely looks forward to.", name: "Priya K.", role: "HR Director, Edinburgh" },
            ].map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-[#FDFAF5] border border-[#d4e0d8] rounded-2xl p-7 flex flex-col gap-4">
                <div className="text-[#D4A84B] text-base tracking-wider">★★★★★</div>
                <p className="text-[#333D35] text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EAF0EC] flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-[#1B2B22] text-sm">{t.name}</div>
                    <div className="text-[#657066] text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-5 md:px-10 lg:px-20 bg-[#FDFAF5]">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 text-[#3D6B50] text-xs font-bold tracking-[0.14em] uppercase mb-4">
              <span className="w-7 h-0.5 bg-[#3D6B50]" /> Frequently Asked <span className="w-7 h-0.5 bg-[#3D6B50]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B2B22]" style={{ fontFamily: "'Georgia', serif" }}>
              Your questions, <em className="text-[#5C9470] not-italic">answered</em>
            </h2>
          </motion.div>
          <div className="flex flex-col gap-3">
            {faqs.map((f, i) => (
              <motion.div key={f.q} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i % 4}>
                <FaqItem q={f.q} a={f.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="kc-cta" className="py-28 px-5 relative overflow-hidden bg-[#0d1b2a]">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#3D6B50]/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#D4A84B]/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#3D6B50]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 text-[#D4A84B] text-xs font-bold tracking-[0.18em] uppercase mb-6">
              <span className="w-7 h-0.5 bg-[#D4A84B]" /> Join the Movement <span className="w-7 h-0.5 bg-[#D4A84B]" />
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5" style={{ fontFamily: "'Georgia', serif" }}>
              Start making a<br /><em className="text-[#6db88a] not-italic">difference</em> today
            </h2>
            <p className="text-[#a8bdb0] text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Choose your path — create a free account to unlock giving plans, or make a direct donation right now with no sign-up needed.
            </p>
          </motion.div>

          {/* Two-path cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* Path 1 — Sign up */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #2d4a38 0%, #1B2B22 100%)", border: "1px solid rgba(109,184,138,0.2)" }}>
              <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-[#6db88a]/10 blur-2xl" />
              <div className="w-10 h-10 rounded-2xl bg-[#6db88a]/20 flex items-center justify-center mb-5 text-xl">🌱</div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>Create Free Account</h3>
              <p className="text-[#a8bdb0] text-sm leading-relaxed mb-6 flex-1">Unlock giving plans, track your impact, set recurring donations, and earn milestone badges.</p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/15 bg-white/8 text-white placeholder-white/30 outline-none focus:border-[#6db88a]/60 text-sm transition-colors"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
                <button onClick={() => email && alert(`Signed up: ${email}`)} className="w-full bg-gradient-to-r from-[#5C9470] to-[#3D6B50] text-white font-bold px-6 py-3.5 rounded-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-[#3D6B50]/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!email}>
                  Get Early Access →
                </button>
              </div>
              <p className="text-white/25 text-xs mt-4 text-center">No spam. Unsubscribe any time.</p>
            </motion.div>

            {/* Path 2 — Direct donation */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #3a2d12 0%, #1B2B22 100%)", border: "1px solid rgba(212,168,75,0.2)" }}>
              <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-[#D4A84B]/10 blur-2xl" />
              <div className="w-10 h-10 rounded-2xl bg-[#D4A84B]/20 flex items-center justify-center mb-5 text-xl">💛</div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>Direct Donation</h3>
              <p className="text-[#a8bdb0] text-sm leading-relaxed mb-6 flex-1">Give instantly to a cause you care about — no account, no sign-up, no friction. Just kindness.</p>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2">
                  {["$5", "$10", "$25"].map(amt => (
                    <button key={amt}
                      onClick={() => setSelectedAmount(amt)}
                      className={`py-3 rounded-xl border font-bold text-sm transition-all duration-200 ${selectedAmount === amt ? 'bg-[#D4A84B]/30 border-[#D4A84B] text-[#D4A84B]' : 'border-[#D4A84B]/30 text-[#D4A84B] hover:bg-[#D4A84B]/15'}`}>
                      {amt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => window.open("https://www.every.org/kindness-community-foundation", "_blank")}
                  className="w-full bg-gradient-to-r from-[#D4A84B] to-[#b8892e] text-[#1B2B22] font-bold px-6 py-3.5 rounded-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-[#D4A84B]/20 text-sm">
                  Donate Now — No Sign-up →
                </button>
              </div>
              <p className="text-white/25 text-xs mt-4 text-center">Secure · 100% goes to your chosen cause</p>
            </motion.div>
          </div>

          {/* Already giving link */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-10">
            <Link to="/GivingDashboard" className="inline-flex items-center gap-2 text-[#6db88a] text-sm font-semibold hover:text-white transition-colors">
              Already giving? View your dashboard →
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}