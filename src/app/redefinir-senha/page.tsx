import type { Metadata } from "next";

import { requireAuthenticatedUser } from "@/auth/guards";
import { AuthShell } from "@/components/auth/auth-shell";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Definir nova senha",
};

export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage() {
  await requireAuthenticatedUser();

  return (
    <AuthShell
      description="Defina a nova credencial para sua conta."
      title="Nova senha"
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
