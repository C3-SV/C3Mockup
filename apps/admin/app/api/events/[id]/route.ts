import { NextResponse } from "next/server";
import { deleteAdminEvent, HttpError, updateAdminEvent, verifyAdminRequest } from "@/lib/firebase-admin";

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

    return NextResponse.json({ ok: true, event });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    console.error("Unable to update event:", error);
    return NextResponse.json({ ok: false, message: "Unable to update event." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(request);
    const { id } = await context.params;
    await deleteAdminEvent(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    console.error("Unable to delete event:", error);
    return NextResponse.json({ ok: false, message: "Unable to delete event." }, { status: 500 });
  }
}
