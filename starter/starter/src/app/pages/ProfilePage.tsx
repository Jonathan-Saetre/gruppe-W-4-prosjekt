import { requestInfo } from "rwsdk/worker";
import ProduceEdit from "./produce/ProduceEditPage";
import ProfileClient from "./ProfileClinet";
import { drizzle } from "drizzle-orm/d1";
import { produce } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
// interface Props {
// ctx: {E
//     user: { id: number; name: string; email: string } | null;
//   }; 
// }
export default async function Profile(){
const {ctx, request} = requestInfo

const user = ctx.user
if(!user){
    return(
        <main>
        <h1>Du er ikke logget inn</h1>
        <p>Du må logge deg inn for å se profilen din</p>
        <a href="/login" className="rounded-md border bg-[#6B8E23] border-slate-300 px-5 py-2 text-sm font-medium text-[#FCF8E8] transition hover:bg-[#405516]"
        >Logg inn</a>
        </main>
    )
}
// Midlertidig spørring her. Når vi vet hvordan repositoryet ser ut,
// flyttes den til en findByUserId-metode der.
  const db = drizzle(env.DB);
  const myPosts = await db
    .select()
    .from(produce)
    .where(eq(produce.userId, user.id))
    .orderBy(desc(produce.createdAt));
return(
    <main className="mx-auto max-w-4xl p-8 font-sans">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 text-center mb-5">Din profil 👤</h1>
        <ProfileClient user={user}/>
        {/* Her skal jeg sette inn producelist som er lik user.id */}
        <section>
            <header className="mb-4 flex items-center mt-5 justify-between">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Mine innlegg:</h2>
            <a href="/produce/new" className="rounded-md bg-[#6B8E23] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#405516]">
             + Del fra hagen
            </a>
            </header>
            {myPosts.length=== 0 ? (
                <p className="text-sm text-slate-600">
            Du har ikke lagt ut noe ennå. Del det du har for mye av i hagen.
          </p>
            ) : (
                <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {myPosts.map((p) =>
                     <li key={p.id}>
                    <article>
                        <h2>{p.title}</h2>
                        <p>{p.pickupLocation}</p>
                        <nav className="flex gap-3 text-sm">
                          <a href={`/produce/${p.id}`} className="text-slate-600 hover:underline">Se annonse</a>
                          <a href={`/profile/${p.id}`} className="font-semibold text-emerald-700 hover:underline">Rediger</a>
                        </nav>
                    </article>
                </li>)}
            </ol>
            )}
        </section>
   </main>
  )
}