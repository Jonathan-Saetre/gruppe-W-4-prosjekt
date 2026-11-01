// Zod-skjemaer for det brukeren sender inn. Dette er ikke databasetabellen,
// den ligger i db/schema/produce-schema.ts.
// Bare felt brukeren selv fyller ut er med. id, userId, pickedUp og createdAt
// settes av serveren, så de kan ikke sendes inn utenfra.

import { z } from "zod";

export const createProduceSchema = z.object({
    title: z.string().trim().min(1, "Tittel er påkrevd"),
    description: z.string().trim().nullish(),
    category: z.string().trim().min(1, "Kategori er påkrevd"),
    pickupLocation: z.string().trim().min(1, "Hentested er påkrevd"),
    // coerce: fra et skjema kommer alt som tekst, så "3" gjøres om til tallet 3.
    amount: z.coerce.number().positive("Mengde må være større enn 0"),
    unit: z.enum(["kg", "stk", "poser"]),
    contactInfo: z.string().trim().min(1, "Kontakt info er påkrevd").max(100, "Kontakt kan være maks 100 tegn"),
    pickupDeadline: z.coerce.date(),
});

// Ved oppdatering er alle felt valgfrie (PATCH endrer bare det som sendes),
// og brukeren kan i tillegg markere innlegget som hentet.
export const updateProduceSchema = createProduceSchema.partial().extend({ pickedUp: z.boolean().optional(), });

export type CreateProduceInput = z.infer<typeof createProduceSchema>;