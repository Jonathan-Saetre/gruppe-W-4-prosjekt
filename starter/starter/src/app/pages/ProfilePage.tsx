import { requestInfo } from "rwsdk/worker";
import ProduceEdit from "./produce/ProduceEditPage";
import ProfileClient from "./ProfileClinet";
import { drizzle } from "drizzle-orm/d1";
import { produce } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";

export default async function Profile() {
  const { ctx, request } = requestInfo;

  const user = ctx.user;
  if (!user) {
    return (
      <main className="min-h-screen bg-[#FCF8E8]">
        <div className="mx-auto max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-[#405516]">Du er ikke logget inn</h1>
          <p className="mt-2 text-sm text-slate-600">
            Du må logge deg inn for å se profilen din.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block rounded-md bg-[#6B8E23] px-5 py-2 text-sm font-medium text-[#FCF8E8] transition hover:bg-[#405516]"
          >
            Logg inn
          </a>
        </div>
      </main>
    );
  }

  const db = drizzle(env.DB);
  const myPosts = await db
    .select()
    .from(produce)
    .where(eq(produce.userId, user.id))
    .orderBy(desc(produce.createdAt));

  return (
    <main className="min-h-screen bg-[#FCF8E8]">
      <div className="mx-auto max-w-4xl p-8 font-sans">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#405516] text-center mb-5">
          Din profil 👤
        </h1>
        <ProfileClient user={user} />

        <section className="mt-8">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight text-[#405516]">
              Mine innlegg:
            </h2>
            <a
              href="/produce/new"
              className="rounded-md bg-[#6B8E23] px-4 py-2.5 text-sm font-semibold text-[#FCF8E8] shadow-sm transition hover:bg-[#405516]"
            >
              + Del fra hagen
            </a>
          </header>

          {myPosts.length === 0 ? (
            <p className="rounded-md bg-white border border-slate-200 p-4 text-sm text-slate-600">
              Du har ikke lagt ut noe ennå. Del det du har for mye av i hagen.
            </p>
          ) : (
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {myPosts.map((p) => (
                <li key={p.id}>
                  <article className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="font-semibold text-[#405516]">{p.title}</h3>
                    <p className="text-sm text-slate-600">📍 {p.pickupLocation}</p>
                    <nav className="mt-auto flex gap-3 pt-2 text-sm">
                      <a
                        href={`/produce/${p.id}`}
                        className="text-slate-600 hover:underline"
                      >
                        Se annonse
                      </a>
                      <a
                        href={`/profile/${p.id}`}
                        className="font-semibold text-[#6B8E23] hover:underline"
                      >
                        Rediger
                      </a>
                    </nav>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}