import { queryOne, query } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart2, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function SurveyResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [survey, responses] = await Promise.all([
    queryOne<any>("SELECT * FROM surveys WHERE id = ?", [id]),
    query<any>("SELECT * FROM survey_responses WHERE survey_id = ? ORDER BY created_at DESC", [id]),
  ]);

  if (!survey) notFound();

  if (survey.questions && typeof survey.questions === "string") {
    try { survey.questions = JSON.parse(survey.questions); } catch { survey.questions = []; }
  }

  // Parse answers JSON in each response
  const parsedResponses = responses.map((r: any) => {
    if (r.answers && typeof r.answers === "string") {
      try { r.answers = JSON.parse(r.answers); } catch { r.answers = {}; }
    }
    return r;
  });

  const questions: any[] = survey.questions || [];

  const aggregated = questions.map((q: any, qi: number) => {
    const answers = parsedResponses.map((r: any) => r.answers[qi]);
    if (q.type === "text") {
      return { ...q, textAnswers: answers.filter(Boolean) };
    }
    if (q.type === "rating") {
      const nums = answers.filter(Boolean).map(Number);
      const avg = nums.length ? (nums.reduce((a: number, b: number) => a + b, 0) / nums.length).toFixed(1) : "-";
      const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      nums.forEach((n: number) => { if (dist[n] !== undefined) dist[n]++; });
      return { ...q, avg, dist, total: nums.length };
    }
    const counts: Record<string, number> = {};
    (q.options || []).forEach((o: string) => { counts[o] = 0; });
    answers.forEach((a: any) => {
      if (Array.isArray(a)) a.forEach((v: string) => { if (counts[v] !== undefined) counts[v]++; });
      else if (a && counts[a] !== undefined) counts[a]++;
    });
    const total = Object.values(counts).reduce((s: number, n: number) => s + n, 0);
    return { ...q, counts, total };
  });

  return (
    <div style={{ padding: 48, maxWidth: 760 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/surveys" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 16, textDecoration: "none" }}>
          <ArrowLeft style={{ width: 16, height: 16 }} /> Anketlere Dön
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1px", color: "var(--text)" }}>{survey.title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
            <Users style={{ width: 14, height: 14 }} /> {parsedResponses.length} yanıt
          </span>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{formatDate(survey.created_at)}</span>
        </div>
      </div>

      {parsedResponses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", borderRadius: 22, background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)" }}>
          <BarChart2 style={{ width: 40, height: 40, margin: "0 auto 12px", color: "rgba(22,48,64,0.15)" }} />
          <p style={{ color: "var(--muted)" }}>Henüz yanıt yok.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {aggregated.map((q: any, i: number) => (
            <div key={i} style={{ padding: 22, borderRadius: 22, background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 10px 24px rgba(31,90,110,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 24, height: 24, borderRadius: 8, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(27,154,170,0.10)", color: "var(--primary)" }}>{i + 1}</span>
                <h3 style={{ fontWeight: 700, fontSize: 14, flex: 1, color: "var(--text)" }}>{q.text || "(Soru metni yok)"}</h3>
                <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 20, fontWeight: 600, background: "rgba(22,48,64,0.06)", color: "var(--muted)" }}>
                  {q.type === "single" ? "Tek Seçim" : q.type === "multiple" ? "Çoklu" : q.type === "rating" ? "Puan" : "Metin"}
                </span>
              </div>

              {(q.type === "single" || q.type === "multiple") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(q.counts || {}).map(([opt, cnt]: any) => {
                    const pct = q.total > 0 ? Math.round((cnt / q.total) * 100) : 0;
                    return (
                      <div key={opt}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                          <span style={{ color: "var(--text)", fontWeight: 600 }}>{opt}</span>
                          <span style={{ color: "var(--muted)" }}>{cnt} yanıt · %{pct}</span>
                        </div>
                        <div style={{ height: 8, borderRadius: 4, overflow: "hidden", background: "rgba(22,48,64,0.06)" }}>
                          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg,var(--primary),var(--secondary))" }} />
                        </div>
                      </div>
                    );
                  })}
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Toplam: {q.total} yanıt</p>
                </div>
              )}

              {q.type === "rating" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)" }}>{q.avg}</span>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>/ 5 ortalama ({q.total} yanıt)</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1, 2, 3, 4, 5].map((n: number) => {
                      const cnt = q.dist[n] || 0;
                      const pct = q.total > 0 ? Math.round((cnt / q.total) * 100) : 0;
                      return (
                        <div key={n} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ height: 64, borderRadius: 8, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 4, background: "rgba(22,48,64,0.04)" }}>
                            <div style={{ width: "100%", borderRadius: 4, height: `${Math.max(pct, 4)}%`, background: "linear-gradient(0deg,var(--primary),var(--secondary))" }} />
                          </div>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginTop: 4 }}>{n}</p>
                          <p style={{ fontSize: 11, color: "var(--muted)" }}>{cnt}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {q.type === "text" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
                  {(q.textAnswers || []).length === 0 ? (
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>Yanıt yok</p>
                  ) : q.textAnswers.map((a: string, ai: number) => (
                    <div key={ai} style={{ padding: "10px 14px", borderRadius: 10, fontSize: 13, background: "rgba(22,48,64,0.04)", color: "var(--text)" }}>
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
