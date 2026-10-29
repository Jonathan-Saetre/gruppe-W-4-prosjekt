// Mapper fra en rad i databasen til objektet API-et sender ut (DTO).
// Slik har vi full kontroll på hvilke felt som sendes til klienten.

import type { Produce } from "@/db/schema";

// Datoer er strenger her, fordi JSON ikke har en egen datotype.
export type ProduceDTO = {
    id: string;
    title: string;
    description: string | null;
    category: string;
    pickupLocation: string;
    amount: number;
    pickupDeadline: string;
    pickedUp: boolean;
    unit: "kg" | "stk" | "poser";
    userId: number;
    createdAt: string;
    imageKey: string | null;
};


export function toProduceDTO(row: Produce): ProduceDTO {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        pickupLocation: row.pickupLocation,
        amount: row.amount,
        pickupDeadline: row.pickupDeadline.toISOString(),
        pickedUp: row.pickedUp,
        unit: row.unit,
        userId: row.userId,
        imageKey: row.imageKey,
        createdAt: row.createdAt.toISOString()
    };
}