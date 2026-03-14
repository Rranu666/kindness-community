import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { PenLine, BookOpen, ChevronDown } from "lucide-react";
import StoryCard from "./StoryCard";
import StorySubmitForm from "./StorySubmitForm";

const PILLARS = [
  "All",
  "Education",
  "Economic Empowerment",
  "Health & Wellness",
  "Community Development",
  "Environmental Sustainability",
  "Cultural Preservation",
];

export default function CommunityStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    base44.entities.CommunityStory.filter({ status: "approved" }, "-created_date", 50)
      .then(setStories)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All"
    ? stories
    : stories.filter((s) => s.pillar === activeFilter);

  const visible = filtered.slice(0, visibleCount);

  const handleSuccess = () => {
    setShowForm(false);
    setSubmitted(true);
  };

  return (
    <section id="stories" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-rose-600 text-xs font-bold uppercase tracking-widest mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Real Impact, Real People
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            Community{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              Stories
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Voices from the communities we serve — stories of resilience, growth, and transformation shaped by our mission.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {PILLARS.map((p) => (
            <button
              key={p}
              onClick={() => { setActiveFilter(p); setVisibleCount(6); }}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all ${
                activeFilter === p
                  ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200"
                  : "border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500 bg-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 h-64 animate-pulse">
                <div className="h-4 bg-slate-100 rounded-full w-1/3 mb-4" />
                <div className="h-5 bg-slate-100 rounded-full w-2/3 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded-full w-full" />
                  <div className="h-3 bg-slate-100 rounded-full w-5/6" />
                  <div className="h-3 bg-slate-100 rounded-full w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
            {filtered.length > visibleCount && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500 font-semibold text-sm transition-all"
                >
                  <ChevronDown className="w-4 h-4" /> Load More Stories
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No stories yet in this category.</p>
            <p className="text-sm mt-1">Be the first to share your experience!</p>
          </div>
        )}

        {/* CTA / Form */}
        <div className="mt-16">
          {submitted ? (
            <div className="max-w-xl mx-auto text-center bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-3xl p-10">
              <div className="text-4xl mb-3">🙏</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Thank you for sharing!</h3>
              <p className="text-slate-500 text-sm">
                Your story has been submitted for review and will appear here once approved. Your voice matters to our community.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 text-sm font-semibold text-rose-500 hover:text-rose-600 underline underline-offset-2"
              >
                Submit another story
              </button>
            </div>
          ) : showForm ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Share Your Story</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Use AI Assist to help craft your narrative</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
              <StorySubmitForm onSuccess={handleSuccess} />
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10">
              <h3 className="text-2xl font-extrabold text-white mb-3">
                Has Kindness Community impacted your life?
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Share your journey and inspire others. Our AI assistant will help you tell your story beautifully.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-rose-500/30"
              >
                <PenLine className="w-4 h-4" />
                Write Your Story
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}