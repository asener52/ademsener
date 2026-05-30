import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, ClipboardList, BarChart2, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteSurveyButton } from "@/components/admin/delete-survey-button";

async function getSurveys() {
  const supabase = await createClient();
  const { data: surveys } = await supabase.from("surveys").select("*").order("created_at", { ascending: false });
  const { data: responseCounts } = await supabase.from("survey_responses").select("survey_id");

  const countMap: Record<string, number> = {};
  responseCounts?.forEach(r => { countMap[r.survey_id] = (countMap[r.survey_id] || 0) + 1; });

  return (surveys || []).map(s => ({ ...s, responseCount: countMap[s.id] || 0 }));
}

export default async function SurveysPage() {
  const surveys = await getSurveys();

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Anketler</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>{surveys.length} anket · {surveys.filter(s => s.is_active).length} aktif</p>
        </div>
        <Link href="/admin/surveys/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg,#1b9aaa,#4fb477)", boxShadow: "0 4px 14px rgba(27,154,170,0.28)" }}>
          <Plus className="w-4 h-4" /> Yeni Anket
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
          <ClipboardList className="w-12 h-12 mx-auto mb-3" style={{ color: "#e2e8f0" }} />
          <p className="font-semibold mb-2" style={{ color: "#334155" }}>Henüz anket yok</p>
          <Link href="/admin/surveys/new" className="text-sm font-semibold" style={{ color: "#1b9aaa" }}>
            + İlk anketi oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {surveys.map((survey: any) => (
            <div key={survey.id} className="p-5 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={survey.is_active
                      ? { background: "rgba(79,180,119,0.12)", color: "#4fb477" }
                      : { background: "#f1f5f9", color: "#94a3b8" }}>
                    {survey.is_active ? "● Aktif" : "Kapalı"}
                  </span>
                  {survey.ends_at && (
                    <span className="text-xs" style={{ color: "#94a3b8" }}>
                      Bitiş: {new Date(survey.ends_at).toLocaleDateString("tr-TR")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/surveys/${survey.id}`}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" style={{ color: "#94a3b8" }}>
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Link href={`/admin/surveys/${survey.id}/results`}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" style={{ color: "#94a3b8" }}
                    title="Sonuçlar">
                    <BarChart2 className="w-4 h-4" />
                  </Link>
                  <DeleteSurveyButton surveyId={survey.id} />
                </div>
              </div>

              <h3 className="font-bold text-base mb-1" style={{ color: "#0f172a" }}>{survey.title}</h3>
              {survey.description && (
                <p className="text-sm line-clamp-2 mb-3" style={{ color: "#64748b" }}>{survey.description}</p>
              )}

              <div className="flex items-center gap-4 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                <div className="flex items-center gap-1.5 text-sm" style={{ color: "#64748b" }}>
                  <ClipboardList className="w-4 h-4" style={{ color: "#1b9aaa" }} />
                  <span className="font-semibold">{(survey.questions || []).length}</span> soru
                </div>
                <div className="flex items-center gap-1.5 text-sm" style={{ color: "#64748b" }}>
                  <Users className="w-4 h-4" style={{ color: "#4fb477" }} />
                  <span className="font-semibold">{survey.responseCount}</span> yanıt
                </div>
                <span className="text-xs ml-auto" style={{ color: "#94a3b8" }}>{formatDate(survey.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
