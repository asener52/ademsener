"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { Save, Eye, ArrowLeft, Star, Globe } from "lucide-react";
import type { Post } from "@/types";

interface PostEditorProps {
  post?: Post;
  mode: "create" | "edit";
}

export function PostEditor({ post, mode }: PostEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    cover_image: post?.cover_image || "",
    type: post?.type || "article",
    tags: post?.tags?.join(", ") || "",
    published: post?.published || false,
    featured: post?.featured || false,
  });

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? slugify(title) : prev.slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const data = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image || null,
      type: form.type,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      published: form.published,
      featured: form.featured,
    };

    let error;
    if (mode === "create") {
      ({ error } = await supabase.from("posts").insert(data));
    } else {
      ({ error } = await supabase.from("posts").update(data).eq("id", post!.id));
    }

    setSaving(false);
    if (!error) {
      router.push("/admin/posts");
      router.refresh();
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">
            {mode === "create" ? "Yeni İçerik" : "İçeriği Düzenle"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Başlık *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="İçerik başlığı..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors font-mono text-sm"
                  placeholder="url-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Özet</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors resize-none text-sm"
                  placeholder="Kısa özet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">İçerik (HTML destekli)</label>
                <textarea
                  rows={20}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors resize-none text-sm font-mono"
                  placeholder="<p>İçeriğinizi buraya yazın...</p>"
                />
                <p className="text-xs text-slate-500 mt-1">HTML etiketleri kullanabilirsiniz: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;, vs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Yayın Ayarları</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Yayınla</span>
                </div>
                <div
                  onClick={() => setForm({ ...form, published: !form.published })}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${form.published ? "bg-sky-500" : "bg-slate-700"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow mt-0.5 transition-transform ${form.published ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Öne Çıkan</span>
                </div>
                <div
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${form.featured ? "bg-amber-500" : "bg-slate-700"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow mt-0.5 transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-5 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>

          {/* Type */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">İçerik Türü</h3>
            <div className="space-y-2">
              {[
                { value: "article", label: "Makale" },
                { value: "news", label: "Son Gelişme" },
                { value: "announcement", label: "Duyuru" },
                { value: "training", label: "Eğitim" },
                { value: "project", label: "Proje" },
                { value: "publication", label: "Yayın" },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setForm({ ...form, type: value as any })}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      form.type === value ? "border-sky-500 bg-sky-500" : "border-slate-600"
                    }`}
                  >
                    {form.type === value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm text-slate-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Meta Bilgiler</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Kapak Görseli URL</label>
              <input
                type="url"
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Etiketler (virgülle ayırın)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="cbs, gis, harita"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
