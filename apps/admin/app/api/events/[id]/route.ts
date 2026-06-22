import { NextResponse } from "next/server";
import {
  deleteAdminEvent,
  getAdminEvent,
  HttpError,
  updateAdminEvent,
  verifyAdminRequest,
} from "@/lib/firebase-admin";
import { triggerSiteRevalidation } from "@/lib/revalidate-site";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(request);
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const event = await updateAdminEvent(id, body);
    const revalidation = await triggerSiteRevalidation({
      reason: `Updated event ${id}`,
      source: "admin/api/events/[id]",
    });

    if (!revalidation.ok) {
      console.warn("Site revalidation failed after updating an event:", revalidation.message);
    }

    return NextResponse.json({ ok: true, event, revalidation });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    console.error("Unable to update event:", error);
    return NextResponse.json({ ok: false, message: "Unable to update event." }, { status: 500 });
  }
}

export async function GET(request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(request);
    const { id } = await context.params;
    const event = await getAdminEvent(id);

    if (!event) {
      return NextResponse.json({ ok: false, message: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, event });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    console.error("Unable to load event:", error);
    return NextResponse.json({ ok: false, message: "Unable to load event." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(request);
    const { id } = await context.params;
    await deleteAdminEvent(id);
    const revalidation = await triggerSiteRevalidation({
      reason: `Deleted event ${id}`,
      source: "admin/api/events/[id]",
    });

    if (!revalidation.ok) {
      console.warn("Site revalidation failed after deleting an event:", revalidation.message);
    }

    return NextResponse.json({ ok: true, revalidation });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    console.error("Unable to delete event:", error);
    return NextResponse.json({ ok: false, message: "Unable to delete event." }, { status: 500 });
  }
}
