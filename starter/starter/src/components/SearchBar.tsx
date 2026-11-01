export default async function Search(){
    return(
    <form method="GET" className="flex flex-wrap items-center gap-3 py-4">
        <button className="border rounded-md bg-[#C0392B]/80 hover:bg-[#C0392B]/40 text-[#FCF8E8] font-medium px-5 py-1" type="submit">Søk</button>
        <label>
        <input className="border rounded-md text-[15px] w-45 border-slate-300 px-2 py-1 text-sm" type="search" name="q" placeholder="Søk etter råvarer..."/>
        </label>
        <label htmlFor="pickedUp" className="font-medium text-[15px]">Hentestatus:</label>
            <select id="pickedUp" name="pickedUp" className="border rounded-md w-24">
                <option value="">Alle</option>
                <option value="true">Hentet</option>
                <option value="false">Ikke hentet</option>
            </select>
            <label htmlFor="pickedUp" className="font-medium text-[15px]">Kategori:</label>
            <select id="category" name="category" className="border rounded-md w-24">
                <option value="">Alle</option>
                <option value="frukt">Frukt</option>
                <option value="grønnsaker">Grønnsaker</option>
                <option value="bær">Bær</option>
                <option value="friske urter">Friske urter</option>
                <option value="nøtter og frø">Nøtter og frø</option>
                <option value="sopp">Sopp</option>
            </select>
        </form>
    )
}