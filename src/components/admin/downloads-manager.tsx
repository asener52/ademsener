"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Download, FileText, Loader2, X, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DownloadItem {
  id: string;
  title: string;
  description?: string;
  filename: string;
  original_name: string;
  file_size: number;
  file_type: string;
  download_count: number;
  created_at: string;
}

export function DownloadsManager({
  downloads: initial,
  formatBytes,
}: {
  downloads: DownloadItem[];
  formatBytes: (n: number) => string;
}) {
  const [downloads, setDownloads] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 12, fontSize: 14,
    border: "1px solid rgba(22,48,64,0.15)", background: "rgba(255,255,255,0.60)",
    color: "var(--text)", outline: "none", fontFamily: "inherit",
  };
  const lbl: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase",
    letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 6,
  };
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)",
    borderRadius: 22, padding: 24, boxShadow: "0 10px 24px rgba(31,90,110,0.07)",
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) { setError("Başlık ve dosya zorunludur"); return; }
    setUploading(true); setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title.trim());
    if (description) fd.append("description", description);
    const res = await fetch("/api/admin/downloads", { method: "POST", body: fd });
    if (res.ok) {
      // Listeyi yenile
      const r2 = await fetch("/api/admin/downloads");
      const data = await r2.json();
      setDownloads(data.downloads || []);
      setTitle(""); setDescription(""); setFile(null); setShowForm(false);
    } else {
      const d = await res.json();
      setError(d.error || "Yükleme başarısız");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu dosyayı silmek istediğinizden emin misiniz?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/downloads/${id}`, { method: "DELETE" });
    setDownloads(d => d.filter(x => x.id !== id));
    setDeletingId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Upload Form */}
      {showForm ? (
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>Yeni Dosya Ekle</p>
            <button type="button" onClick={() => { setShowForm(false); setError(""); }}
              style={{ padding: 6, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: "var(--muted)" }}>
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>
          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={lbl}>Başlık *</label><input required style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Dosya başlığı..." /></div>
            <div><label style={lbl}>Açıklama</label><textarea rows={2} style={{ ...inp, resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Kısa açıklama..." /></div>
            <div>
              <label style={lbl}>Dosya *</label>
              {file ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(27,154,170,0.25)", background: "rgba(27,154,170,0.05)" }}>
                  <FileText style={{ width: 18, height: 18, color: "var(--primary)", flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>{formatBytes(file.size)}</span>
                  <button type="button" onClick={() => setFile(null)} style={{ padding: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--muted)", flexShrink: 0 }}>
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              ) : (
                <div onClick={() => inputRef.current?.click()}
                  style={{ border: "2px dashed rgba(22,48,64,0.18)", borderRadius: 12, padding: "28px 16px", textAlign: "center", cursor: "pointer", background: "rgba(255,255,255,0.40)" }}>
                  <Upload style={{ width: 28, height: 28, margin: "0 auto 8px", color: "var(--muted)", display: "block" }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Dosya seç</p>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>Tıkla veya sürükle · Maks 50MB</p>
                </div>
              )}
              <input ref={inputRef} type="file" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
            </div>
            {error && <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={uploading}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 14, border: "none", cursor: uploading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,var(--primary),var(--secondary))", opacity: uploading ? 0.6 : 1, fontFamily: "inherit" }}>
                {uploading ? <Loader2 style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} /> : <Upload style={{ width: 15, height: 15 }} />}
                {uploading ? "Yükleniyor..." : "Yükle"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 22px", borderRadius: 18, border: "2px dashed rgba(27,154,170,0.25)", background: "rgba(255,255,255,0.60)", cursor: "pointer", fontSize: 14, fontWeight: 800, color: "var(--primary)", fontFamily: "inherit", width: "fit-content" }}>
          <Plus style={{ width: 18, height: 18 }} /> Yeni Dosya Ekle
        </button>
      )}

      {/* List */}
      {downloads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", ...card }}>
          <Download style={{ width: 40, height: 40, color: "rgba(22,48,64,0.12)", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 14, color: "var(--muted)" }}>Henüz dosya yok.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {downloads.map((dl) => (
            <div key={dl.id} style={{ display: "flex", alignItems: "center", gap: 16, ...card, padding: "16px 20px" }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: "rgba(27,154,170,0.08)", border: "1px solid rgba(27,154,170,0.14)", flexShrink: 0 }}>
                <FileText style={{ width: 22, height: 22, color: "var(--primary)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 3 }}>{dl.title}</p>
                {dl.description && <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{dl.description}</p>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 11, color: "var(--muted)" }}>
                  <span>{dl.original_name}</span>
                  <span>·</span>
                  <span>{formatBytes(dl.file_size)}</span>
                  <span>·</span>
                  <span>{dl.download_count} indirme</span>
                  <span>·</span>
                  <span>{formatDate(dl.created_at)}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <a href={`/api/downloads/${dl.id}`}
                  style={{ padding: "8px 14px", borderRadius: 12, border: "1px solid rgba(27,154,170,0.20)", background: "rgba(27,154,170,0.06)", color: "var(--primary)", fontSize: 12, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                  <Download style={{ width: 13, height: 13 }} /> İndir
                </a>
                <button onClick={() => handleDelete(dl.id)} disabled={deletingId === dl.id}
                  style={{ padding: "8px 12px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.20)", background: "rgba(239,68,68,0.06)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, fontFamily: "inherit", opacity: deletingId === dl.id ? 0.5 : 1 }}>
                  {deletingId === dl.id ? <Loader2 style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} /> : <Trash2 style={{ width: 13, height: 13 }} />}
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
