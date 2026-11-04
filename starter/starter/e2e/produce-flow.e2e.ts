import { test, expect } from "@playwright/test";

test.describe("Hovedflyt: Registrer, logg inn og legg ut råvare", () => {
  test("skal kunne legge ut et innlegg og se det på forsiden", async ({ page }) => {
    // Logger API-kall for enklere feilsøking
    page.on("response", async (response) => {
      if (
        response.url().includes("/api/v1/produce") &&
        response.request().method() === "POST"
      ) {
        console.log("→ API status:", response.status());
        try {
          console.log("→ API body:", await response.text());
        } catch {}
      }
    });

    // Unik e-post og tittel slik at testen kan kjøres flere ganger
    const timestamp = Date.now();
    const uniqueEmail = `test-${timestamp}@example.com`;
    const uniqueTitle = `E2E Epler ${timestamp}`;

    // 1. Registrer en ny bruker
    await page.goto("/register");
    await page.fill('input[name="name"]', "Testbruker");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', "Passord123!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/");

    // 2. Gå til "Nytt innlegg"
    await page.click('text="+ Del fra hagen"');
    await expect(page).toHaveURL("/produce/new");

    // Vent på at skjemaet er hydrert (knappen blir enabled)
    const submitButton = page.locator('button:has-text("Legg ut i nabolaget")');
    await expect(submitButton).toBeEnabled();

    // 3. Fyll ut skjemaet
    await page.fill('input[id="title"]', uniqueTitle);
    await page.selectOption('select[id="category"]', "frukt");
    await page.fill('input[id="amount"]', "5");
    await page.fill('input[id="pickupLocation"]', "E2E Veien 1");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().slice(0, 10);
    await page.fill('input[id="pickupDeadline"]', dateString);

    await page.fill('input[id="contactInfo"]', "12345678");

    // 4. Send inn
    await submitButton.click();

    // 5. Vent på at vi blir sendt til detaljsiden
    try {
      await page.waitForURL(/\/produce\/[a-zA-Z0-9_-]+$/, { timeout: 10000 });
    } catch {
      const alert = page.locator('[role="alert"]');
      if ((await alert.count()) > 0) {
        const errorText = await alert.first().textContent();
        throw new Error(`Innsending feilet. Feilmelding i skjema: ${errorText}`);
      }
      throw new Error("Innsending feilet uten feilmelding i skjema.");
    }

    await expect(page.locator("h1")).toContainText(uniqueTitle);

    // 6. Gå tilbake til forsiden og sjekk at det ligger i listen
    await page.goto("/");
    // Bruker .first() for å unngå strict mode-feil dersom samme tittel
    // skulle dukke opp flere steder i DOM-en
    await expect(page.getByText(uniqueTitle).first()).toBeVisible();
  });
});