import { query } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, ClipboardList, BarChart2, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteSurveyButton } from "@/components/admin/delete-survey-button";

async function getSurveys() {
  try {
    const [surveys, responseCounts] = await Promise.all([
      query<any>("SELECT * FROM surveys ORDER BY created_at DESC"),
      query<any>("SELECT survey_id FROM survey_responses"),
    ]);
    const countMap: Record<string, number> = {};
    responseCounts.forEach((r: any) => { countMap[r.survey_id] = (countMap[r.survey_id] || 0) + 1; });
    return surveys.map((s: any) => {
      if (s.questions && typeof s.questions === "string") { try { s.questions = JSON.parse(s.questions); } catch { s.questions = []; } }
      return { ...s, responseCount: countMap[s.id] || 0 };
    });
  } catch { return []; }
}

export default async function SurveysPage() {
  const surveys = await getSurveys();

  return (
    <div style={{ padding: 48 }}>
      <div className="kicker">📊 Anket Yönetimi</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text)" }}>Anketler</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{surveys.length} anket · {surveys.filter(s => s.is_active).length} aktif</p>
        </div>
        <Link href="/panel/surveys/new"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 16, fontSize: 14, fontWeight: 800, textDecoration: "none", color: "#fff", background: "linear-gradient(135deg,var(--primary),var(--secondary))", boxShadow: "0 10px 24px rgba(27,154,170,0.28)" }}>
          <Plus style={{ width: 16, height: 16 }} /> Yeni Anket
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, boxShadow: "0 12px 28px rgba(31,90,110,0.08)" }}>
          <ClipboardList style={{ width: 48, height: 48, color: "rgba(22,48,64,0.12)", margin: "0 auto 14px" }} />
          <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Henüz anket yok</p>
          <Link href="/panel/surveys/new" style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>+ İlk anketi oluştur</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))", gap: 16 }}>
          {surveys.map((survey: any) => (
            <div key={survey.id} style={{ padding: "22px 24px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, boxShadow: "0 10px 24px rgba(31,90,110,0.07)", transition: "transform 0.22s ease, box-shadow 0.22s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 42px rgba(31,90,110,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 24px rgba(31,90,110,0.07)"; }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8,
                    ...(survey.is_active ? { background: "rgba(79,180,119,0.12)", color: "var(--secondary)" } : { background: "rgba(22,48,64,0.07)", color: "var(--muted)" }) }}>
                    {survey.is_active ? "● Aktif" : "Kapalı"}
                  </span>
                  {survey.ends_at && (
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>Bitiş: {new Date(survey.ends_at).toLocaleDateString("tr-TR")}</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <Link href={`/panel/surveys/${survey.id}`}
                    style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center", transition: "all 0.18s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(108,99,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}>
                    <Edit style={{ width: 15, height: 15 }} />
                  </Link>
                  <Link href={`/panel/surveys/${survey.id}/results`}
                    style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center", transition: "all 0.18s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(27,154,170,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
                    title="Sonuçlar">
                    <BarChart2 style={{ width: 15, height: 15 }} />
                  </Link>
                  <DeleteSurveyButton surveyId={survey.id} />
                </div>
              </div>

              <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>{survey.title}</h3>
              {survey.description && (
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{survey.description}</p>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 12, borderTop: "1px solid rgba(22,48,64,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
                  <ClipboardList style={{ width: 15, height: 15, color: "var(--primary)" }} />
                  <span style={{ fontWeight: 700, color: "var(--text)" }}>{(survey.questions || []).length}</span> soru
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
                  <Users style={{ width: 15, height: 15, color: "var(--secondary)" }} />
                  <span style={{ fontWeight: 700, color: "var(--text)" }}>{survey.responseCount}</span> yanıt
                </div>
                <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>{formatDate(survey.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
