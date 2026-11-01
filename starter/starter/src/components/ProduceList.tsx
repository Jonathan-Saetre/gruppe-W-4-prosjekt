import { Produce } from "@/db/schema";
import { ProduceCard } from "./ProduceCard";

export function ProduceList({ produce }: { produce: Produce[] }) {
  if (!produce || produce.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#6B8E23]/30 bg-white/50 p-12 text-center">
        <span className="text-4xl">🍂</span>
        <h3 className="mt-4 text-lg font-bold text-[#405516]">Ingen råvarer akkurat nå</h3>
        <p className="mt-1 text-sm text-slate-600">
          Det er tomt i nabolaget foreløpig. Kom tilbake senere, eller del noe selv!
        </p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {produce.map((p) => (
        <ProduceCard key={p.id} produce={p} />
      ))}
    </section>
  );
}