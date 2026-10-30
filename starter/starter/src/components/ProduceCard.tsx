import type { Produce } from "@/db/schema";

export function ProduceCard({ produce }: { produce: Produce }) {
  const { id, imageKey, title, category, amount, unit, pickupLocation, pickupDeadline, pickedUp } = produce;

  return (
    <article className="overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <figure className="relative h-44 w-full bg-slate-100">
        <img
          src={imageKey || "https://placehold.co/400"}
          alt={title}
          className="h-full w-full object-cover"
        />
        <figcaption className="absolute top-3 left-3 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800 backdrop-blur-sm">
          {category}
        </figcaption>
      </figure>

      <section className="p-5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-emerald-700">
          {amount} {unit}
          {pickedUp && <span className="ml-2 text-xs font-normal text-slate-500">(Hentet)</span>}
        </p>
        <p className="mt-3 flex items-center gap-1 text-xs text-slate-500">
          📍 <span>{pickupLocation}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">Kan hentes til {pickupDeadline.toISOString().slice(0, 10)}</p>
        <a
          href={`/produce/${id}`}
          className="mt-2 inline-block rounded-md bg-[#C0392B] px-4 py-2 text-[#FCF8E8]"
        >
          Se annonse
        </a>
      </section>
    </article>
  );
}