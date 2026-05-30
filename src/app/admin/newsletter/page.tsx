import { createClient } from "@/lib/supabase/server";
import { Mail, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function NewsletterPage() {
  const supabase = await createClient();
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers").select("*", { count: "exact" }).order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Bülten Aboneleri</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>{count} abone</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(27,154,170,0.10)" }}>
            <Users className="w-5 h-5" style={{ color: "#1b9aaa" }} />
          </div>
          <p className="text-2xl font-black" style={{ color: "#0f172a" }}>{count}</p>
          <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>Toplam Abone</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="grid grid-cols-3 px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ borderBottom: "1px solid #f1f5f9", color: "#94a3b8" }}>
          <span>E-posta</span>
          <span>Tarih</span>
          <span></span>
        </div>
        <div>
          {subscribers?.map((sub) => (
            <div key={sub.id} className="px-5 py-3 grid grid-cols-3 items-center hover:bg-slate-50 transition-colors" style={{ borderBottom: "1px solid #f8fafc" }}>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#94a3b8" }} />
                <span className="text-sm font-medium" style={{ color: "#334155" }}>{sub.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm" style={{ color: "#94a3b8" }}>
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(sub.created_at)}
              </div>
              <div></div>
            </div>
          ))}
          {(!subscribers || subscribers.length === 0) && (
            <div className="text-center py-12">
              <Mail className="w-8 h-8 mx-auto mb-2" style={{ color: "#e2e8f0" }} />
              <p className="text-sm" style={{ color: "#94a3b8" }}>Henüz abone yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
