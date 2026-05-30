import { createClient } from "@/lib/supabase/server";
import { AboutEditor } from "@/components/admin/about-editor";

export default async function AdminAboutPage() {
  const supabase = await createClient();
  const { data: about } = await supabase.from("about_info").select("*").limit(1).single();

  return (
    <div style={{ padding: 48 }}>
      <div className="kicker">👤 Profil</div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text)" }}>Hakkımda Düzenle</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>Kişisel bilgilerinizi güncelleyin</p>
      </div>
      <AboutEditor about={about} />
    </div>
  );
}
