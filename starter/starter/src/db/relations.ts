
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
   
    produce: r.many.produce({ from: r.users.id, to: r.produce.userId }),
  },
    produce: {
    user: r.one.users({
      from: r.produce.userId,
      to: r.users.id,
      optional: false,
    }),
  },
}));

export type Relations = typeof relations;
