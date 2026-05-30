import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminPageWrapper } from "@/components/admin/page-wrapper";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="admin-app">
      <AdminSidebar />
      <main className="admin-main">
        <AdminPageWrapper>{children}</AdminPageWrapper>
      </main>
    </div>
  );
}
