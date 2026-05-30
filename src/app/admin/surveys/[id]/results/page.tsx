import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart2, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function SurveyResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: survey }, { data: responses }] = await Promise.all([
    supabase.from("surveys").select("*").eq("id", id).single(),
    supabase.from("survey_responses").select("*").eq("survey_id", id).order("created_at", { ascending: false }),
  ]);

  if (!survey) notFound();

  const questions: any[] = survey.questions || [];

  // Aggregate answers per question
  const aggregated = questions.map((q: any, qi: number) => {
    const answers = (responses || []).map(r => (r.answers as any)[qi]);
    if (q.type === "text") {
      return { ...q, textAnswers: answers.filter(Boolean) };
    }
    if (q.type === "rating") {
      const nums = answers.filter(Boolean).map(Number);
      const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : "-";
      const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      nums.forEach(n => { if (dist[n] !== undefined) dist[n]++; });
      return { ...q, avg, dist, total: nums.length };
    }
    // single / multiple
    const counts: Record<string, number> = {};
    (q.options || []).forEach((o: string) => { counts[o] = 0; });
    answers.forEach(a => {
      if (Array.isArray(a)) a.forEach(v => { if (counts[v] !== undefined) counts[v]++; });
      else if (a && counts[a] !== undefined) counts[a]++;
    });
    const total = Object.values(counts).reduce((s, n) => s + n, 0);
    return { ...q, counts, total };
  });

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/surveys" className="flex items-center gap-1.5 text-sm font-semibold mb-4" style={{ color: "#64748b" }}>
          <ArrowLeft className="w-4 h-4" /> Anketlere Dön
        </Link>
        <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>{survey.title}</h1>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-sm" style={{ color: "#64748b" }}>
            <Users className="w-4 h-4" /> {(responses || []).length} yanıt
          </span>
          <span className="text-sm" style={{ color: "#94a3b8" }}>{formatDate(survey.created_at)}</span>
        </div>
      </div>

      {(responses || []).length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
          <BarChart2 className="w-10 h-10 mx-auto mb-3" style={{ color: "#e2e8f0" }} />
          <p style={{ color: "#94a3b8" }}>Henüz yanıt yok.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {aggregated.map((q: any, i: number) => (
            <div key={i} className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center"
                  style={{ background: "rgba(27,154,170,0.10)", color: "#1b9aaa" }}>{i + 1}</span>
                <h3 className="font-bold text-sm flex-1" style={{ color: "#0f172a" }}>{q.text || "(Soru metni yok)"}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#f1f5f9", color: "#64748b" }}>
                  {q.type === "single" ? "Tek Seçim" : q.type === "multiple" ? "Çoklu" : q.type === "rating" ? "Puan" : "Metin"}
                </span>
              </div>

              {(q.type === "single" || q.type === "multiple") && (
                <div className="space-y-2">
                  {Object.entries(q.counts || {}).map(([opt, cnt]: any) => {
                    const pct = q.total > 0 ? Math.round((cnt / q.total) * 100) : 0;
                    return (
                      <div key={opt}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span style={{ color: "#334155", fontWeight: 600 }}>{opt}</span>
                          <span style={{ color: "#64748b" }}>{cnt} yanıt · %{pct}</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#1b9aaa,#4fb477)" }} />
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-xs mt-2" style={{ color: "#94a3b8" }}>Toplam: {q.total} yanıt</p>
                </div>
              )}

              {q.type === "rating" && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-black" style={{ color: "#1b9aaa" }}>{q.avg}</span>
                    <span className="text-sm" style={{ color: "#64748b" }}>/ 5 ortalama ({q.total} yanıt)</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => {
                      const cnt = q.dist[n] || 0;
                      const pct = q.total > 0 ? Math.round((cnt / q.total) * 100) : 0;
                      return (
                        <div key={n} className="flex-1 text-center">
                          <div className="h-16 rounded-lg flex items-end justify-center p-1" style={{ background: "#f8fafc" }}>
                            <div className="w-full rounded" style={{ height: `${pct || 2}%`, background: "linear-gradient(0deg,#1b9aaa,#4fb477)", minHeight: 4 }} />
                          </div>
                          <p className="text-xs font-bold mt-1" style={{ color: "#64748b" }}>{n}</p>
                          <p className="text-xs" style={{ color: "#94a3b8" }}>{cnt}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {q.type === "text" && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(q.textAnswers || []).length === 0 ? (
                    <p className="text-sm" style={{ color: "#94a3b8" }}>Yanıt yok</p>
                  ) : q.textAnswers.map((a: string, ai: number) => (
                    <div key={ai} className="p-3 rounded-xl text-sm" style={{ background: "#f8fafc", color: "#334155" }}>
                      "{a}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
