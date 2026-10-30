import Search from "@/components/SearchBar";
import { ProduceList } from "@/components/ProduceList";
import { requestInfo } from "rwsdk/worker";
import { parseParams } from "@/features/produce/utils/parse-params";
import { produceService } from "@/features/produce/produce-service";
import { logoutAction } from "@/lib/auth-actions";

export async function Home() {
  const { ctx, request } = requestInfo;
  const user = ctx.user;

  const params = parseParams(request);
  const result = await produceService.list(params);

  if (!result.ok) {
    return (
      <p>Klarte ikke å hente inn råvarer: {result.error.message}</p>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-8 font-sans">
      <header className="mb-10 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <section>
          <Search />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Nabo Hagen 🍎
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Redd råvarer fra å gå til spille! Finn gratis frukt og grønt fra hager nær deg.
          </p>
        </section>

        <nav>
          {user ? (
            <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2">
              <span className="text-sm font-medium text-slate-700">
                Hei, {user.name}!
              </span>
              <a href="/profile" aria-label="Sender deg til profilen siden din">
                👤
              </a>
              <form action={logoutAction}>
                <button className="text-xs font-semibold text-rose-600 hover:underline">
                  Logg ut
                </button>
              </form>
            </div>
          ) : (
            <a
              href="/login"
              className="rounded-md border bg-[#6B8E23] border-slate-300 px-5 py-2 text-sm font-medium text-[#FCF8E8] transition hover:bg-[#405516]"
            >
              Logg inn
            </a>
          )}
        </nav>
      </header>

      <section>
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Aktuelt i nærområdet</h2>

          {user && (
            <a
              href="/produce/new"
              className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + Del fra hagen
            </a>
          )}
        </header>
        <ProduceList produce={result.data} />
      </section>
    </main>
  );
}