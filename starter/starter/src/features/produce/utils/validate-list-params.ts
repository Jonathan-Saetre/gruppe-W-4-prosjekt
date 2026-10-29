import { Params } from "./parse-params";

//ProduceListParams baserer seg på hva vi skal ha muligheten til å filtere
export type ProduceListParams = {
    pickedUp?: boolean;
    q?: string; 
    limit?: number;
}

//hvilket felt feiler om vi prøver å sende inn en parameter som ikke er gyldig
//keyof får et objekt type av taskListParams
//altså field må innholde en av navnene på nøkklene i ProduceListParams 
export type ListPramasValidation = {
    ok: true; params: ProduceListParams
} | {ok: false, field: keyof ProduceListParams; error: string};


export const LIST_LIMIT_MAX = 100
//params som kommer ifra controller
export function validateListParams(input: Params): ListPramasValidation{
const params: ProduceListParams = {};

    if(input.pickedUp){
        const invalidCompletedValue =
        input.pickedUp !== "true" && input.pickedUp !== "false";
    if(invalidCompletedValue){
    return{
        ok: false,
        field: "pickedUp",
        error: "pickedup må våre true eller false",
     }
    }
    params.pickedUp = input.pickedUp == "true"
}
//trim ta vekk mellomrom slik at search må innholde en verdi
const search = input.q?.trim()
    if(search) params.q = search;

    if(input.limit){
        const limit = Number(input.limit)
        const isValidLimit = Number.isInteger(limit) && limit >= 1 && limit < LIST_LIMIT_MAX;
    if(!isValidLimit){
    return{
        ok: false,
        field: "limit",
        error: `limit må være et helttall ifra 1 til ${LIST_LIMIT_MAX}`
    };
   }
    params.limit = limit;
  }
    return {ok: true, params}
}
