"use client";

import { useState } from "react";
import { logoutAction } from "@/lib/auth-actions";

export function LogoutButton({ className }: { className?: string }) {
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    await logoutAction();
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className={className ?? "text-xs font-semibold text-rose-600 hover:underline disabled:opacity-60"}
    >
      {busy ? "Logger ut …" : "Logg ut"}
    </button>
  );
}