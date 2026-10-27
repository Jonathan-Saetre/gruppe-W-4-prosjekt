import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type CreateUser = typeof users.$inferInsert;

export type PublicUser = Omit<User, "passwordHash">;  