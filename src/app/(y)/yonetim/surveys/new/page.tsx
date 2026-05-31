import { SurveyEditor } from "@/components/admin/survey-editor";

export default function NewSurveyPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Yeni Anket</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>Sorular ve seçenekleri yapılandırın</p>
      </div>
      <SurveyEditor />
    </div>
  );
}
