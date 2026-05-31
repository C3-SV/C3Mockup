import type { Metadata } from "next";
import { PageShell } from "@c3/ui";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "C3 Admin",
  description: "Panel interno de C3 para administrar eventos.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminHomePage() {
  return (
    <PageShell className="bg-[#F4F7FB] text-[#0F203E]">
      <AdminDashboard />
    </PageShell>
  );
}
