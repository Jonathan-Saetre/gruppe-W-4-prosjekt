import { Produce } from "@/db/schema";

export type ResultParams = {
    ok: true,
    data: Produce[];
} | {
    ok: false;
    error: {
        code: string;
        message: string;
        fieldErrors: Record<string, string[]>
    }
}