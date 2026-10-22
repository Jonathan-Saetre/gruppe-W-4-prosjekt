// Testdata. Kjør med:
//   npm run seed      (eller pnpm seed)
//
// Poenget med en seed er at databasen kan nullstilles til en kjent tilstand.
// Slett .wrangler/, kjør migrasjonene og denne, så er dere tilbake der dere
// startet. Da slipper dere å lure på om feilen ligger i dataene.
import { defineScript } from "rwsdk/worker";
import { drizzle } from "drizzle-orm/d1";
import { users, tasks } from "./schema";
import { hashPassword } from "@/lib/password";

// Passordet til testbrukeren. Kort nok til å huske, langt nok til å
// passere minLength={8} i Register.tsx.
const TEST_PASSWORD = "test1234";

export const seedData = async (env: Env) => {
  const db = drizzle(env.DB);

  // Tøm først, så seed kan kjøres om igjen uten å doble alt.
  await db.delete(tasks);
  await db.delete(users);

  // Hashen tar ~100 ms med 100k PBKDF2-runder. Greit i en seed, men det er
  // derfor hashPassword er async og ikke noe vi gjør i render.
  const passwordHash = await hashPassword(TEST_PASSWORD);

  // Brukerne må inn før oppgavene: fremmednøkkelen krever at brukeren finnes.
  // Databasen nekter hvis dere tar rekkefølgen feil, og det er en god ting.
  const [user] = await db
    .insert(users)
    .values({
      name: "Test Testesen",
      email: "test@example.com",
      passwordHash,
    })
    .returning();

  await db.insert(tasks).values([
    {
      title: "Lese leksjonen før timen",
      completed: true,
      userId: user.id,
      dueDate: new Date(Date.now() - 86_400_000),
    },
    {
      title: "Sette opp prosjektet",
      completed: false,
      userId: user.id,
      dueDate: new Date(Date.now() + 86_400_000),
    },
  ]);

  console.log("Seeding ferdig");
  console.log(`  Logg inn med ${user.email} / ${TEST_PASSWORD}`);
};

export default defineScript(async ({ env }) => {
  await seedData(env);
  return Response.json({ success: true });
});