# gruppe W-4 prosjekt
1. Gå inn i starter/starter mappen
2. Installer avhengigheter
kjør:npm install
    
1. Start utviklingsserveren
2. Start opp en ny terminal i samme mappe
3. Kjør databasemigrering
kjør:npm run migrate:dev
    
1. Legg inn seed
kjør:npm run seed
    
1. Start opp applikasjonen
kjør:npm run dev

1. Testing
kjør:npm run test
2. e2e test
kjør:npm run test:e2e


Hva appen gjør:
Appen gjør det mulig for privatpersoner å legge ut annonser om frukt, bær og grønnsaker de ønsker å gi bort fra egen hage. På denne måten kan overskudd av råvarer, for eksempel epler, deles med andre i stedet for å bli kastet. Målet er å redusere matsvinn og gjøre råvarer mer tilgjengelige for flere.

Hovedflyt:
Brukeren oppretter en konto eller logger inn, og kan deretter legge ut annonser med informasjon om råvarene de ønsker å gi bort. Andre brukere kan se annonsene og finne råvarer de ønsker å hente. Brukeren kan også gå til profilen sin for å se, redigere og slette egne annonser.

Oppbygging av appen:
Home viser oversikten over annonser gjennom ProduceList og ProduceCard. Innlogging og registrering håndteres av Login- og Register-komponentene. Hoveddelen av applikasjonen følger en trelagsstruktur i features-mappen: produce-controller håndterer HTTP-forespørsler, produce-service tar seg av validering og forretningslogikk, og produce-repository håndterer kommunikasjonen med databasen. Produce-router ligger også inni feature mappen. Databaseoppsettet ligger i db-mappen, mens lib inneholder logikken for innlogging og registrering. Komponentene ligger i src, og pages ligger i app.

Teknisk valg:
Cloudflare R2 som skylagring tjeneste
Trelagsstruktur: Controller, respository og service
Drizzle ORM som db

Hvordan starte opp testene:
Men vi mangler hvordan starte opp testene. vil noen skrive inn det under? og legge det inni readme filen? Desverre har jeg ikke hatt mye tid på å lære meg mye om testing så vet ikke hvordan det fungere. Skal lese meg mer opp på det før presentasjonen, for da får jeg mer tid til å lære meg hele applikasjonen mer grundig. 
