import { EventEditor } from "@/components/admin/event-editor";

export default function NewEventPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Yeni Etkinlik</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>Etkinlik bilgilerini doldurun</p>
      </div>
      <EventEditor />
    </div>
  );
}
