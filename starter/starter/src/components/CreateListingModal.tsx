"use client";

import { useState } from "react";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: { title: string; category: string; price: number; location: string; imageUrl?: string }) => void;
}

export function CreateListingModal({ isOpen, onClose, onAddListing }: CreateListingModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Epler");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddListing({ 
      title, 
      category, 
      price: Number(price), 
      location, 
      imageUrl: imageUrl || undefined 
    });
    setTitle("");
    setLocation("");
    setImageUrl("");
    onClose();
  };

  return (
    <dialog open className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <article className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <header className="mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Del fra hagen din 🌿</h2>
          <p className="mt-1 text-sm text-slate-500">
            Har du mer frukt eller grønt enn du rekker å spise? Gi naboene dine beskjed!
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Hva tilbyr du?</label>
            <input
              id="title"
              type="text"
              required
              placeholder="f.eks. Søte Discovery-epler"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </p>

          <p>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Type råvare</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            >
              <option value="Epler">Epler</option>
              <option value="Plommer">Plommer</option>
              <option value="Bær">Bær</option>
              <option value="Grønnsaker">Grønnsaker</option>
            </select>
          </p>

          <p>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700">Pris i kr (sett 0 for gratis selvplukk)</label>
            <input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </p>

          <p>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700">Hvor i landet?</label>
            <input
              id="location"
              type="text"
              required
              placeholder="f.eks. Halden"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </p>

          <p>
            <label htmlFor="image" className="block text-sm font-medium text-slate-700">Bilde fra hagen</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </p>

          {imageUrl && (
            <figure className="mt-2">
              <figcaption className="mb-1 text-xs text-slate-500">Slik vil bildet se ut:</figcaption>
              <img src={imageUrl} alt="Forhåndsvisning" className="h-32 w-full rounded-lg object-cover border" />
            </figure>
          )}

          <menu className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Legg ut i nabolaget
            </button>
          </menu>
        </form>
      </article>
    </dialog>
  );
}