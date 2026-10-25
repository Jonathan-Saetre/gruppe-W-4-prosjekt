import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user-schema";
import { createId } from "@/lib/id";


export const produce = sqliteTable(
  "produce",
  {
    id: text("id")
      .primaryKey()
      .$default(() => createId()),
    title: text("title").notNull(),
    description: text("description"),
    category: text("category").notNull(),
    pickupLocation: text("pickup_location").notNull(),
    amount: real("amount").notNull(),
    pickupDeadline: integer("pickup_deadline", { mode: "timestamp" }).notNull(),
    pickedUp: integer("pickedUp", { mode: "boolean" }).notNull().default(false),
    unit: text("unit", { enum: ["kg", "stk", "poser"]}).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
      imageKey: text("image_key"),
  },
  (table) => [index("idx_produce_user_id").on(table.userId)]
);

export type Produce = typeof produce.$inferSelect;
export type CreateProduce = typeof produce.$inferInsert;
export type UpdateProduce = Partial<CreateProduce>;
