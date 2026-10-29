// Repository: det eneste laget som snakker med databasen (Drizzle + D1).
// Her er det ingen validering eller forretningsregler, bare spørringer.
// Feil fra databasen kastes videre og håndteres i servicen.

import { eq, desc } from "drizzle-orm";
import { db, type DB } from "@/db";
import {
    produce,
    type Produce,
    type CreateProduce,
    type UpdateProduce,
} from "@/db/schema";

// Kontrakten for repository. Servicen er bare avhengig av dette
// interfacet, ikke av hvordan databasen faktisk er satt opp.
export interface ProduceRepository {
    findMany(): Promise<Produce[]>;
    findById(id: string): Promise<Produce | null>;
    create(data: CreateProduce): Promise<Produce>;
    update(id: string, data: UpdateProduce): Promise<Produce | null>;
    remove(id: string): Promise<void>;
}
// Databasen sendes inn som parameter (dependency injection), så testene
// kan bruke en egen database i minnet i stedet for D1.
// Derfor bruker vi alltid _db her inne, aldri den globale db.
export function createProduceRepository(_db: DB): ProduceRepository {
    return {
        async findMany() {

            return await _db.select().from(produce).orderBy(desc(produce.createdAt))
        },


        async findById(id) {

            const [row] = await _db.select().from(produce).where(eq(produce.id, id))
            // Spørringen gir en liste. Er den tom, er row undefined, og vi gjør det om til null.
            return row ?? null;
        },

        async create(data) {
            const [row] = await _db.insert(produce).values(data).returning();
            return row;
        },

        async update(id, data) {
            const [row] = await _db.update(produce).set(data).where(eq(produce.id, id)).returning()

            return row ?? null;
        },

        async remove(id) {
            await _db.delete(produce).where(eq(produce.id, id));
        },

    };
}

export const produceRepository = createProduceRepository(db);