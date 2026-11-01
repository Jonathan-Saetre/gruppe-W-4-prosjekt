export default async function Search() {
  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-800 transition-colors focus:border-[#6B8E23] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6B8E23]/30";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <form
      method="GET"
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex min-w-[200px] flex-1 flex-col">
        <label htmlFor="q" className={labelClass}>
          Søk
        </label>
        <input
          id="q"
          className={inputClass}
          type="search"
          name="q"
          placeholder="Søk etter råvarer..."
        />
      </div>

      <div className="flex min-w-[130px] flex-col">
        <label htmlFor="pickedUp" className={labelClass}>
          Hentestatus
        </label>
        <select id="pickedUp" name="pickedUp" className={inputClass}>
          <option value="">Alle</option>
          <option value="true">Hentet</option>
          <option value="false">Ikke hentet</option>
        </select>
      </div>

      <div className="flex min-w-[150px] flex-col">
        <label htmlFor="category" className={labelClass}>
          Kategori
        </label>
        <select id="category" name="category" className={inputClass}>
          <option value="">Alle</option>
          <option value="frukt">Frukt</option>
          <option value="grønnsaker">Grønnsaker</option>
          <option value="bær">Bær</option>
          <option value="friske urter">Friske urter</option>
          <option value="nøtter og frø">Nøtter og frø</option>
          <option value="sopp">Sopp</option>
        </select>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-[#C0392B]/90 px-6 py-2.5 text-sm font-semibold text-[#FCF8E8] shadow-sm transition-colors hover:bg-[#C0392B] focus:outline-none focus:ring-2 focus:ring-[#C0392B]/50 focus:ring-offset-2 sm:mb-[1px]"
      >
        Søk
      </button>
    </form>
  );
}