"use client";

import type { ReactNode } from "react";
import { FiAlertCircle, FiLogIn } from "react-icons/fi";
import { Button, Card } from "@c3/ui";
import { useAdminData } from "./admin-provider";
import { AdminShell } from "./admin-shell";
import { InlineFeedback, LoadingSkeleton } from "./admin-primitives";

function CenteredScreen({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center px-4 py-10">{children}</div>;
}

export function AdminApp({ children }: { children: ReactNode }) {
  const { firebaseReady, authState, feedback, session, signIn, signOut } = useAdminData();

  if (!firebaseReady || authState === "config-missing") {
    return (
      <CenteredScreen>
        <Card className="w-full max-w-md space-y-3 p-6">
          <div className="flex items-center gap-2 text-danger">
            <FiAlertCircle aria-hidden="true" />
            <h1 className="text-base font-semibold text-ink">Falta configurar Firebase</h1>
          </div>
          <p className="text-sm text-muted">
            Completa las variables <code>NEXT_PUBLIC_FIREBASE_*</code> de <code>apps/admin/.env.example</code> y
            vuelve a intentar.
          </p>
        </Card>
      </CenteredScreen>
    );
  }

  if (authState === "loading") {
    return (
      <CenteredScreen>
        <Card className="w-full max-w-sm space-y-3 p-6">
          <LoadingSkeleton className="h-5 w-40" />
          <LoadingSkeleton className="h-4 w-full" />
        </Card>
      </CenteredScreen>
    );
  }

  if (authState === "unauthenticated" || !session) {
    return (
      <CenteredScreen>
        <Card className="w-full max-w-sm space-y-6 p-8">
          <div className="space-y-1.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
              C3
            </span>
            <h1 className="pt-3 text-xl font-semibold text-ink">Panel administrativo</h1>
            <p className="text-sm text-muted">Inicia sesión con tu cuenta de Google autorizada.</p>
          </div>

          <InlineFeedback feedback={feedback} />

          <Button onClick={signIn} className="w-full">
            <FiLogIn aria-hidden="true" />
            Iniciar sesión con Google
          </Button>
        </Card>
      </CenteredScreen>
    );
  }

  return (
    <AdminShell session={session} onSignOut={signOut}>
      {feedback.kind !== "idle" && feedback.text ? (
        <div className="px-4 pt-6 sm:px-6 lg:px-8">
          <InlineFeedback feedback={feedback} />
        </div>
      ) : null}
      {children}
    </AdminShell>
  );
}
