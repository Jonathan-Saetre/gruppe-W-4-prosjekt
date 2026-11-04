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

export type ResultId = {
    ok: true,
    data: Produce;
} | {
    ok: false;
    error: {
        code: string;
        message: string;
        fieldErrors: Record<string, string[]>
    }
}

export type Result = {
    ok: true,
    data: any,
} | {
    ok: false,
    error: {
        code: number,
        message: string,
    }
}