import { queryOne } from "@/lib/db";
import { notFound } from "next/navigation";
import { EventEditor } from "@/components/admin/event-editor";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await queryOne<any>("SELECT * FROM events WHERE id = ?", [id]);
  if (!event) notFound();

  return (
    <div style={{ padding: 48 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1px", color: "var(--text)" }}>Etkinliği Düzenle</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{event.title}</p>
      </div>
      <EventEditor event={event} />
    </div>
  );
}
