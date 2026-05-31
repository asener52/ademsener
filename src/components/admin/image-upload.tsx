"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Kapak Görseli" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const lbl: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 800,
    textTransform: "uppercase", letterSpacing: "0.06em",
    color: "var(--muted)", marginBottom: 6,
  };

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yükleme başarısız");
      onChange(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label style={lbl}>{label}</label>

      {value ? (
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(22,48,64,0.15)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Kapak" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              position: "absolute", top: 8, right: 8,
              background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%",
              width: 28, height: 28, display: "grid", placeItems: "center",
              cursor: "pointer", color: "#fff",
            }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{
            border: "2px dashed rgba(22,48,64,0.2)", borderRadius: 12,
            padding: "28px 16px", textAlign: "center",
            cursor: uploading ? "not-allowed" : "pointer",
            background: "rgba(255,255,255,0.4)",
            transition: "border-color 0.2s",
          }}
        >
          {uploading ? (
            <Loader2 style={{ width: 28, height: 28, margin: "0 auto 8px", color: "var(--primary)", animation: "spin 1s linear infinite" }} />
          ) : (
            <ImageIcon style={{ width: 28, height: 28, margin: "0 auto 8px", color: "var(--muted)", display: "block" }} />
          )}
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
            {uploading ? "Yükleniyor..." : "Resim yükle"}
          </p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>
            Tıkla veya sürükle bırak · JPG, PNG, WEBP · Maks 5MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {error && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 6, fontWeight: 600 }}>{error}</p>}
    </div>
  );
}
