"use client";

import { useState } from "react";

interface LoginProps {
  onLogin: (username: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6 font-sans">
      <article className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Velkommen tilbake 🍎</h1>
          <p className="mt-2 text-sm text-slate-600">
            Logg inn for å dele overskudd fra hagen din eller avtale plukking med naboer.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <p>
            <label className="block text-sm font-medium text-slate-700">Brukernavn eller e-post</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ola Nordmann"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </p>

          <p>
            <label className="block text-sm font-medium text-slate-700">Passord</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </p>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Logg inn
          </button>
        </form>
      </article>
    </main>
  );
}