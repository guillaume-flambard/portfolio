import { expect, test } from "@playwright/test";

const locales = ["fr", "en"] as const;
const mobile = { width: 390, height: 844 };
const desktop = { width: 1440, height: 900 };

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(
    Math.max(dimensions.document, dimensions.body),
    `Unexpected horizontal overflow: ${JSON.stringify(dimensions)}`,
  ).toBeLessThanOrEqual(dimensions.viewport + 1);
}

for (const locale of locales) {
  test.describe(`${locale}: recruiter experience at 390px`, () => {
    test.use({ viewport: mobile });

    for (const path of ["", "/about", "/work", "/contact", "/cv", "/work/echo-travel"]) {
      test(`/${locale}${path || "/"} fits a mobile viewport`, async ({ page }, testInfo) => {
        const response = await page.goto(`/${locale}${path}`, { waitUntil: "domcontentloaded" });
        expect(response?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await assertNoHorizontalOverflow(page);
        const nav = await page.locator("nav.nav").boundingBox();
        expect(nav).not.toBeNull();
        expect(nav!.x).toBeGreaterThanOrEqual(-1);
        expect(nav!.x + nav!.width).toBeLessThanOrEqual(mobile.width + 1);
        if (path === "" || path === "/cv") {
          await testInfo.attach(`${locale}-mobile-${path || "home"}`, {
            body: await page.screenshot({ fullPage: true }),
            contentType: "image/png",
          });
        }
      });
    }

    test("home links to a real bilingual resume and offers direct contact", async ({ page }) => {
      await page.goto(`/${locale}`);
      await page.getByRole("link", { name: locale === "fr" ? "Voir mon CV" : "View my resume" }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/cv$`));
      await expect(page.getByRole("heading", { name: "Guillaume Flambard" })).toBeVisible();
      await expect(page.getByText("Medsharing", { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: locale === "fr" ? "Enregistrer en PDF / imprimer" : "Save as PDF / print" })).toBeVisible();
    });
  });

  test.describe(`${locale}: resume print output`, () => {
    test.use({ viewport: desktop });
    test("renders A4 PDF and hides screen-only controls in print CSS", async ({ page }, testInfo) => {
      const response = await page.goto(`/${locale}/cv`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { name: "Guillaume Flambard" })).toBeVisible();
      await assertNoHorizontalOverflow(page);
      await testInfo.attach(`${locale}-cv-desktop`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
      await page.emulateMedia({ media: "print" });
      await expect(page.locator(".print-hide").first()).toHaveCSS("display", "none");
      const pdf = await page.pdf({ format: "A4", printBackground: true });
      expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
      expect(pdf.length).toBeGreaterThan(10_000);
      const pageObjects = pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) ?? [];
      expect(pageObjects.length, "Resume must remain a single A4 page").toBe(1);
      await testInfo.attach(`${locale}-cv-print.pdf`, { body: pdf, contentType: "application/pdf" });
    });
  });
}

test("project case study distinguishes visible evidence from assumptions", async ({ page }) => {
  await page.goto("/fr/work/paykit");
  await expect(page.locator(".pdetail .eyebrow").first()).toContainText("Accès anticipé");
  await expect(page.locator(".evidence-note")).toContainText("La page publique propose un accès anticipé");
  await page.goto("/fr/work/weave");
  await expect(page.locator(".pdetail .eyebrow").first()).toContainText("Code source uniquement");
  const links = await page.locator('a[href="https://weave.memolabs.dev"]').count();
  expect(links).toBe(0);
});

test("contact differentiates freelance and employment inquiries", async ({ page }) => {
  await page.goto("/fr/contact");
  const freelance = page.getByRole("link", { name: "Décrire votre mission" });
  const hiring = page.getByRole("link", { name: "Proposer un poste" });
  await expect(freelance).toHaveAttribute("href", /mailto:contact@memolabs\.dev\?subject=/);
  await expect(hiring).toHaveAttribute("href", /mailto:contact@memolabs\.dev\?subject=/);
  expect(await freelance.getAttribute("href")).not.toEqual(await hiring.getAttribute("href"));
});

for (const locale of locales) {
  test.describe(`${locale}: mobile navigation works for keyboard and touch`, () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("unlocks career, work and CV on a small screen", async ({ page }) => {
      await page.goto(`/${locale}`);
      const menu = page.locator("details.mobile-menu");
      const trigger = menu.locator("summary");
      await expect(menu).not.toHaveAttribute("open", "");
      await expect(trigger).toBeVisible();
      await trigger.click();
      await expect(menu).toHaveAttribute("open", "");
      await expect(menu.getByRole("link", { name: locale === "fr" ? "Travail" : "Work" })).toBeVisible();
      await expect(menu.getByRole("link", { name: locale === "fr" ? "À propos" : "About" })).toBeVisible();
      await expect(menu.getByRole("link", { name: locale === "fr" ? "CV" : "Resume" })).toBeVisible();
      await menu.getByRole("link", { name: locale === "fr" ? "À propos" : "About" }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/about$`));
      await expect(page.locator("details.mobile-menu")).not.toHaveAttribute("open", "");
      await assertNoHorizontalOverflow(page);
      await page.locator("details.mobile-menu summary").focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("details.mobile-menu")).toHaveAttribute("open", "");
      await page.locator("details.mobile-menu").getByRole("link", { name: locale === "fr" ? "CV" : "Resume" }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/cv$`));
      await expect(page.getByRole("heading", { name: "Guillaume Flambard" })).toBeVisible();
    });

    test("skip link moves keyboard focus to the primary content", async ({ page }) => {
      await page.goto(`/${locale}`);
      await page.keyboard.press("Tab");
      await expect(page.locator(".skip-link")).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("#main-content")).toBeFocused();
    });
  });
}

test("mobile navigation fits 320px and desktop navigation is unchanged", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/fr");
  await expect(page.locator("details.mobile-menu summary")).toBeVisible();
  await assertNoHorizontalOverflow(page);
  await page.goto("/fr/work");
  await assertNoHorizontalOverflow(page);
  await page.goto("/fr/work/echo-travel");
  await assertNoHorizontalOverflow(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("details.mobile-menu")).toBeHidden();
  await expect(page.locator(".navlinks").getByRole("link", { name: "Travail" })).toBeVisible();
});

for (const locale of locales) {
  test.describe(`${locale}: recruiter understands the offer`, () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("identifies the engineer, service, experience and next step", async ({ page }) => {
      await page.goto(`/${locale}`);
      const role = locale === "fr" ? "Développeur React & TypeScript" : "React & TypeScript developer";
      await expect(page.getByRole("heading", { level: 1 })).toContainText(role);
      await expect(page.locator(".hero-identity")).toContainText("Memo Labs");
      await expect(page.locator(".hero-facts")).toContainText("Medsharing");
      await expect(page.locator(".hero-facts")).toContainText("Echo Travel");
      await expect(page.getByRole("heading", { level: 2, name: locale === "fr" ? "Sur quoi je peux vous aider" : "How I can help" })).toBeVisible();
      await expect(page.locator(".focus-grid > li")).toHaveCount(3);
      await expect(page.locator(".featured-section .card")).toHaveCount(3);
      await expect(page.locator(".featured-section .card").first()).toContainText(locale === "fr" ? "Mon rôle" : "My role");
      const contact = page.locator(".hero-actions").getByRole("link", {
        name: locale === "fr" ? "Discuter d’une mission" : "Discuss a project"
      });
      await expect(contact).toHaveAttribute("href", new RegExp(`/${locale}/contact$`));
      await assertNoHorizontalOverflow(page);
      await contact.click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/contact$`));
    });
  });
}
