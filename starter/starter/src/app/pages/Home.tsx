
import { useState } from "react";
import { ProduceCard } from "@/components/ProduceCard";
import { CreateListingModal } from "@/components/CreateListingModal";
import { logoutAction } from "@/lib/auth-actions";
import Search from "@/components/SearchBar";
import { ProduceList } from "@/components/ProduceList";
import { requestInfo } from "rwsdk/worker";
import { parseParams } from "@/features/produce/utils/parse-params";
import { produceService } from "@/features/produce/produce-service";

// interface Listing {
//   id: number;
//   title: string;
//   category: string;
//   amount: string;
//   location: string;
//   imageUrl?: string;
// }

// interface HomeProps {
//   ctx: {
//     user: { id: number; name: string; email: string } | null;
//   };
// }

export async function Home() {
  const {ctx, request} = requestInfo

  //const [isModalOpen, setIsModalOpen] = useState(false);
  const user = ctx.user;

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/";
  };

  const params = parseParams(request);

  const result = await produceService.list(params);

  if(!result.ok){
    return(
      <p>Klarter ikke å hente inn råvarer: {result.error.message}</p>
    )
  }

  return (
    <main className="mx-auto max-w-4xl p-8 font-sans">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <section className="w-full">
          <div className="flex w-full flex-wrap justify-between items-center gap-3 py-4">
           <Search/>
           <nav className="ml-auto">
           {user ? (
               <a className="flex whitespace-nowrap items-center gap-3 rounded-full bg-[#C0392B]/70 hover:bg-[#C0392B]/35 px-4 py-2" 
               href="/profile" aria-label="Sender deg til profilen siden din">
               <p>
               <span className="text-sm font-medium">
               Hei, {user.name}!
               <span className="text-lg">👤</span>
               </span>
               </p>
               </a>
           ) : (
             <a
               href="/login"
               className="rounded-md border bg-[#6B8E23] px-5 py-2 text-sm font-medium text-[#FCF8E8] transition hover:bg-[#405516]"
             >
               Logg inn
             </a>
           )}
         </nav>
        </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Nabo Hagen 🍎
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Redd råvarer fra å gå til spille! Finn gratis frukt og grønt fra hager nær deg.
          </p>
        </section>
      </header>

      <section>
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Aktuelt i nærområdet</h2>

          {user && (
            <button
              //onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + Del fra hagen
            </button>
          )}
        </header>
        <ProduceList produce={result.data}/>
      </section>

      {/* <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddListing={handleAddListing}
      /> */}
    </main>
  );
}