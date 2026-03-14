import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, MapPin, Users } from "lucide-react";

const leaders = [
  {
    icon: Lightbulb,
    role: "Founder & Chief Visionary",
    name: "Fred A. Behr",
    desc: "A visionary leader dedicated to creating meaningful, lasting impact, Fred A. Behr drives Kindness Community's mission to deliver sustainable, scalable community transformation through ethical enterprise and responsible technology. He shapes long-term strategy and fosters innovation while ensuring every initiative reflects the core values of integrity, inclusivity, and measurable impact empowering communities and promoting lasting positive change.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: MapPin,
    role: "India Operations Director",
    name: "Operations Leadership",
    desc: "With over 20 years of industry experience, the India Operations Director leads strategic and operational initiatives nationwide, ensuring strong governance, compliance, and seamless execution. Supported by a dedicated, high-performing team with a proven track record of delivery, the role drives operational excellence, community-focused implementation, and sustainable impact—ensuring every initiative is executed efficiently and aligned with organizational goals.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Users,
    role: "Advisory Committees",
    name: "Expert Guidance & Strategic Oversight",
    desc: "Our Advisory Committees bring together a diverse group of experts in technology, ethics, governance, and community development to provide independent, strategic guidance. They offer insight on innovation, risk management, compliance, and responsible growth—helping leadership navigate complex decisions while ensuring transparency, accountability, and sustainable, community-focused impact.",
    gradient: "from-sky-500 to-cyan-400",
  },
];

export default function LeadershipSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="leadership" className="py-24 lg:py-32 bg-slate-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="text-rose-500 text-xs font-bold tracking-widest uppercase">Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d1b2a] leading-tight max-w-2xl mx-auto">
            Guided by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              vision and integrity
            </span>
          </h2>
        </motion.div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {leaders.map((leader, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="group bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 flex flex-col sm:flex-row gap-8 items-start"
            >
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${leader.gradient} flex items-center justify-center shadow-lg`}>
                  {(() => {
                    const IconComponent = leader.icon;
                    return <IconComponent className="w-8 h-8 text-white" />;
                  })()}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">{leader.role}</p>
                <h3 className="text-xl font-extrabold text-[#0d1b2a] mb-3">{leader.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{leader.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}