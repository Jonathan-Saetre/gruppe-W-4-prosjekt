"use client";

import { useState, useTransition } from "react";
import { togglePickedUpAction } from "@/features/produce/produce-actions";

export function PickedUpButton({ id, pickedUp }: { id: string; pickedUp: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await togglePickedUpAction({ id, pickedUp: !pickedUp });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      window.location.reload();
    });
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-md bg-[#6B8E23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#405516] disabled:opacity-60"
      >
        {isPending ? "Lagrer…" : pickedUp ? "Marker som tilgjengelig" : "Marker som hentet"}
      </button>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}