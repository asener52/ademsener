import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EventEditor } from "@/components/admin/event-editor";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();
  if (!event) notFound();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Etkinliği Düzenle</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>{event.title}</p>
      </div>
      <EventEditor event={event} />
    </div>
  );
}
