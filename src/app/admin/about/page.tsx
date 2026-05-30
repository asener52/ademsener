import { queryOne } from "@/lib/db";
import { AboutEditor } from "@/components/admin/about-editor";

export default async function AdminAboutPage() {
  const about = await queryOne<any>("SELECT * FROM about_info LIMIT 1");
  if (about) {
    if (about.skills && typeof about.skills === "string") { try { about.skills = JSON.parse(about.skills); } catch { about.skills = []; } }
    if (about.social_links && typeof about.social_links === "string") { try { about.social_links = JSON.parse(about.social_links); } catch { about.social_links = {}; } }
  }

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
