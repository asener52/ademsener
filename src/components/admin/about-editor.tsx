"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Save, Plus, X } from "lucide-react";
import type { AboutInfo } from "@/types";

export function AboutEditor({ about }: { about: AboutInfo | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: about?.full_name || "Adem ŞENER",
    title: about?.title || "CBS Uzmanı & Yazılım Geliştirici",
    organization: about?.organization || "Ünye Belediyesi Bilgi İşlem Müdürlüğü",
    bio: about?.bio || "",
    profile_image: about?.profile_image || "",
    social_email: about?.social_links?.email || "",
    social_linkedin: about?.social_links?.linkedin || "",
    social_github: about?.social_links?.github || "",
    social_twitter: about?.social_links?.twitter || "",
  });
  const [skills, setSkills] = useState<string[]>(about?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const data = {
      full_name: form.full_name,
      title: form.title,
      organization: form.organization,
      bio: form.bio,
      profile_image: form.profile_image || null,
      skills,
      social_links: {
        email: form.social_email,
        linkedin: form.social_linkedin,
        github: form.social_github,
        twitter: form.social_twitter,
      },
    };

    if (about?.id) {
      await supabase.from("about_info").update(data).eq("id", about.id);
    } else {
      await supabase.from("about_info").insert(data);
    }

    setSaving(false);
    router.refresh();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors text-sm";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-3">Kişisel Bilgiler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ad Soyad</label>
              <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Unvan</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Kurum</label>
            <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Biyografi</label>
            <textarea
              rows={6}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={`${inputClass} resize-none`}
              placeholder="Kendiniz hakkında kısa bir biyografi yazın..."
            />
          </div>
          <div>
            <label className={labelClass}>Profil Fotoğrafı URL</label>
            <input type="url" value={form.profile_image} onChange={(e) => setForm({ ...form, profile_image: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-3 mb-4">Beceriler & Teknolojiler</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-300">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="text-slate-500 hover:text-red-400 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="Yeni beceri ekle..."
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-3 py-2 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:bg-sky-500 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-3">Sosyal Bağlantılar</h3>
          {[
            { key: "social_email", label: "E-posta", placeholder: "ornek@email.com" },
            { key: "social_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
            { key: "social_github", label: "GitHub URL", placeholder: "https://github.com/..." },
            { key: "social_twitter", label: "Twitter URL", placeholder: "https://twitter.com/..." },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
              <input
                type={key === "social_email" ? "email" : "url"}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}
