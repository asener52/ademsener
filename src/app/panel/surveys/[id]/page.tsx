import { queryOne } from "@/lib/db";
import { notFound } from "next/navigation";
import { SurveyEditor } from "@/components/admin/survey-editor";

export default async function EditSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const survey = await queryOne<any>("SELECT * FROM surveys WHERE id = ?", [id]);
  if (!survey) notFound();
  if (survey.questions && typeof survey.questions === "string") {
    try { survey.questions = JSON.parse(survey.questions); } catch { survey.questions = []; }
  }

  return (
    <div style={{ padding: 48 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1px", color: "var(--text)" }}>Anketi Düzenle</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{survey.title}</p>
      </div>
      <SurveyEditor survey={survey} />
    </div>
  );
}
