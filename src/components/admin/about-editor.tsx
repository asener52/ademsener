"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X, Loader2 } from "lucide-react";

interface AboutInfo { id?: string; full_name?: string; title?: string; organization?: string; bio?: string; profile_image?: string; skills?: string[]; social_links?: Record<string, string>; }

export function AboutEditor({ about }: { about: AboutInfo | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name:       about?.full_name       || "Adem ŞENER",
    title:           about?.title           || "CBS Uzmanı & Yazılım Geliştirici",
    organization:    about?.organization    || "Ünye Belediyesi Bilgi İşlem Müdürlüğü",
    bio:             about?.bio             || "",
    profile_image:   about?.profile_image   || "",
    social_email:    about?.social_links?.email    || "",
    social_linkedin: about?.social_links?.linkedin || "",
    social_github:   about?.social_links?.github   || "",
  });
  const [skills, setSkills] = useState<string[]>(about?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(s => [...s, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        skills,
        social_links: { email: form.social_email, linkedin: form.social_linkedin, github: form.social_github },
      }),
    });
    setSaving(false);
    router.refresh();
  };

  const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 12, fontSize: 14, border: "1px solid rgba(22,48,64,0.15)", background: "rgba(255,255,255,0.60)", color: "var(--text)", outline: "none", fontFamily: "inherit" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 6 };
  const card: React.CSSProperties = { background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 22, padding: 22, boxShadow: "0 10px 24px rgba(31,90,110,0.07)" };

  return (
    <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, maxWidth: 900 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Personal */}
        <div style={card}>
          <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(22,48,64,0.07)" }}>Kişisel Bilgiler</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label style={lbl}>Ad Soyad</label><input style={inp} value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
            <div><label style={lbl}>Unvan</label><input style={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          </div>
          <div style={{ marginBottom: 14 }}><label style={lbl}>Kurum</label><input style={inp} value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} /></div>
          <div style={{ marginBottom: 14 }}><label style={lbl}>Biyografi</label><textarea rows={5} style={{ ...inp, resize: "vertical" }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Kendiniz hakkında kısa bir biyografi..." /></div>
          <div><label style={lbl}>Profil Fotoğrafı URL</label><input type="url" style={inp} value={form.profile_image} onChange={e => setForm(f => ({ ...f, profile_image: e.target.value }))} placeholder="https://..." /></div>
        </div>

        {/* Skills */}
        <div style={card}>
          <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(22,48,64,0.07)" }}>Beceriler & Teknolojiler</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {skills.map(skill => (
              <div key={skill} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 10, background: "rgba(27,154,170,0.08)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                {skill}
                <button type="button" onClick={() => setSkills(s => s.filter(x => x !== skill))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", padding: 0 }}>
                  <X style={{ width: 12, height: 12 }} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inp, flex: 1 }} value={newSkill} onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Yeni beceri ekle..." />
            <button type="button" onClick={addSkill}
              style={{ padding: "11px 16px", borderRadius: 12, background: "rgba(27,154,170,0.10)", border: "1px solid rgba(27,154,170,0.20)", color: "var(--primary)", cursor: "pointer", display: "grid", placeItems: "center" }}>
              <Plus style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={card}>
          <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(22,48,64,0.07)" }}>Sosyal Bağlantılar</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { key: "social_email",    label: "E-posta",     type: "email" },
              { key: "social_linkedin", label: "LinkedIn URL", type: "url" },
              { key: "social_github",   label: "GitHub URL",   type: "url" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label style={lbl}>{label}</label>
                <input type={type} style={inp} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 20px", borderRadius: 16, fontSize: 14, fontWeight: 800, color: "#fff", border: "none", cursor: "pointer", background: "linear-gradient(135deg,var(--primary),var(--secondary))", boxShadow: "0 10px 24px rgba(27,154,170,0.28)", opacity: saving ? 0.6 : 1, fontFamily: "inherit" }}>
          {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Save style={{ width: 16, height: 16 }} />}
          {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}
