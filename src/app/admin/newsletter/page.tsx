import { createClient } from "@/lib/supabase/server";
import { Mail, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function NewsletterPage() {
  const supabase = await createClient();
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Bülten Aboneleri</h1>
        <p className="text-slate-400 text-sm mt-1">{count} abone</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-white">{count}</p>
          <p className="text-sm text-slate-400">Toplam Abone</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider grid grid-cols-3">
          <span>E-posta</span>
          <span>Tarih</span>
          <span></span>
        </div>
        <div className="divide-y divide-slate-800">
          {subscribers?.map((sub) => (
            <div key={sub.id} className="px-5 py-3 grid grid-cols-3 items-center hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-300">{sub.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(sub.created_at)}
              </div>
              <div></div>
            </div>
          ))}
          {(!subscribers || subscribers.length === 0) && (
            <div className="text-center py-12">
              <Mail className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Henüz abone yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
