import { DurableObject } from "cloudflare:workers";

interface SessionData {
  userId: number | null;
}

export class UserSession extends DurableObject<Env> {
  private session: SessionData | undefined = undefined;

  async getSession() {
    if (!this.session) {
      this.session =
        (await this.ctx.storage.get<SessionData>("session")) ?? {
          userId: null,
        };
    }
    return { value: this.session };
  }

  async saveSession(data: Partial<SessionData>) {
    this.session = { userId: data.userId ?? null };
    await this.ctx.storage.put("session", this.session);
    return this.session;
  }

  async revokeSession() {
    await this.ctx.storage.delete("session");
    this.session = undefined;
  }
}