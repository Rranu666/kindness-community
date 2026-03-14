import { useState } from "react";
import { Mail, Users, ChevronDown, ChevronUp, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";

const faqs = [
  {
    question: "How is my donation used?",
    answer:
      "100% of your donation goes directly to our community programs. We maintain full transparency with annual financial reports. Administrative costs are covered by dedicated operational grants.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Yes. Kindness Community is registered under Section 80G of the Income Tax Act, making all donations eligible for tax deductions in India.",
  },
  {
    question: "How can I volunteer with Kindness Community?",
    answer:
      "You can sign up using the volunteer form on this page. Our team will reach out within 3–5 working days to match you with an initiative that fits your skills and availability.",
  },
  {
    question: "Does Kindness Community operate outside India?",
    answer:
      "Currently our programs are focused in India. We are exploring partnerships for global outreach and welcome international volunteers and donors.",
  },
  {
    question: "How do I stay updated on Kindness Community's work?",
    answer:
      "Subscribe to our newsletter below to receive quarterly updates, impact stories, and event announcements directly in your inbox.",
  },
];

export default function EngagementSection() {
  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState({ name: "", email: "", skills: "" });
  const [volunteerDone, setVolunteerDone] = useState(false);
  const [loading, setLoading] = useState({ newsletter: false, volunteer: false });

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading((l) => ({ ...l, newsletter: true }));
    await base44.entities.VolunteerSubmission.create({
      name: "Newsletter Subscriber",
      email,
      skills: "newsletter",
      status: "new",
    });
    setLoading((l) => ({ ...l, newsletter: false }));
    setNewsletterDone(true);
    setEmail("");
  };

  const handleVolunteer = async (e) => {
    e.preventDefault();
    if (!volunteerForm.name || !volunteerForm.email) return;
    setLoading((l) => ({ ...l, volunteer: true }));
    await base44.entities.VolunteerSubmission.create({
      name: volunteerForm.name,
      email: volunteerForm.email,
      skills: volunteerForm.skills,
      status: "new",
    });
    setLoading((l) => ({ ...l, volunteer: false }));
    setVolunteerDone(true);
    setVolunteerForm({ name: "", email: "", skills: "" });
  };

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-rose-500 text-sm font-semibold uppercase tracking-widest">Get Involved</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a2e4a] mt-2 mb-3">Join Our Community</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Whether you want to stay informed, lend your skills, or simply ask questions — there's a place for you here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Newsletter */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-100 text-rose-500 p-2 rounded-full">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2e4a]">Newsletter</h3>
            </div>
            <p className="text-slate-500 text-sm mb-5">
              Get quarterly impact updates, stories from the field, and event news delivered to your inbox.
            </p>
            {newsletterDone ? (
              <div className="flex items-center gap-2 text-green-600 font-medium text-sm bg-green-50 rounded-lg px-4 py-3">
                <Heart className="w-4 h-4" /> Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={loading.newsletter} className="bg-rose-500 hover:bg-rose-600 text-white gap-1">
                  <Send className="w-4 h-4" />
                  {loading.newsletter ? "..." : "Subscribe"}
                </Button>
              </form>
            )}
          </div>

          {/* Volunteer */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2e4a]">Volunteer With Us</h3>
            </div>
            <p className="text-slate-500 text-sm mb-5">
              Share your time, skills, and passion. We'll find the right program for you.
            </p>
            {volunteerDone ? (
              <div className="flex items-center gap-2 text-green-600 font-medium text-sm bg-green-50 rounded-lg px-4 py-3">
                <Heart className="w-4 h-4" /> We'll be in touch soon — thank you!
              </div>
            ) : (
              <form onSubmit={handleVolunteer} className="space-y-3">
                <Input
                  placeholder="Your full name"
                  value={volunteerForm.name}
                  onChange={(e) => setVolunteerForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={volunteerForm.email}
                  onChange={(e) => setVolunteerForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
                <Input
                  placeholder="Skills or area of interest (optional)"
                  value={volunteerForm.skills}
                  onChange={(e) => setVolunteerForm((f) => ({ ...f, skills: e.target.value }))}
                />
                <Button type="submit" disabled={loading.volunteer} className="w-full bg-[#1a2e4a] hover:bg-[#243d62] text-white">
                  {loading.volunteer ? "Submitting..." : "Register as Volunteer"}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-[#1a2e4a] text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 flex justify-between items-center gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-[#1a2e4a] text-sm md:text-base">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-rose-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}