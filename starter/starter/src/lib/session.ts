import { defineDurableSession } from "rwsdk/auth";
import { env } from "cloudflare:workers";

export const sessionStore = defineDurableSession({
  sessionDurableObject: env.USER_SESSION_DO,
});