"use client";

import { useState } from "react";

export function DeleteProduceButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm("Er du sikker på at du vil slette innlegget? Dette kan ikke angres.")) return;

    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/produce/${id}`, { method: "DELETE" });

      if (res.status === 204) {
        window.location.href = "/profile";
        return;
      }
      const json = await res.json().catch(() => null);
      setError(json?.error?.message ?? "Kunne ikke slette innlegget");
    } catch {
      setError("Kunne ikke nå serveren. Prøv igjen.");
    }
    setBusy(false);
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-lg rounded-xl border border-[#C0392B]/20 bg-white p-6 shadow-sm">
      <header className="mb-4">
        <h3 className="text-lg font-bold text-[#C0392B]">Fareområde</h3>
        <p className="mt-1 text-sm text-slate-600">
          Hvis du sletter innlegget, vil det forsvinne permanent fra nabolaget ditt.
        </p>
      </header>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/10 p-3 text-sm font-medium text-[#C0392B]"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="rounded-lg bg-[#C0392B] px-5 py-2.5 text-sm font-semibold text-[#FCF8E8] transition-colors hover:bg-[#C0392B]/80 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/50 focus:ring-offset-2 disabled:opacity-60"
      >
        {busy ? "Sletter …" : "Slett innlegg"}
      </button>
    </section>
  );
}