"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Save, Eye, EyeOff, ArrowLeft, Star, Globe, Loader2 } from "lucide-react";

interface Post { id?: string; title?: string; slug?: string; excerpt?: string; content?: string; cover_image?: string; type?: string; tags?: string[]; published?: boolean; featured?: boolean; }

export function PostEditor({ post, mode }: { post?: Post; mode: "create" | "edit" }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title:       post?.title       || "",
    slug:        post?.slug        || "",
    excerpt:     post?.excerpt     || "",
    content:     post?.content     || "",
    cover_image: post?.cover_image || "",
    type:        post?.type        || "article",
    tags:        post?.tags?.join(", ") || "",
    published:   post?.published   || false,
    featured:    post?.featured    || false,
  });

  const handleTitleChange = (title: string) =>
    setForm(p => ({ ...p, title, slug: mode === "create" ? slugify(title) : p.slug }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };
    const url    = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${post!.id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) { router.push("/admin/posts"); router.refresh(); }
    else setError("Kaydedilemedi, tekrar deneyin.");
  };

  const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 12, fontSize: 14, border: "1px solid rgba(22,48,64,0.15)", background: "rgba(255,255,255,0.60)", color: "var(--text)", outline: "none", fontFamily: "inherit" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 6 };
  const card: React.CSSProperties = { background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 22, padding: 22, boxShadow: "0 10px 24px rgba(31,90,110,0.07)" };

  const Toggle = ({ value, onChange, label, icon: Icon, activeColor = "var(--primary)" }: any) => (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon style={{ width: 16, height: 16, color: "var(--muted)" }} />
        <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>{label}</span>
      </div>
      <div onClick={onChange} style={{ width: 40, height: 22, borderRadius: 11, background: value ? activeColor : "rgba(22,48,64,0.15)", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
      </div>
    </label>
  );

  return (
    <div style={{ padding: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button onClick={() => router.back()} style={{ padding: 8, borderRadius: 12, border: "1px solid rgba(22,48,64,0.12)", background: "rgba(255,255,255,0.76)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--muted)" }}>
          <ArrowLeft style={{ width: 18, height: 18 }} />
        </button>
        <div className="kicker" style={{ margin: 0 }}>{mode === "create" ? "✍️ Yeni İçerik" : "✏️ Düzenle"}</div>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1px", color: "var(--text)", marginBottom: 28 }}>
        {mode === "create" ? "Yeni İçerik Oluştur" : form.title || "İçeriği Düzenle"}
      </h1>

      <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={card}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={lbl}>Başlık *</label><input required style={inp} value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="İçerik başlığı..." /></div>
              <div><label style={lbl}>Slug (URL)</label><input style={{ ...inp, fontFamily: "monospace" }} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-slug" /></div>
              <div><label style={lbl}>Özet</label><textarea rows={3} style={{ ...inp, resize: "vertical" }} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Kısa özet..." /></div>
              <div>
                <label style={lbl}>İçerik (HTML destekli)</label>
                <textarea rows={22} style={{ ...inp, fontFamily: "monospace", fontSize: 13, resize: "vertical" }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="<p>İçeriğinizi yazın...</p>" />
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>HTML etiketleri: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;a&gt; vb.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Publish */}
          <div style={card}>
            <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 14 }}>Yayın Ayarları</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Toggle value={form.published} onChange={() => setForm(f => ({ ...f, published: !f.published }))} label="Yayınla" icon={form.published ? Eye : EyeOff} />
              <Toggle value={form.featured}  onChange={() => setForm(f => ({ ...f, featured: !f.featured }))}  label="Öne Çıkan" icon={Star} activeColor="#f59e0b" />
            </div>
            {error && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 10, fontWeight: 600 }}>{error}</p>}
            <button type="submit" disabled={saving}
              style={{ marginTop: 16, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 0", borderRadius: 14, fontSize: 14, fontWeight: 800, color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer", background: "linear-gradient(135deg,var(--primary),var(--secondary))", boxShadow: "0 8px 20px rgba(27,154,170,0.25)", opacity: saving ? 0.6 : 1, fontFamily: "inherit" }}>
              {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Save style={{ width: 16, height: 16 }} />}
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>

          {/* Type */}
          <div style={card}>
            <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 14 }}>İçerik Türü</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { value: "article",      label: "Makale",       color: "var(--primary)" },
                { value: "news",         label: "Haber",        color: "var(--secondary)" },
                { value: "announcement", label: "Duyuru",       color: "#f59e0b" },
                { value: "training",     label: "Eğitim",       color: "var(--accent)" },
                { value: "project",      label: "Proje",        color: "#ef4444" },
                { value: "publication",  label: "Yayın",        color: "#805ad5" },
              ].map(({ value, label, color }) => (
                <label key={value} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setForm(f => ({ ...f, type: value }))}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${form.type === value ? color : "rgba(22,48,64,0.20)"}`, background: form.type === value ? color : "transparent", display: "grid", placeItems: "center", transition: "all 0.15s", flexShrink: 0 }}>
                    {form.type === value && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: form.type === value ? color : "var(--muted)" }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div style={card}>
            <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 14 }}>Meta</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label style={lbl}>Kapak Görseli URL</label><input type="url" style={inp} value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="https://..." /></div>
              <div><label style={lbl}>Etiketler (virgülle)</label><input style={inp} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="cbs, gis, harita" /></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
