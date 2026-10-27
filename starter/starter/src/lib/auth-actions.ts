"use server";

import { z } from "zod";
import { requestInfo } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword, needsRehash } from "@/lib/password";
import { sessionStore } from "@/lib/session";

const registerSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd"),
  email: z.string().email("Ugyldig e-post"),
  password: z.string().min(8, "Passord må være minst 8 tegn"),
});

const loginSchema = z.object({
  email: z.string().email("Ugyldig e-post"),
  password: z.string().min(1, "Passord er påkrevd"),
});

const GENERIC_ERROR = "Feil e-post eller passord";

export type AuthState = { error: string } | { ok: true } | null;

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const email = parsed.data.email.toLowerCase();
  const db = drizzle(env.DB);

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) {
    return { error: "E-post er allerede registrert" };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const [user] = await db
    .insert(users)
    .values({ name: parsed.data.name, email, passwordHash })
    .returning({ id: users.id });

  await sessionStore.save(requestInfo.response.headers, { userId: user.id });
  return { ok: true };
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: GENERIC_ERROR };
  }

  const email = parsed.data.email.toLowerCase();
  const db = drizzle(env.DB);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: GENERIC_ERROR };
  }

  if (needsRehash(user.passwordHash)) {
    const newHash = await hashPassword(parsed.data.password);
    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, user.id));
  }

  await sessionStore.save(requestInfo.response.headers, { userId: user.id });
  return { ok: true };
}

export async function logoutAction() {
  await sessionStore.remove(requestInfo.request, requestInfo.response.headers);
  return { ok: true as const };
}

export async function getCurrentUser() {
  const session = await sessionStore.load(requestInfo.request);
  // Samme som i worker.tsx: load() gir sessionsdataene direkte.
  const userId = session?.userId;
  if (!userId) return null;

  const db = drizzle(env.DB);
  const [user] = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}