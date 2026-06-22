import { AdminEventEditorPage } from "@/components/admin-event-editor-page";

type RouteParams = Promise<{
  eventId: string;
}>;

export default async function AdminEventRoute({ params }: { params: RouteParams }) {
  const { eventId } = await params;

  return <AdminEventEditorPage mode="edit" eventId={eventId} />;
}
