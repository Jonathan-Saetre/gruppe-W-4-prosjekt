"use client";

import { useActionState, useEffect } from "react";
import { registerAction, type AuthState } from "@/lib/auth-actions";

export function Register() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    registerAction,
    null,
  );

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      window.location.href = "/";
    }
  }, [state]);

  return (
    <main className="mx-auto max-w-md p-6 font-sans">
      <a
        href="/"
        className="mb-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Tilbake til markedet
      </a>

      <article className="rounded-md border border-slate-100 bg-white p-8 shadow-sm">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Lag en konto 🍎</h1>
          <p className="mt-2 text-sm text-slate-600">
            Bli med og del overskuddet fra hagen din med naboene.
          </p>
        </header>

        <form action={formAction} className="mt-6 space-y-4">
          <p>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Navn
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Ola Nordmann"
              className="mt-1 w-full rounded-md border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </p>

          <p>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-post
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </p>

          <p>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Passord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </p>

          {state && "error" in state && (
            <p className="text-sm text-rose-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {pending ? "Oppretter…" : "Opprett konto"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Har du konto?{" "}
            <a href="/login" className="font-medium text-emerald-600 hover:underline">
              Logg inn
            </a>
          </p>
        </form>
      </article>
    </main>
  );
}