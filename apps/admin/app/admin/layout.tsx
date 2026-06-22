import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminApp } from "@/components/admin-app";
import { AdminProvider } from "@/components/admin-provider";

export const metadata: Metadata = {
  title: "C3 Admin",
  description: "Panel interno de C3 para administrar eventos.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AdminProvider>
      <AdminApp>{children}</AdminApp>
    </AdminProvider>
  );
}
