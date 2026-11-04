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
import { ProduceListParams } from "./utils/validate-list-params";
import { ResultParams } from "./Result";
import { env } from "cloudflare:workers";
import { Result } from "./Result";
// Kontrakten for repository. Servicen er bare avhengig av dette
// interfacet, ikke av hvordan databasen faktisk er satt opp.
export interface ProduceRepository {
    findMany(params: ProduceListParams): Promise<ResultParams>;
    findById(id: string): Promise<Produce | null>;
    create(data: CreateProduce): Promise<Produce>;
    update(id: string, data: UpdateProduce): Promise<Produce | null>;
    remove(id: string): Promise<void>;
    uploadR2(key: string, file: File): Promise<Result>;
    getR2(key: string): Promise<Result>;
    deleteR2(key: string): Promise<Result>;
}
// Databasen sendes inn som parameter (dependency injection), så testene
// kan bruke en egen database i minnet i stedet for D1.
// Derfor bruker vi alltid _db her inne, aldri den globale db.
export function createProduceRepository(_db: DB): ProduceRepository {
    return {
        async findMany({pickedUp, limit, q, category}) {
            try{
                const rows = await _db.query.produce.findMany({
                    where: {
                        pickedUp,
                        category,

                        OR: q ? [
                            {title: {like: `%${q}%`}},
                            {category: {like: `%${q}%`}},
                            {pickupLocation: {like: `%${q}%`}}
                        ]
                        : undefined
                    }, 
                    orderBy: {createdAt: "desc"},
                    limit,
                });
                return{
                    ok: true,
                    data: rows,
                } 
                 }catch(error){
                    console.error(error)
                    return{
                    ok: false,
                    error: {
                        code: "500",
                        message: "Noe gikk galt med uthenting",
                        fieldErrors: {},
                    },
                };
            }
            //return await _db.select().from(produce).orderBy(desc(produce.createdAt))
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

        //En funksjon som setter opp bildet i R2
        async uploadR2(key: string, file: File){
        //put lagerer bildet i R2
        //file.stream sender filinnholdet til R2
        try{
            const object = await env.R2.put(key, file.stream(), {
            httpMetadata: {
            //forteller R2 hvilken type fil det er
            contentType: file.type,
         }},
        )
        
            if(object === null){
            return {
            ok: false,
            error: {
                     code: 412,
                     message: "Precondition failed or upload returnerd null",
                    }
                }
            }
            return {
                    ok: true,
                    data: object,
                }
            }catch(error){
                return {
                    ok: false,
                    error: {
                        code: 500,
                        message: `Upload faile: ${error}`
                    }
            }
        }
    },

    async getR2(key: string){
        try{
            const object = await env.R2.get(key);

            if(!object){
                return{
                    ok: false,
                    error: {
                        code: 404,
                        message: "Bildet ble ikke funnet"
                    }
                }
            }
            return{
                ok: true,
                data: object,
            }
        }catch(error){
            return{
                ok: false,
                error: {
                    code: 500,
                    message: `Kunne ikke hente bildet: ${error}`,
                }
            }
        }
    },
    async deleteR2(key: string){
        try{
            const object = await env.R2.delete(key);
            return{
                ok: true,
                data: null,
            }
        }catch(error){
            return{
            ok: false,
            error: {
                code: 400,
                message: `Kunne ikke slette bildet: ${error}`,
            }
            }
        }
    }
  }
}

export const produceRepository = createProduceRepository(db);