# gruppe W-4 prosjekt
Alle kommandoer kjøres i mappa "starter/starter"
1. Installer avhengigheter
kjør:npm install

2. Kjør databasemigrering
kjør:npm run migrate:dev
3. Kjør genereringen: npm run generate
    
4. Legg inn seed
kjør:npm run seed
    
5. Start opp applikasjonen
kjør:npm run dev

Testing
1. kjør:npm run test
2. installer npx playwright - bare første gang
kjør:npx playwright install
3. e2e test
kjør:npm run test:e2e


Hva appen gjør:
Appen gjør det mulig for privatpersoner å legge ut annonser om frukt, bær og grønnsaker de ønsker å gi bort fra egen hage. På denne måten kan overskudd av råvarer, for eksempel epler, deles med andre i stedet for å bli kastet. Målet er å redusere matsvinn og gjøre råvarer mer tilgjengelige for flere.

Hovedflyt:
Brukeren oppretter en konto eller logger inn, og kan deretter legge ut annonser med informasjon om råvarene de ønsker å gi bort. Andre brukere kan se annonsene og finne råvarer de ønsker å hente. Brukeren kan også gå til profilen sin for å se, redigere og slette egne annonser.

Oppbygging av appen:
Home viser oversikten over annonser gjennom ProduceList og ProduceCard. Innlogging og registrering håndteres av Login- og Register-komponentene. Hoveddelen av applikasjonen følger en trelagsstruktur i features-mappen: produce-controller håndterer HTTP-forespørsler, produce-service tar seg av validering og forretningslogikk, og produce-repository håndterer kommunikasjonen med databasen. Produce-router ligger også inni feature mappen. Databaseoppsettet ligger i db-mappen, mens lib inneholder logikken for innlogging og registrering. Komponentene ligger i src, og pages ligger i app.

Teknisk valg:
Cloudflare R2 som skylagringtjeneste for bilder
Trelagsstruktur: Controller, repository og service
Cloudflare D1 (SQLite) som database, med Drizzle som ORM.
