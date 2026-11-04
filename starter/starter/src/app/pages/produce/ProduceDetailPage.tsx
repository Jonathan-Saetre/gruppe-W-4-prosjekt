import type { RequestInfo } from "rwsdk/worker";
import { produceService } from "@/features/produce/produce-service";
import { PickedUpButton } from "@/components/PickedUpButton";

export default async function ProduceDetail({ params, ctx }: RequestInfo) {
  const result = await produceService.find(params.id);

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-[#FCF8E8]">
        <div className="mx-auto max-w-2xl p-8">
          <p className="text-[#C0392B]">{result.error.message}</p>
          <a href="/" className="mt-4 inline-block text-sm text-[#6B8E23] hover:underline">
            ← Tilbake til oversikten
          </a>
        </div>
      </main>
    );
  }

  const p = result.data;
  const isOwner = ctx.user?.id === p.userId;
  const deadline = p.pickupDeadline.slice(0, 10);

  return (
    <main className="min-h-screen bg-[#FCF8E8]">
      <div className="mx-auto max-w-2xl p-8 font-sans">
        <a href="/" className="text-sm font-medium text-[#6B8E23] hover:underline">
          ← Tilbake
        </a>

      <article className="mt-4 overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm">
        <figure className="h-64 w-full bg-slate-100">
          <img
            src={p.imageKey ? `/media/${p.imageKey}` : "/placeholder.png"}
            alt={p.title}
            className="h-full w-full object-cover"
          />
        </figure>

          <section className="space-y-3 p-6">
            <header className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-[#405516]">{p.title}</h1>
              <span className="rounded-md bg-[#6B8E23]/15 px-3 py-1 text-xs font-semibold text-[#405516]">
                {p.category}
              </span>
            </header>

            {p.pickedUp && (
              <p className="rounded-md bg-[#C0392B]/10 p-3 text-sm text-[#C0392B]">
                Alt er hentet. Dette innlegget er ikke lenger tilgjengelig.
              </p>
            )}

            {p.description && <p className="text-slate-700">{p.description}</p>}

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="font-medium text-slate-600">Mengde</dt>
              <dd className="text-slate-800">
                {p.amount} {p.unit}
              </dd>
              <dt className="font-medium text-slate-600">Hentested</dt>
              <dd className="text-slate-800">📍 {p.pickupLocation}</dd>
              <dt className="font-medium text-slate-600">Kan hentes til</dt>
              <dd className="text-slate-800">{deadline}</dd>
              <dt className="font-medium text-slate-600">Kontakt</dt>
              <dd className="text-slate-800">{p.contactInfo}</dd>
            </dl>

            {isOwner && (
             <div className="flex flex-wrap items-start gap-3">
              <a
                href={`/profile/${p.id}`}
                className="mt-2 inline-block rounded-md bg-[#6B8E23] px-4 py-2 text-sm font-semibold text-[#FCF8E8] shadow-sm transition hover:bg-[#405516]"
              >
                Rediger eller slett    
              </a>
              <PickedUpButton id={p.id} pickedUp={p.pickedUp} />
              </div> 
            )}
          </section>
        </article>
      </div>
    </main>
  );
}