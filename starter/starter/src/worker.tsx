import { defineApp } from "rwsdk/worker";
import { render, route } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Document } from "@/app/Document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/Home";
import { Login } from "@/app/pages/Login";
import { Register } from "@/app/pages/Register";
import { UserSession } from "@/sessions/UserSession";
import { users } from "@/db/schema";
import { sessionStore } from "@/lib/session";

export type AppContext = {
  user: { id: number; name: string; email: string } | null;
};

const authMiddleware = async ({
  ctx,
  request,
}: {
  ctx: AppContext;
  request: Request;
}) => {
  const session = await sessionStore.load(request);
  const userId = session?.userId;

  if (!userId) {
    ctx.user = null;
    return;
  }

  const db = drizzle(env.DB);
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  ctx.user = user ?? null;
};

const app = defineApp([
  setCommonHeaders(),
  authMiddleware,

  route("/api/status", () =>
    Response.json({ status: "ok", version: "0.1.0" }),
  ),

  render(Document, [
    route("/login", Login),
    route("/register", Register),
    route("/", Home),
  ]),
]);

export default { fetch: app.fetch };
export { UserSession };