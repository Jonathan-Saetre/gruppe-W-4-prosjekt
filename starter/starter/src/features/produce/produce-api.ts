import { Produce } from "@/db/schema";
import { Params } from "./utils/parse-params";

export async function listProduce(params: Record<string, string> = {}){
    try{
        const query = new URLSearchParams(params ?? {}).toString();

        const response = await fetch(`api/v1/produce?${query}`);

        if(!response.ok){
            console.log(response.ok, response.status, response.statusText)
        throw new Error("Response not ok");
        }
            const data = await response.json();
        return data as {ok: true, data: Produce[]};
    } catch(error){
            console.log(error)
        return {
            ok: false,
        error: {
            code: "500",
            message: "Fikk ikke kontakt med serveren eller noe er feil med spørringen"
         }
        }
    }
} 

