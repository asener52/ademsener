import { query } from "@/lib/db";
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { SurveyCards } from "@/components/admin/survey-cards";

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
        <Link href="/yonetim/surveys/new"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 16, fontSize: 14, fontWeight: 800, textDecoration: "none", color: "#fff", background: "linear-gradient(135deg,var(--primary),var(--secondary))", boxShadow: "0 10px 24px rgba(27,154,170,0.28)" }}>
          <Plus style={{ width: 16, height: 16 }} /> Yeni Anket
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, boxShadow: "0 12px 28px rgba(31,90,110,0.08)" }}>
          <ClipboardList style={{ width: 48, height: 48, color: "rgba(22,48,64,0.12)", margin: "0 auto 14px" }} />
          <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Henüz anket yok</p>
          <Link href="/yonetim/surveys/new" style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>+ İlk anketi oluştur</Link>
        </div>
      ) : (
        <SurveyCards surveys={surveys} />
      )}
    </div>
  );
}
