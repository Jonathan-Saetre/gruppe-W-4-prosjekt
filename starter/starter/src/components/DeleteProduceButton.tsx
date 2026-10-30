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
    <section className="mx-auto mt-8 w-full max-w-lg border-t border-slate-100 pt-6">
      {error && (
        <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {busy ? "Sletter …" : "Slett innlegg"}
      </button>
    </section>
  );
}