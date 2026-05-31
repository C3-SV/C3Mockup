import { NextResponse } from "next/server";
import {
  HttpError,
  createAdminEvent,
  listAdminEvents,
  verifyAdminRequest,
} from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    await verifyAdminRequest(request);
    const events = await listAdminEvents();
    return NextResponse.json({ ok: true, events });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    console.error("Unable to list events:", error);
    return NextResponse.json({ ok: false, message: "Unable to load events." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await verifyAdminRequest(request);
    const body = await request.json().catch(() => null);
    const event = await createAdminEvent(body);

    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    console.error("Unable to create event:", error);
    return NextResponse.json({ ok: false, message: "Unable to create event." }, { status: 500 });
  }
}
