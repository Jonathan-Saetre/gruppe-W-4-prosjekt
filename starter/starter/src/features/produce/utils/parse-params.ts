export type Params = Record<string, string | undefined>;

//{"string": "string", "anotherString": undefined}

//request vi får ifra rwSDK
//request er den innebygd type
export function parseParams(request: Request){
//får inn data som type liste [["a", "b"]]
//Den må vi konventere noe vi kan bruke i koden vår
//bruker noe som er innebygd i JS new URL 
//konventere det om til en URL object
//henter ut searchParams
//gir oss key og value par
 return Object.fromEntries(new URL(request.url).searchParams);
 //om vi får inn dublikate verdier er den den verdien lengst til høyre som overstyrer den andre
} 