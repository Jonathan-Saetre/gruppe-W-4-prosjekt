"use client";

import { useState } from "react";

export type ProduceFormValues = {
  id?: string;
  title: string;
  description: string | null;
  category: string;
  pickupLocation: string;
  amount: number;
  unit: "kg" | "stk" | "poser";
  pickupDeadline: string | Date;
  pickedUp: boolean;
  contactInfo: string | null; // ✅ Added contact info
  imageKey?: string | null;   // ✅ Added image reference
};

type Props = {
  mode: "create" | "edit";
  initial?: ProduceFormValues;
};

const CATEGORIES = ["Epler", "Plommer", "Bær", "Grønnsaker"];
const UNITS = ["kg", "stk", "poser"] as const;

function toDateInput(value: string | Date | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-600 focus:outline-none";
const labelClass = "block text-sm font-medium text-slate-700";

export function ProduceForm({ mode, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [unit, setUnit] = useState<(typeof UNITS)[number]>(initial?.unit ?? "kg");
  const [pickupLocation, setPickupLocation] = useState(initial?.pickupLocation ?? "");
  const [deadline, setDeadline] = useState(toDateInput(initial?.pickupDeadline));
  const [pickedUp, setPickedUp] = useState(initial?.pickedUp ?? false);
  
  // New states for contact info and image
  const [contactInfo, setContactInfo] = useState(initial?.contactInfo ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    // ✅ We use FormData instead of JSON to handle the file upload
    const formData = new FormData();
    formData.append("title", title);
    if (description.trim() !== "") formData.append("description", description);
    formData.append("category", category);
    formData.append("pickupLocation", pickupLocation);
    formData.append("amount", amount);
    formData.append("unit", unit);
    formData.append("contactInfo", contactInfo);

    const originalDeadline = toDateInput(initial?.pickupDeadline);
    if (mode === "create" || deadline !== originalDeadline) {
      if (deadline) {
        formData.append("pickupDeadline", new Date(`${deadline}T23:59:59`).toISOString());
      }
    }
    
    if (mode === "edit") {
      formData.append("pickedUp", String(pickedUp));
    }

    // Append the file if one was selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(
        mode === "create" ? "/api/v1/produce" : `/api/v1/produce/${initial?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          // ❌ Remove Content-Type header. Fetch will set it automatically with the correct boundary for FormData
          body: formData,
        },
      );
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setFormError(json.error?.message ?? "Noe gikk galt");
        setFieldErrors(json.error?.fieldErrors ?? {});
        setSubmitting(false);
        return;
      }

      window.location.href = `/produce/${json.data.id}`;
    } catch {
      setFormError("Kunne ikke nå serveren. Prøv igjen.");
      setSubmitting(false);
    }
  }

  const err = (field: string) =>
    fieldErrors[field]?.length ? (
      <small className="mt-1 block text-xs text-red-600">{fieldErrors[field]![0]}</small>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-lg space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">
          {mode === "create" ? "Del fra hagen din 🌿" : "Rediger innlegg"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "create"
            ? "Har du mer frukt eller grønt enn du rekker å spise? Gi det bort til naboene dine!"
            : "Oppdater mengde, frist eller marker at alt er hentet."}
        </p>
      </header>

      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      <p>
        <label htmlFor="title" className={labelClass}>Hva tilbyr du?</label>
        <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="f.eks. Søte Discovery-epler" className={inputClass} />
        {err("title")}
      </p>

      <p>
        <label htmlFor="description" className={labelClass}>Beskrivelse (valgfritt)</label>
        <textarea id="description" rows={3} value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Sort, modenhet, hva du tenker man kan lage av dem …" className={inputClass} />
        {err("description")}
      </p>

      <p>
        <label htmlFor="category" className={labelClass}>Type råvare</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {err("category")}
      </p>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="sr-only">Mengde</legend>
        <p>
          <label htmlFor="amount" className={labelClass}>Mengde</label>
          <input id="amount" type="number" min="0" step="any" required value={amount}
            onChange={(e) => setAmount(e.target.value)} placeholder="5" className={inputClass} />
          {err("amount")}
        </p>
        <p>
          <label htmlFor="unit" className={labelClass}>Enhet</label>
          <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value as (typeof UNITS)[number])} className={inputClass}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          {err("unit")}
        </p>
      </fieldset>

      <p>
        <label htmlFor="pickupLocation" className={labelClass}>Hvor kan det hentes?</label>
        <input id="pickupLocation" required value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          placeholder="f.eks. Storgata 5, Halden" className={inputClass} />
        {err("pickupLocation")}
      </p>

      <p>
        <label htmlFor="pickupDeadline" className={labelClass}>Kan hentes til og med</label>
        <input id="pickupDeadline" type="date" required value={deadline}
          onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
        {err("pickupDeadline")}
      </p>

      {/* ✅ NEW: Contact Info Field */}
      <p>
        <label htmlFor="contactInfo" className={labelClass}>Kontaktinfo</label>
        <input id="contactInfo" required value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder="f.eks. telefonnummer eller e-post" className={inputClass} />
        {err("contactInfo")}
      </p>

      {/* ✅ NEW: Image Upload Field */}
      <p>
        <label htmlFor="image" className={labelClass}>Last opp bilde (valgfritt)</label>
        <input id="image" type="file" accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
          className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100" />
        {err("image")}
      </p>

      {mode === "edit" && (
        <p className="flex items-center gap-2">
          <input id="pickedUp" type="checkbox" checked={pickedUp}
            onChange={(e) => setPickedUp(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
          <label htmlFor="pickedUp" className="text-sm text-slate-700">
            Alt er hentet (skjules som tilgjengelig)
          </label>
        </p>
      )}

      <menu className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <a href={mode === "edit" ? "/profile" : "/"}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          Avbryt
        </a>
        <button type="submit" disabled={submitting}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
          {submitting ? "Lagrer …" : mode === "create" ? "Legg ut i nabolaget" : "Lagre endringer"}
        </button>
      </menu>
    </form>
  );
}