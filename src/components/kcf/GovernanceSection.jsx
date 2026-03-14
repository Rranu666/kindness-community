import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Building, Settings, Heart, Scale, BarChart3, Megaphone, Shield, ChevronDown
} from "lucide-react";

const governanceAreas = [
  {
    title: "Governance Framework",
    icon: Building,
    items: [
      "Board of Directors: Strategic oversight, mission alignment, funding approvals",
      "Executive Leadership: Strategy, partnerships, ecosystem development",
      "Advisory Committees: Expert guidance and risk assessment",
      "Accountability & Reporting: Quarterly/annual public reports, audits",
    ],
  },
  {
    title: "Operational Terms",
    icon: Settings,
    items: [
      "Initiative planning, risk assessment, KPIs",
      "Segregated accounts & audited finances",
      "Partnership evaluation & legal agreements",
      "Secure data & privacy-compliant technology",
    ],
  },
  {
    title: "Ethics & Conduct",
    icon: Heart,
    items: [
      "Core principles: Integrity, Transparency, Accountability, Equity & Inclusion, Sustainability",
      "Code of Conduct: Staff, volunteers, and partners adhere to ethical standards",
      "Community responsibility: Prioritize community benefit, feedback mechanisms",
    ],
  },
  {
    title: "Compliance & Legal",
    icon: Scale,
    items: [
      "Statutory compliance (India, USA, etc.)",
      "Labor, tax, corporate, NGO regulations",
      "Intellectual property and data confidentiality",
    ],
  },
  {
    title: "Monitoring & Evaluation",
    icon: BarChart3,
    items: [
      "Track financial sustainability, social impact, engagement",
      "Independent audits & internal review panels",
      "Continuous improvement based on lessons learned",
    ],
  },
  {
    title: "Reporting & Communication",
    icon: Megaphone,
    items: [
      "Annual public reports & dashboards",
      "Stakeholder newsletters & updates",
      "Complaint and grievance mechanisms",
    ],
  },
];

function AccordionItem({ area, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${open ? "border-rose-200 shadow-sm shadow-rose-100" : "border-slate-100 hover:border-slate-200"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left bg-white hover:bg-slate-50/50 transition-colors"
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${open ? "bg-gradient-to-br from-rose-500 to-pink-500 shadow-md shadow-rose-200" : "bg-slate-100"}`}>
          {(() => {
            const IconComponent = area.icon;
            return <IconComponent className={`w-5 h-5 transition-colors duration-300 ${open ? "text-white" : "text-slate-500"}`} />;
          })()}
        </div>
        <span className="flex-1 font-bold text-[#0d1b2a]">{area.title}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-white"
      >
        <div className="px-5 sm:px-6 pb-6 pl-20">
          <ul className="space-y-2">
            {area.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default function GovernanceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="governance" className="py-24 lg:py-32 bg-slate-50" ref={ref}>
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="text-rose-500 text-xs font-bold tracking-widest uppercase">Governance & Ethics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d1b2a] leading-tight mb-4 max-w-2xl mx-auto">
            Transparent.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              Accountable.
            </span>{" "}
            Ethical.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-3"
        >
          {governanceAreas.map((area, i) => (
            <AccordionItem key={i} area={area} index={i} />
          ))}
        </motion.div>

        {/* Commitment Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 p-8 rounded-3xl bg-[#0d1b2a] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
          <div className="relative">
            <Shield className="w-10 h-10 text-rose-400 mx-auto mb-4" />
            <p className="text-white/70 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto italic">
              "Kindness Community is committed to a trustworthy, transparent, and sustainable
              ecosystem. All initiatives, partnerships, and operations are guided by ethical governance,
              legal compliance, and measurable community impact."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}