import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SurveyEditor } from "@/components/admin/survey-editor";

export default async function EditSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: survey } = await supabase.from("surveys").select("*").eq("id", id).single();
  if (!survey) notFound();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Anketi Düzenle</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>{survey.title}</p>
      </div>
      <SurveyEditor survey={survey} />
    </div>
  );
}
