import type { RequestInfo } from "rwsdk/worker";
import { produceService } from "@/features/produce/produce-service";

export default async function ProduceDetail({ params, ctx }: RequestInfo) {
  const result = await produceService.find(params.id);

  if (!result.ok) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <p className="text-slate-700">{result.error.message}</p>
        <a href="/" className="mt-4 inline-block text-sm text-emerald-700 hover:underline">
          Tilbake til oversikten
        </a>
      </main>
    );
  }

  const p = result.data;
  const isOwner = ctx.user?.id === p.userId;
  const deadline = p.pickupDeadline.slice(0, 10);

  return (
    <main className="mx-auto max-w-2xl p-8 font-sans">
      <a href="/" className="text-sm text-emerald-700 hover:underline">← Tilbake</a>

      <article className="mt-4 overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm">
        <figure className="h-64 w-full bg-slate-100">
          <img
            src={p.imageKey || "https://placehold.co/800x400"}
            alt={p.title}
            className="h-full w-full object-cover"
          />
        </figure>

        <section className="space-y-3 p-6">
          <header className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-900">{p.title}</h1>
            <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              {p.category}
            </span>
          </header>

          {p.pickedUp && (
            <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
              Alt er hentet. Dette innlegget er ikke lenger tilgjengelig.
            </p>
          )}

          {p.description && <p className="text-slate-700">{p.description}</p>}

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="font-medium text-slate-600">Mengde</dt>
            <dd>{p.amount} {p.unit}</dd>
            <dt className="font-medium text-slate-600">Hentested</dt>
            <dd>📍 {p.pickupLocation}</dd>
            <dt className="font-medium text-slate-600">Kan hentes til</dt>
            <dd>{deadline}</dd>
          </dl>

          {isOwner && (
            <a
              href={`/profile/${p.id}`}
              className="mt-2 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Rediger eller slett
            </a>
          )}
        </section>
      </article>
    </main>
  );
}