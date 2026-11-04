"use client";
import { AuthState, logoutAction } from "@/lib/auth-actions";
import { useActionState, useEffect } from "react";

interface Props {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function ProfileClient({ user }: Props) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    logoutAction,
    null,
  );

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      window.location.href = "/";
    }
  }, [state]);

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between flex-wrap gap-3">
        <h2 className="text-xl font-extrabold tracking-tight text-[#405516]">
          Brukerinformasjon:
        </h2>
        <nav className="flex items-center gap-4">
          <a href="/" className="text-sm text-[#6B8E23] hover:underline">
            ← Til forsiden
          </a>
          <form action={formAction}>
            <button
              disabled={pending}
              className="rounded-md bg-[#C0392B] px-3 py-1.5 text-sm font-semibold text-[#FCF8E8] transition hover:bg-[#C0392B]/80 disabled:opacity-60"
              type="submit"
            >
              {pending ? "Logger ut..." : "Logg ut"}
            </button>
          </form>
        </nav>
      </div>

      <div className="grid gap-1 text-sm text-slate-700">
        <p>
          <span className="font-bold text-slate-900">Navn: </span>
          {user.name}
        </p>
        <p>
          <span className="font-bold text-slate-900">E-post: </span>
          {user.email}
        </p>
      </div>

      {state && "error" in state && (
        <p className="rounded-md bg-[#C0392B]/10 p-2 text-sm text-[#C0392B]">
          {state.error}
        </p>
      )}
    </section>
  );
}