import type {Produce} from "@/db/schema";

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
};