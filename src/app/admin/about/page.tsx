import { createClient } from "@/lib/supabase/server";
import { AboutEditor } from "@/components/admin/about-editor";

export default async function AdminAboutPage() {
  const supabase = await createClient();
  const { data: about } = await supabase.from("about_info").select("*").limit(1).single();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Hakkımda Düzenle</h1>
        <p className="text-slate-400 text-sm mt-1">Kişisel bilgilerinizi güncelleyin</p>
      </div>
      <AboutEditor about={about} />
    </div>
  );
}
