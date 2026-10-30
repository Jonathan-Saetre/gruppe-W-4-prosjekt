import type { RequestInfo } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { desc, eq } from "drizzle-orm";
import { produce } from "@/db/schema";
import { LogoutButton } from "@/components/LogoutButton";

export default async function Profile({ ctx }: RequestInfo) {
  const user = ctx.user;

  if (!user) {
    return new Response(null, { status: 302, headers: { Location: "/login" } });
  }

  // Midlertidig spørring her. Når vi vet hvordan repositoryet ser ut,
  // flyttes den til en findByUserId-metode der.
  const db = drizzle(env.DB);
  const myPosts = await db
    .select()
    .from(produce)
    .where(eq(produce.userId, user.id))
    .orderBy(desc(produce.createdAt));

  return (
    <main className="mx-auto max-w-4xl p-8 font-sans">
      <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">
        <section>
          <h1 className="text-2xl font-bold text-slate-900">Profil</h1>
          <p className="mt-1 text-sm text-slate-600">{user.name} · {user.email}</p>
        </section>
        <nav className="flex items-center gap-4">
          <a href="/" className="text-sm text-emerald-700 hover:underline">Forsiden</a>
          <LogoutButton />
        </nav>
      </header>

      <section>
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Mine innlegg</h2>
          <a
            href="/produce/new"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + Del fra hagen
          </a>
        </header>

        {myPosts.length === 0 ? (
          <p className="text-sm text-slate-600">
            Du har ikke lagt ut noe ennå. Del det du har for mye av i hagen.
          </p>
        ) : (
          <ul className="space-y-3">
            {myPosts.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-md border border-slate-100 bg-white p-4 shadow-sm"
              >
                <article>
                  <h3 className="font-semibold text-slate-900">{p.title}</h3>
                  <p className="text-sm text-slate-600">
                    {p.amount} {p.unit} · {p.pickupLocation}
                    {p.pickedUp && " · Hentet"}
                  </p>
                </article>
                <nav className="flex gap-3 text-sm">
                  <a href={`/produce/${p.id}`} className="text-slate-600 hover:underline">Se</a>
                  <a href={`/profile/${p.id}`} className="font-semibold text-emerald-700 hover:underline">
                    Rediger
                  </a>
                </nav>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}