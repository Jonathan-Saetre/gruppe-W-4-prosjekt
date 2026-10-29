import { z } from "zod";

export const createProduceSchema = z.object({
  title: z.string().trim().min(1, "Tittel er påkrevd"),
  description: z.string().trim().optional(),
  category: z.string().trim().min(1, "Kategori er påkrevd"),
  pickupLocation: z.string().trim().min(1, "Hentested er påkrevd"),
  amount: z.coerce.number().positive("Mengde må være større enn 0"),
  unit: z.enum(["kg","stk","poser"]),
  pickupDeadline: z.coerce.date(),
});

export const updateProduceSchema = createProduceSchema.partial().extend({pickedUp: z.boolean().optional(),});

export type CreateProduceInput = z.infer<typeof createProduceSchema>;