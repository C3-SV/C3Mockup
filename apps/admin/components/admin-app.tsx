"use client";

import type { ReactNode } from "react";
import { FiArrowRight, FiShield } from "react-icons/fi";
import { Badge, Button, Card } from "@c3/ui";
import { useAdminData } from "./admin-provider";
import { AdminShell } from "./admin-shell";
import { InlineFeedback, LoadingSkeleton } from "./admin-primitives";

export function AdminApp({ children }: { children: ReactNode }) {
  const { firebaseReady, authState, feedback, session, signIn, signOut } = useAdminData();

  if (!firebaseReady || authState === "config-missing") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4 py-10">
        <Card className="max-w-3xl overflow-hidden border-[#d5deea] shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
          <div className="bg-[linear-gradient(135deg,#0f203e_0%,#205298_58%,#33beac_100%)] px-6 py-6 text-white">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              <FiShield />
              C3 Admin
            </div>
            <h1 className="mt-4 text-3xl font-bold">Falta configurar Firebase</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/82">
              El panel está listo, pero necesita las variables `NEXT_PUBLIC_FIREBASE_*` y las credenciales
              del servicio para autenticar con Google y acceder a Firestore.
            </p>
          </div>
          <div className="space-y-4 px-6 py-6">
            <Badge className="w-fit border-[#dce7f4] bg-[#f4f7fb] text-[#205298]">Configuración pendiente</Badge>
            <p className="text-sm leading-7 text-[#364765]">
              Revisa `apps/admin/.env.example` y completa los valores antes de volver a intentar.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (authState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4 py-10">
        <Card className="w-full max-w-xl p-6">
          <div className="grid gap-4">
            <LoadingSkeleton className="h-7 w-40" />
            <LoadingSkeleton className="h-5 w-72" />
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-4 w-5/6" />
          </div>
        </Card>
      </div>
    );
  }

  if (authState === "unauthenticated" || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4 py-10">
        <Card className="grid w-full max-w-5xl overflow-hidden md:grid-cols-[1.08fr_0.92fr]">
          <div className="bg-[linear-gradient(135deg,#0f203e_0%,#17335f_55%,#205298_100%)] p-8 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              <FiShield />
              C3 Admin
            </div>
            <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight">
              Panel privado para administrar eventos de C3
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/82">
              Inicia sesión con Google para gestionar el catálogo de eventos. El acceso se restringe por allowlist
              de correo.
            </p>
            <div className="mt-8">
              <Button
                onClick={signIn}
                className="gap-3 rounded-full bg-[#33beac] px-6 py-3.5 text-[#0f203e] shadow-[0_12px_30px_rgba(51,190,172,0.22)] hover:bg-[#48c6b5]"
              >
                <FiShield />
                Iniciar con Google
              </Button>
            </div>
          </div>

          <div className="space-y-5 p-8">
            <div className="space-y-3">
              <Badge className="w-fit border-[#dce7f4] bg-[#f4f7fb] text-[#205298]">Acceso privado</Badge>
              <h2 className="text-2xl font-bold text-[#0f203e]">Control editorial en C3</h2>
              <p className="text-sm leading-7 text-[#364765]">
                Configura `ADMIN_ALLOWED_EMAILS` con las cuentas que pueden entrar al panel.
              </p>
            </div>

            <InlineFeedback feedback={feedback} />

            <div className="rounded-2xl border border-[#d5deea] bg-[#f8fbfe] p-4 text-sm leading-7 text-[#5c6a82]">
              <p className="font-semibold text-[#0f203e]">Qué conserva este panel</p>
              <p className="mt-2">
                Firebase Auth, Firestore, el CRUD actual y la lógica de destacados siguen funcionando tal como
                estaban, pero ahora dentro de un shell administrativo más ordenado.
              </p>
            </div>

            <Button onClick={signIn} variant="ghost" className="gap-2 rounded-full border border-[#d5deea] bg-white text-[#0f203e]">
              <FiArrowRight />
              Volver a intentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <AdminShell session={session} onSignOut={signOut}>
      <div className="grid gap-4">
        {feedback.kind !== "idle" && feedback.text ? (
          <div className="px-4 pt-4 sm:px-6 lg:px-8">
            <InlineFeedback feedback={feedback} />
          </div>
        ) : null}
        {children}
      </div>
    </AdminShell>
  );
}
