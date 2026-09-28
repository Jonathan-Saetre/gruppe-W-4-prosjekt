interface ListingCardProps {
  title: string;
  category: string;
  price: number;
  location: string;
  imageUrl?: string;
}

export function ListingCard({
  title,
  category,
  price,
  location,
  imageUrl,
}: ListingCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <figure className="relative h-44 w-full bg-slate-100">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80"}
          alt={title}
          className="h-full w-full object-cover"
        />
        <figcaption className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800 backdrop-blur-sm">
          {category}
        </figcaption>
      </figure>

      <section className="p-5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-base font-semibold">
          {price === 0 ? (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              🌱 Gratis selvplukk
            </span>
          ) : (
            <span className="text-slate-800">{price} kr / pose</span>
          )}
        </p>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
          📍 <span>{location}</span>
        </p>
      </section>
    </article>
  );
}