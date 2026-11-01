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
  contactInfo: string | null; 
  imageKey?: string | null;   
};

type Props = {
  mode: "create" | "edit";
  initial?: ProduceFormValues;
};

const CATEGORIES = ["frukt", "grønnsaker", "bær", "friske urter", "sopp", "nøtter og frø"];
const UNITS = ["kg", "stk", "poser"] as const;

function toDateInput(value: string | Date | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

// Oppdatert input-styling med farger fra paletten
const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 text-slate-800 transition-colors focus:bg-white focus:border-[#6B8E23] focus:outline-none focus:ring-1 focus:ring-[#6B8E23]/30";
const labelClass = "block text-sm font-medium text-slate-700";

export function ProduceForm({ mode, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [unit, setUnit] = useState<(typeof UNITS)[number]>(initial?.unit ?? "kg");
  const [pickupLocation, setPickupLocation] = useState(initial?.pickupLocation ?? "");
  const [deadline, setDeadline] = useState(toDateInput(initial?.pickupDeadline));
  const [pickedUp, setPickedUp] = useState(initial?.pickedUp ?? false);
  
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

    if (imageFile) {
      formData.append("imageKey", imageFile);
    }

    try {
      const res = await fetch(
        mode === "create" ? "/api/v1/produce" : `/api/v1/produce/${initial?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
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
      <small className="mt-1 block text-xs font-medium text-[#C0392B]">{fieldErrors[field]![0]}</small>
    ) : null;

  return (
    // Wrapper formen i et hvitt kort for å skille det fra den gule bakgrunnen
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-5">
      <header className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-[#405516]">
          {mode === "create" ? "Del fra hagen din 🌿" : "Rediger innlegg"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {mode === "create"
            ? "Har du mer frukt eller grønt enn du rekker å spise? Gi det bort til naboene dine!"
            : "Oppdater mengde, frist eller marker at alt er hentet."}
        </p>
      </header>

      {formError && (
        <p role="alert" className="rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/10 p-3 text-sm font-medium text-[#C0392B]">
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
        <select id="category" value={category} required onChange={(e) => setCategory(e.target.value)} className={inputClass}>
          <option value="" disabled>Velg kategori</option>
          {CATEGORIES.map((c) =>
          <option key={c} value={c}>{c}</option>)}
        </select>
        {err("category")}
      </p>

      <fieldset className="grid grid-cols-2 gap-4">
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

      <p>
        <label htmlFor="contactInfo" className={labelClass}>Kontaktinfo</label>
        <input id="contactInfo" required value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder="f.eks. telefonnummer eller e-post" className={inputClass} />
        {err("contactInfo")}
      </p>

      <p>
        <label htmlFor="image" className={labelClass}>Last opp bilde (valgfritt)</label>
        <input id="image" type="file" accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
          className="mt-1 block w-fit text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-[#6B8E23]/80 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#FCF8E8] hover:file:bg-[#405516]/80"/>
        {err("imageKey")}
      </p>

      {mode === "edit" && (
        <p className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
          <input id="pickedUp" type="checkbox" checked={pickedUp}
            onChange={(e) => setPickedUp(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#6B8E23] focus:ring-[#6B8E23]" />
          <label htmlFor="pickedUp" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
            Alt er hentet (skjules som tilgjengelig)
          </label>
        </p>
      )}

      <menu className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <a href={mode === "edit" ? "/profile" : "/"}
          className="rounded-lg border border-[#C0392B]/20 bg-[#C0392B] px-5 py-2.5 text-sm font-semibold text-[#FCF8E8] transition-colors hover:bg-[#C0392B]/80">
          Avbryt
        </a>
        <button type="submit" disabled={submitting}
          className="rounded-lg bg-[#6B8E23] px-5 py-2.5 text-sm font-semibold text-[#FCF8E8] shadow-sm transition-colors hover:bg-[#405516] disabled:opacity-60">
          {submitting ? "Lagrer …" : mode === "create" ? "Legg ut i nabolaget" : "Lagre endringer"}
        </button>
      </menu>
    </form>
  );
}