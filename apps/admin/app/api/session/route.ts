import { NextResponse } from "next/server";
import { HttpError, verifyAdminRequest } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const decoded = await verifyAdminRequest(request);

    return NextResponse.json({
      ok: true,
      user: {
        email: decoded.email,
        name: decoded.name || decoded.email || "",
        picture: decoded.picture || "",
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    console.error("Session verification failed:", error);
    return NextResponse.json({ ok: false, message: "Unable to verify admin session." }, { status: 500 });
  }
}
