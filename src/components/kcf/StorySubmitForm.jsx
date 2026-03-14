import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Send, Loader2, X, Plus } from "lucide-react";

const PILLARS = [
  "Education",
  "Economic Empowerment",
  "Health & Wellness",
  "Community Development",
  "Environmental Sustainability",
  "Cultural Preservation",
];

const PILLAR_COLORS = {
  "Education": "bg-blue-100 text-blue-700",
  "Economic Empowerment": "bg-emerald-100 text-emerald-700",
  "Health & Wellness": "bg-rose-100 text-rose-700",
  "Community Development": "bg-amber-100 text-amber-700",
  "Environmental Sustainability": "bg-green-100 text-green-700",
  "Cultural Preservation": "bg-purple-100 text-purple-700",
};

export default function StorySubmitForm({ onSuccess }) {
  const [form, setForm] = useState({
    author_name: "",
    author_email: "",
    title: "",
    story: "",
    pillar: "",
    tags: [],
    location: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const addTag = (tag) => {
    const t = tag.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleAIAssist = async () => {
    if (!form.story && !form.title) return;
    setAiLoading(true);
    setAiSuggestions(null);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an assistant for Kindness Community — a nonprofit focused on education, economic empowerment, health & wellness, community development, environmental sustainability, and cultural preservation.

A user has started writing a community impact story. Help them:
1. Improve or expand their story draft (keep their voice, just enrich it)
2. Suggest the best mission pillar category
3. Suggest 3–5 relevant tags

User's title: "${form.title}"
User's story draft: "${form.story}"

Respond as JSON.`,
        response_json_schema: {
          type: "object",
          properties: {
            improved_story: { type: "string" },
            suggested_pillar: { type: "string" },
            suggested_tags: { type: "array", items: { type: "string" } },
          },
        },
      });
      setAiSuggestions(result);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAISuggestions = () => {
    if (!aiSuggestions) return;
    setForm((f) => ({
      ...f,
      story: aiSuggestions.improved_story || f.story,
      pillar: aiSuggestions.suggested_pillar || f.pillar,
      tags: [
        ...new Set([...f.tags, ...(aiSuggestions.suggested_tags || [])]),
      ],
    }));
    setAiSuggestions(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.CommunityStory.create(form);
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  const isAIReady = form.story.length > 30 || form.title.length > 5;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name & Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name *</label>
          <input
            name="author_name"
            value={form.author_name}
            onChange={handleChange}
            required
            placeholder="Jane Doe"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
          <input
            name="author_email"
            type="email"
            value={form.author_email}
            onChange={handleChange}
            required
            placeholder="jane@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="City, Country"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Story Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="How Kindness Community Changed My Life..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
        />
      </div>

      {/* Story */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-semibold text-slate-700">Your Story *</label>
          <button
            type="button"
            onClick={handleAIAssist}
            disabled={!isAIReady || aiLoading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-400 hover:to-purple-400 transition-all"
          >
            {aiLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            AI Assist
          </button>
        </div>
        <textarea
          name="story"
          value={form.story}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Share your experience with Kindness Community's initiatives. How did it impact you, your family, or your community?"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">Write at least a few sentences, then click "AI Assist" to refine your story.</p>
      </div>

      {/* AI Suggestions Panel */}
      {aiSuggestions && (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-violet-700">
            <Sparkles className="w-4 h-4" /> AI Suggestions
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Improved Story</p>
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">{aiSuggestions.improved_story}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500">Pillar:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PILLAR_COLORS[aiSuggestions.suggested_pillar] || "bg-slate-100 text-slate-600"}`}>
              {aiSuggestions.suggested_pillar}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500">Tags:</span>
            {(aiSuggestions.suggested_tags || []).map((t) => (
              <span key={t} className="text-xs bg-white border border-violet-200 text-violet-600 px-2 py-0.5 rounded-full">#{t}</span>
            ))}
          </div>
          <button
            type="button"
            onClick={applyAISuggestions}
            className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            Apply All Suggestions
          </button>
        </div>
      )}

      {/* Pillar */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Mission Pillar *</label>
        <div className="flex flex-wrap gap-2">
          {PILLARS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setForm((f) => ({ ...f, pillar: p }))}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                form.pillar === p
                  ? "bg-rose-500 border-rose-500 text-white"
                  : "border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 text-xs bg-rose-50 border border-rose-200 text-rose-600 px-2 py-1 rounded-full">
              #{t}
              <button type="button" onClick={() => removeTag(t)} className="hover:text-rose-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
            placeholder="Add a tag..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
          />
          <button
            type="button"
            onClick={() => addTag(tagInput)}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-200 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {submitting ? "Submitting..." : "Share My Story"}
      </button>
    </form>
  );
}