"use server";

import { z } from "zod";
import { requestInfo } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import {
  PASSWORD_MAX_BYTES,
  PASSWORD_MIN_LENGTH,
  hashPassword,
  isPasswordTooLong,
  needsRehash,
  verifyPassword,
} from "@/lib/password";
import { sessionStore } from "@/lib/session";

const registerSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd"),
  email: z.string().email("Ugyldig e-post"),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Passord må være minst ${PASSWORD_MIN_LENGTH} tegn`)
    // bcrypt only uses the first 72 bytes, so reject longer passwords
    // instead of silently ignoring the rest.
    .refine(
      (value) => !isPasswordTooLong(value),
      `Passord kan ikke være lengre enn ${PASSWORD_MAX_BYTES} byte`,
    ),
});

const loginSchema = z.object({
  email: z.string().email("Ugyldig e-post"),
  password: z.string().min(1, "Passord er påkrevd"),
});

const GENERIC_ERROR = "Feil e-post eller passord";

// A hash of a throwaway password, made once per isolate on first use. When
// the email doesn't exist we still run a bcrypt compare against it, so a
// missing user takes as long as a wrong password and response time doesn't
// reveal which emails are registered. (bcrypt is slow enough to make that
// difference easy to measure otherwise.)
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword("ikke-et-ekte-passord"));

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

  if (!user) {
    await verifyPassword(parsed.data.password, await getDummyHash());
    return { error: GENERIC_ERROR };
  }

  if (!(await verifyPassword(parsed.data.password, user.passwordHash))) {
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