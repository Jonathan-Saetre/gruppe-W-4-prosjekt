import type { Produce } from "@/db/schema";

export function ProduceCard({ produce }: { produce: Produce }) {
  const { id, imageKey, title, category, amount, unit, pickupLocation, pickupDeadline, pickedUp } = produce;

  return (
    <a href={`/produce/${id}`} className="block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-md border border-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md bg-[#C0392B]/95 hover:bg-[#C0392B]/35">
        
        <figure className="relative h-44 w-full shrink-0 bg-slate-100">
          <img
            src={imageKey || "https://placehold.co/400"}
            alt={title}
            className="h-full w-full object-cover"
          />
          
          <figcaption className="absolute bottom-3 left-3 inline-block rounded-md bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800 backdrop-blur-sm shadow-sm">
            {category}
          </figcaption>
        </figure>

        <section className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-bold text-[#FCF8E8]">{title}</h3>
          <p className="mt-2 flex items-center gap-1 text-sm font-extrabold text-[#FCF8E8]">
            {amount} {unit}
            {pickedUp && <span className="ml-2 text-sm font-extrabold text-[#FCF8E8]">(Hentet)</span>}
          </p>
          <p className="mt-3 flex items-center gap-1 text-sm text-[#FCF8E8]">
            <span className="text-lg">🗺️</span> <span>{pickupLocation}</span>
          </p>
          <p className="mt-1 text-xs text-[#FCF8E8] font-semibold">
            Kan hentes til {pickupDeadline.toISOString().slice(0, 10)}
          </p>
        </section>

      </article>
    </a>
  );
}