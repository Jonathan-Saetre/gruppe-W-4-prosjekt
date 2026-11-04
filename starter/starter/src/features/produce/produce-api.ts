import { Produce } from "@/db/schema";
import { Params } from "./utils/parse-params";
//Record et objekt
//<string, string> krav på typen der nøkkel er tekst og verdi er tekst
//={} blir standarverdien 
export async function listProduce(params: Record<string, string> = {}){
    try{
        //URLSearchParams innebygd funksjon i JS formaterer objektet til en søkeformat
        //toString gjøre teksten til om til en ren tekst-streng
        const query = new URLSearchParams(params ?? {}).toString();

        //Legger til query i URL
        //Fetch bruker GET metoden automatisk
        //Fetch fetcher denne ruten
        const response = await fetch(`api/v1/produce?${query}`);

        if(!response.ok){
            console.log(response.ok, response.status, response.statusText)
        throw new Error("Response not ok");
        }
        //Gjør om dataen mottat av forespøselen igjennom API til json
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

