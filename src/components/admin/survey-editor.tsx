"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Plus, Trash2, GripVertical, X } from "lucide-react";

interface Question {
  id: string;
  type: "single" | "multiple" | "text" | "rating";
  text: string;
  options?: string[];
  required?: boolean;
}

interface SurveyData {
  id?: string;
  title?: string;
  description?: string;
  questions?: Question[];
  is_active?: boolean;
  ends_at?: string;
}

const newId = () => Math.random().toString(36).slice(2, 9);

export function SurveyEditor({ survey }: { survey?: SurveyData | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(survey?.title || "");
  const [description, setDescription] = useState(survey?.description || "");
  const [isActive, setIsActive] = useState(survey?.is_active ?? true);
  const [endsAt, setEndsAt] = useState(survey?.ends_at ? new Date(survey.ends_at).toISOString().slice(0, 16) : "");
  const [questions, setQuestions] = useState<Question[]>(
    (survey?.questions || []).map(q => ({ ...q, id: q.id || newId() }))
  );

  const addQuestion = (type: Question["type"]) => {
    setQuestions(qs => [...qs, {
      id: newId(), type, text: "", required: true,
      options: type === "single" || type === "multiple" ? ["Seçenek 1", "Seçenek 2"] : undefined,
    }]);
  };

  const updateQuestion = (id: string, patch: Partial<Question>) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, ...patch } : q));
  };

  const removeQuestion = (id: string) => setQuestions(qs => qs.filter(q => q.id !== id));

  const addOption = (qId: string) => {
    setQuestions(qs => qs.map(q => q.id === qId
      ? { ...q, options: [...(q.options || []), `Seçenek ${(q.options || []).length + 1}`] }
      : q));
  };

  const updateOption = (qId: string, idx: number, val: string) => {
    setQuestions(qs => qs.map(q => q.id === qId
      ? { ...q, options: q.options?.map((o, i) => i === idx ? val : o) }
      : q));
  };

  const removeOption = (qId: string, idx: number) => {
    setQuestions(qs => qs.map(q => q.id === qId
      ? { ...q, options: q.options?.filter((_, i) => i !== idx) }
      : q));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Başlık zorunludur"); return; }
    if (questions.length === 0) { setError("En az 1 soru ekleyin"); return; }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title, description, is_active: isActive,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        questions: questions.map(({ id, ...rest }) => rest),
      };
      const url = survey?.id ? `/api/admin/surveys/${survey.id}` : "/api/admin/surveys";
      const method = survey?.id ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      router.push("/admin/surveys");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 12, fontSize: 14,
    border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a",
    outline: "none", fontFamily: "inherit",
  };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" };
  const cardStyle = { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, marginBottom: 12 };

  const qTypeLabel: Record<Question["type"], string> = {
    single: "Tek Seçim", multiple: "Çoklu Seçim", text: "Metin Yanıtı", rating: "Puan (1-5)",
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {/* Basic info */}
      <div className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div className="space-y-4">
          <div>
            <label style={labelStyle}>Anket Başlığı *</label>
            <input style={inputStyle} required value={title} onChange={e => setTitle(e.target.value)} placeholder="Anket başlığı..." />
          </div>
          <div>
            <label style={labelStyle}>Açıklama</label>
            <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Katılımcılara kısa bir açıklama..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Bitiş Tarihi</label>
              <input type="datetime-local" style={inputStyle} value={endsAt} onChange={e => setEndsAt(e.target.value)} />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl" style={{ border: "1px solid #e2e8f0", background: isActive ? "rgba(79,180,119,0.06)" : "#f8fafc" }}>
                <div className="w-10 h-6 rounded-full relative transition-colors"
                  style={{ background: isActive ? "#4fb477" : "#cbd5e1" }}
                  onClick={() => setIsActive(!isActive)}>
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
                    style={{ left: isActive ? "calc(100% - 20px)" : 4 }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: isActive ? "#4fb477" : "#64748b" }}>
                  {isActive ? "Aktif" : "Kapalı"}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black" style={{ color: "#0f172a" }}>Sorular ({questions.length})</p>
        </div>

        {questions.map((q, idx) => (
          <div key={q.id} style={cardStyle}>
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-1 flex-shrink-0 pt-1">
                <span className="w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(27,154,170,0.10)", color: "#1b9aaa" }}>{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start gap-2">
                  <input style={{ ...inputStyle, flex: 1 }} value={q.text}
                    onChange={e => updateQuestion(q.id, { text: e.target.value })}
                    placeholder="Soru metni..." />
                  <select style={{ ...inputStyle, width: "auto", flexShrink: 0 }} value={q.type}
                    onChange={e => updateQuestion(q.id, { type: e.target.value as Question["type"], options: e.target.value === "single" || e.target.value === "multiple" ? ["Seçenek 1", "Seçenek 2"] : undefined })}>
                    {(["single", "multiple", "text", "rating"] as Question["type"][]).map(t => (
                      <option key={t} value={t}>{qTypeLabel[t]}</option>
                    ))}
                  </select>
                </div>

                {(q.type === "single" || q.type === "multiple") && (
                  <div className="space-y-2 pl-1">
                    {q.options?.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ border: "2px solid #e2e8f0" }} />
                        <input style={{ ...inputStyle, flex: 1 }} value={opt}
                          onChange={e => updateOption(q.id, oi, e.target.value)} />
                        <button type="button" onClick={() => removeOption(q.id, oi)}
                          className="p-1 rounded hover:bg-red-50 transition-colors" style={{ color: "#94a3b8" }}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(q.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold mt-1" style={{ color: "#1b9aaa" }}>
                      <Plus className="w-3 h-3" /> Seçenek ekle
                    </button>
                  </div>
                )}

                {q.type === "rating" && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: "rgba(27,154,170,0.08)", color: "#1b9aaa" }}>{n}</div>
                    ))}
                    <span className="text-xs self-center ml-1" style={{ color: "#94a3b8" }}>Puan skalası</span>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => removeQuestion(q.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0" style={{ color: "#94a3b8" }}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add question buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {(["single", "multiple", "text", "rating"] as Question["type"][]).map(t => (
            <button key={t} type="button" onClick={() => addQuestion(t)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
              style={{ background: "#ffffff", border: "1px solid #e2e8f0", color: "#64748b" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#1b9aaa"; e.currentTarget.style.color = "#1b9aaa"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}>
              <Plus className="w-3.5 h-3.5" /> {qTypeLabel[t]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.20)" }}>
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#1b9aaa,#4fb477)", boxShadow: "0 4px 14px rgba(27,154,170,0.28)" }}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {survey?.id ? "Güncelle" : "Kaydet"}
        </button>
        <a href="/admin/surveys" className="px-6 py-3 rounded-xl text-sm font-bold"
          style={{ color: "#64748b", border: "1px solid #e2e8f0" }}>
          İptal
        </a>
      </div>
    </form>
  );
}
