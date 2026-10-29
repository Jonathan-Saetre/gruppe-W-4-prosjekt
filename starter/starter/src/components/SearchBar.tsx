import { service } from "@/app/features/produce-service";
import { Params, parseParams } from "@/app/features/utils/parse-params";
import { requestInfo } from "rwsdk/worker";
import { ProduceList } from "./ProduceList";
export default async function Search(){
    return(
    <form method="GET" className="flex flex-wrap items-center gap-3 py-4">
        <button className="border rounded-md bg-[#C0392B] text-[#FCF8E8] font-medium px-5 py-1" type="submit">Søk</button>
        <label>
        <input className="border rounded-md border-slate-300 px-4 py-1 text-sm" type="search" name="q" placeholder="Søk etter råvarer..."/>
        </label>
        <label htmlFor="pickedUp">Hentestatus:</label>
            <select id="pickedUp" name="pickedUp" className="border rounded-md">
                <option value="">Alle</option>
                <option value="true">Hentet</option>
                <option value="false">Ikke hentet</option>
            </select>
        </form>
    )
}