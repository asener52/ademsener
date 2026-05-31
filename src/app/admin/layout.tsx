export const dynamic = "force-dynamic";

import { getSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminPageWrapper } from "@/components/admin/page-wrapper";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) return <>{children}</>;

  return (
    <div className="admin-app">
      <AdminSidebar />
      <main className="admin-main">
        <AdminPageWrapper>{children}</AdminPageWrapper>
      </main>
    </div>
  );
}
