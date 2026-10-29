import { Produce } from "@/db/schema";
import { ProduceCard } from "./ProduceCard";

export function ProduceList({produce}: {produce: Produce[]}){
    return(
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {produce.map(produce => (
                <ProduceCard key={produce.id} produce={produce}/>
            ))}
        </section>
    )
}