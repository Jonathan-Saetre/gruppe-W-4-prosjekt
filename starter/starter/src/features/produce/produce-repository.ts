import { eq, desc } from "drizzle-orm";
import { db, type DB } from "@/db";
import {
    produce, 
    type Produce,
    type CreateProduce,
    type UpdateProduce,
} from "@/db/schema";



export interface ProduceRepository {
    findMany(): Promise<Produce[]>;
    findById(id: string): Promise<Produce | null>;
    create(data: CreateProduce): Promise<Produce>;
    update(id: string, data: UpdateProduce): Promise<Produce | null>;
    remove(id: string): Promise<void>;
}

export function createProduceRepository(_db: DB): ProduceRepository {
    return {
        async findMany() {
            
            return await _db.select().from(produce).orderBy(desc(produce.createdAt))
        },

        
        async findById(id) {
 
                const [row] = await _db.select().from(produce).where(eq(produce.id, id))
        
            return  row ?? null;
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