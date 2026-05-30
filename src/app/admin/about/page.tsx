import { createClient } from "@/lib/supabase/server";
import { AboutEditor } from "@/components/admin/about-editor";

export default async function AdminAboutPage() {
  const supabase = await createClient();
  const { data: about } = await supabase.from("about_info").select("*").limit(1).single();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Hakkımda Düzenle</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>Kişisel bilgilerinizi güncelleyin</p>
      </div>
      <AboutEditor about={about} />
    </div>
  );
}
