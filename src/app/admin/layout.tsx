import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0fdf9 0%,#eff6ff 100%)" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f8fafc" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
