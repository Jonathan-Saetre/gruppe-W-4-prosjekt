"use client";

import { useState } from "react";
import { ProduceCard } from "@/components/ProduceCard";
import { CreateListingModal } from "@/components/CreateListingModal";
import { logoutAction } from "@/lib/auth-actions";

interface Listing {
  id: number;
  title: string;
  category: string;
  amount: string;
  location: string;
  imageUrl?: string;
}

interface HomeProps {
  ctx: {
    user: { id: number; name: string; email: string } | null;
  };
}

export function Home({ ctx }: HomeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = ctx.user;

  const [listings, setListings] = useState<Listing[]>([
    {
      id: 1,
      title: "Rød Aroma Epletre",
      category: "Epler",
      amount: "Selvplukk / ca. 10 kg",
      location: "Halden",
      imageUrl: "https://placehold.co/400",
    },
    {
      id: 2,
      title: "Økologisk Plommehage",
      category: "Plommer",
      amount: "3 poser ferdig plukket",
      location: "Tistedal",
    },
  ]);

  const handleAddListing = (newListing: {
    title: string;
    category: string;
    amount: string;
    location: string;
    imageUrl?: string;
  }) => {
    setListings([...listings, { id: Date.now(), ...newListing }]);
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/";
  };

  return (
    <main className="mx-auto max-w-4xl p-8 font-sans">
      <header className="mb-10 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <section>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Nabo Hagen 🍎
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Redd råvarer fra å gå til spille! Finn gratis frukt og grønt fra hager nær deg.
          </p>
        </section>

        <nav>
          {user ? (
            <p className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2">
              <span className="text-sm font-medium text-slate-700">
                Hei, {user.name}!
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Logg ut
              </button>
            </p>
          ) : (
            <a
              href="/login"
              className="rounded-md border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Logg inn
            </a>
          )}
        </nav>
      </header>

      <section>
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Aktuelt i nærområdet</h2>

          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + Del fra hagen
            </button>
          )}
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {listings.map((item) => (
            <ProduceCard
              key={item.id}
              title={item.title}
              category={item.category}
              amount={item.amount}
              location={item.location}
              imageUrl={item.imageUrl}
            />
          ))}
        </section>
      </section>

      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddListing={handleAddListing}
      />
    </main>
  );
}