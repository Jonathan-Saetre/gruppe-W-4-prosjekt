"use client";

import { useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { Login } from "./Login";
import { CreateListingModal } from "@/components/CreateListingModal";

interface Listing {
  id: number;
  title: string;
  category: string;
  price: number;
  location: string;
  imageUrl?: string;
}

export function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [listings, setListings] = useState<Listing[]>([
    {
      id: 1,
      title: "Rød Aroma Epletre",
      category: "Epler",
      price: 0,
      location: "Halden",
      imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Økologisk Plommehage",
      category: "Plommer",
      price: 30,
      location: "Tistedal",
    },
  ]);

  const handleAddListing = (newListing: {
    title: string;
    category: string;
    price: number;
    location: string;
    imageUrl?: string;
  }) => {
    setListings([
      ...listings,
      { id: Date.now(), ...newListing }
    ]);
  };

  if (showLogin) {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <nav className="mx-auto max-w-4xl px-8 mb-4">
          <button
            onClick={() => setShowLogin(false)}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Tilbake til marten
          </button>
        </nav>
        <Login
          onLogin={(username) => {
            setUser(username);
            setShowLogin(false);
          }}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-8 font-sans">
      <header className="mb-10 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <section>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Farmers Market 🍎
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Redd råvarer fra å gå til spille! Finn frukt og grønt fra hager nær deg.
          </p>
        </section>

        <nav>
          {user ? (
            <p className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2">
              <span className="text-sm font-medium text-slate-700">Hei, {user}!</span>
              <button
                onClick={() => setUser(null)}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Logg ut
              </button>
            </p>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Logg inn
            </button>
          )}
        </nav>
      </header>

      <section>
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Aktuelt i nærområdet</h2>
          
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + Del fra hagen
            </button>
          )}
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {listings.map((item) => (
            <ListingCard
              key={item.id}
              title={item.title}
              category={item.category}
              price={item.price}
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