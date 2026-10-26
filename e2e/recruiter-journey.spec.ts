import { expect, test } from "@playwright/test";
import { PROJECT_VISUALS } from "../src/data/projectVisuals";

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
      const positioning = locale === "fr" ? "Du prototype au produit" : "From prototype to product";
      await expect(page.getByRole("heading", { level: 1 })).toContainText(positioning);
      await expect(page.getByRole("heading", { level: 2, name: locale === "fr" ? "Ce que je construis maintenant" : "What I'm building now" })).toBeVisible();
      await expect(page.locator("#github-activity a[href=\"https://github.com/guillaume-flambard\"]")).toBeVisible();
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
      await expect(contact).toHaveAttribute("href", new RegExp(`/${locale}/contact#freelance$`));
      await assertNoHorizontalOverflow(page);
      await contact.click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/contact#freelance$`));
    });
  });
}

for (const locale of locales) {
  test.describe(`${locale}: case study can be understood in one glance`, () => {
    for (const slug of ["echo-travel", "paykit", "blueowl"]) {
      test(`${slug}: problem, personal contribution, result before technical details`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const response = await page.goto(`/${locale}/work/${slug}`);
        expect(response?.status()).toBe(200);
        const snapshot = page.locator(".case-snapshot");
        await expect(snapshot).toBeVisible();
        await expect(snapshot.locator("dl > div")).toHaveCount(3);
        await expect(snapshot.locator("dt")).toHaveText(locale === "fr"
          ? ["Le besoin", "Mon intervention", "Le résultat"]
          : ["The problem", "My contribution", "The outcome"]);
        await expect(snapshot.locator("dd")).toHaveCount(3);
        for (const dd of await snapshot.locator("dd").all()) {
          expect((await dd.innerText()).trim().length).toBeGreaterThan(35);
        }
        await expect(snapshot.locator(".case-snapshot-caveat")).toBeVisible();
        const technical = page.locator("details.case-technical");
        await expect(technical).not.toHaveAttribute("open", "");
        await technical.locator("summary").click();
        await expect(technical).toHaveAttribute("open", "");
        await expect(technical.locator(".case-facts > div")).toHaveCount(2);
        await expect(technical.locator(".pstack .stack span").first()).toBeVisible();
        await expect(page.locator(".plinks .btn.s")).toHaveAttribute("href", `/${locale}/contact#freelance`);
        await expect(page.locator(".case-outro .btn.p")).toHaveAttribute("href", `/${locale}/contact#freelance`);
        await assertNoHorizontalOverflow(page);
        await page.setViewportSize({ width: 320, height: 720 });
        await assertNoHorizontalOverflow(page);
      });
    }
  });
}

test("gallery requests full-width responsive images and gives unique descriptions", async ({ page }) => {
  await page.goto("/fr/work/paykit");
  const images = page.locator(".pgallery img");
  expect(await images.count()).toBeGreaterThan(0);
  await expect(images.first()).toHaveAttribute("sizes", /1184px/);
  await expect(images.first()).toHaveAttribute("alt", /Visuel de présentation de PayKit/);
  await expect(page.locator(".project-figure")).toHaveCount(2);
  await expect(page.locator(".project-figure figcaption").first()).toContainText("Visuel de présentation de PayKit");
  await expect(page.locator(".project-visual-link").first()).toHaveAttribute("href", "/work/paykit/hero.png");
  await expect(page.locator(".project-visual-link").first()).toHaveAttribute("target", "_blank");
  await expect(page.locator(".project-gallery-intro")).toContainText("ne prouvent pas");
});

test("work listing leads with the three documented cases and keeps four projects in a compact index", async ({ page }) => {
  await page.goto("/fr/work");
  const cases = page.locator('[data-testid="case-projects"] .card');
  await expect(cases).toHaveCount(3);
  await expect(cases.locator("h3")).toContainText(["Echo Travel", "PayKit", "Blue Owl"]);
  for (const card of await cases.all()) {
    await expect(card).toContainText("Mon rôle");
  }
  const secondary = page.locator(".work-other-list li");
  await expect(secondary).toHaveCount(4);
  await expect(secondary.locator("strong")).toHaveText(["Émargo", "weave", "n8n-nodes-opn", "Largo IA"]);
  await expect(page.locator(".work-other img")).toHaveCount(0);
  await expect(cases.locator(".thumb img").first()).toHaveAttribute("sizes", /1056px/);
  await expect(page.locator(".work-other .proof-legend")).toBeVisible();
});

for (const locale of locales) {
  test(`${locale}: media gallery is accessible and honest on all featured projects`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const slug of ["emargo", "echo-travel", "paykit", "blueowl", "weave", "n8n-nodes-opn", "largo"]) {
      const response = await page.goto(`/${locale}/work/${slug}`);
      expect(response?.status()).toBe(200);
      const figures = page.locator(".project-gallery .project-figure");
      expect(await figures.count()).toBeGreaterThan(0);
      await expect(page.getByRole("heading", { level: 2, name: locale === "fr" ? "Aperçus du projet" : "Project visuals" })).toBeVisible();
      await expect(page.locator(".project-gallery-intro")).toContainText(locale === "fr" ? "ne prouvent pas" : "do not prove");
      for (const figure of await figures.all()) {
        const image = figure.locator("img");
        await expect(image).toHaveAttribute("alt", /.+/);
        await expect(figure.locator("figcaption")).toContainText(/.+/);
        const link = figure.locator("a.project-visual-link");
        await expect(link).toHaveAttribute("href", /^\/work\/.+\.png$/);
        await expect(link).toHaveAttribute("target", "_blank");
      }
      await assertNoHorizontalOverflow(page);
    }
  });
}

test("all 14 published project media files exist and are served as PNG", async ({ request }) => {
  const assets = Object.keys(PROJECT_VISUALS);
  expect(assets).toHaveLength(14);
  for (const url of assets) {
    const response = await request.get(url);
    expect(response.status(), `Missing portfolio asset ${url}`).toBe(200);
    expect(response.headers()["content-type"], `Unexpected MIME for ${url}`).toMatch(/^image\/png/);
  }
});

for (const locale of locales) {
  test(`${locale}: contact, resume and structured data point to the same verified professional profile`, async ({ page }) => {
    const profile = "https://www.linkedin.com/in/guillaume-flambard/";
    await page.goto(`/${locale}/contact`);
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", profile);
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(raw).toContain(profile);
    expect(raw).not.toContain("/guillaumeflambard/");
    await page.goto(`/${locale}/cv`);
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", profile);
  });
}

for (const locale of locales) {
  test(`${locale}: evidence-first work index stays readable and navigable at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(`/${locale}/work`);
    const label = locale === "fr" ? "Trois projets expliqués" : "Three projects, explained";
    await expect(page.getByRole("heading", { name: label, level: 2 })).toBeVisible();
    await expect(page.locator(".work-other-list li")).toHaveCount(4);
    await expect(page.locator('[data-testid="case-projects"] .card')).toHaveCount(3);
    await assertNoHorizontalOverflow(page);
    await page.locator('[data-testid="case-projects"] .card').first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/work/echo-travel$`));
    await page.goto(`/${locale}/work`);
    await page.locator(".work-other-link").first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/work/emargo$`));
  });
}

for (const locale of locales) {
  test.describe(`${locale}: recruiter evidence and contact deep links`, () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("employer names link to the right experience or case study", async ({ page }) => {
      await page.goto(`/${locale}`);
      const links = page.locator(".hero-evidence-links");
      await expect(links.getByRole("link")).toHaveCount(3);
      await expect(links.getByRole("link", { name: "Medsharing" })).toHaveAttribute("href", `/${locale}/about#experience-medsharing`);
      await expect(links.getByRole("link", { name: "Echo Travel" })).toHaveAttribute("href", `/${locale}/work/echo-travel`);
      await expect(links.getByRole("link", { name: "Symbyoz" })).toHaveAttribute("href", `/${locale}/about#experience-symbyoz`);

      await links.getByRole("link", { name: "Medsharing" }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/about#experience-medsharing$`));
      await expect(page.locator("#experience-medsharing")).toContainText("Medsharing");

      await page.goto(`/${locale}`);
      await links.getByRole("link", { name: "Symbyoz" }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/about#experience-symbyoz$`));
      await expect(page.locator("#experience-symbyoz")).toContainText("Symbyoz");
      await assertNoHorizontalOverflow(page);
    });

    test("service proof links reach specific project or employment evidence", async ({ page }) => {
      await page.goto(`/${locale}`);
      const links = page.locator(".focus-evidence a");
      await expect(links).toHaveCount(3);
      await expect(links.nth(0)).toHaveAttribute("href", `/${locale}/about#experience-medsharing`);
      await expect(links.nth(1)).toHaveAttribute("href", `/${locale}/work/echo-travel`);
      await expect(links.nth(2)).toHaveAttribute("href", `/${locale}/work/paykit`);
      await links.nth(2).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/work/paykit$`));
      await expect(page.locator(".case-snapshot")).toBeVisible();
    });

    test("freelance buyers and recruiters land in their correct contact section", async ({ page }) => {
      await page.goto(`/${locale}`);
      await page.locator(".hero-actions .btn.p").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/contact#freelance$`));
      await expect(page.locator("#freelance")).toBeVisible();

      await page.goto(`/${locale}`);
      await page.locator(".hero-recruiter-link").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/contact#recruitment$`));
      await expect(page.locator("#recruitment")).toBeVisible();
      const freelance = await page.locator("#freelance .btn.p").getAttribute("href");
      const recruitment = await page.locator("#recruitment .btn.p").getAttribute("href");
      expect(freelance).toMatch(/^mailto:contact@memolabs\.dev\?subject=/);
      expect(recruitment).toMatch(/^mailto:contact@memolabs\.dev\?subject=/);
      expect(freelance).not.toBe(recruitment);
      await expect(page.locator(".contact-direct a")).toHaveAttribute("href", "mailto:contact@memolabs.dev");
      await expect(page.locator(".foot").getByRole("link", { name: locale === "fr" ? "Mentions légales" : "Legal notice" }))
        .toHaveAttribute("href", `/${locale}/legal`);
      await assertNoHorizontalOverflow(page);
    });
  });
}

for (const locale of locales) {
  test.describe(`${locale}: case study pager follows the evidence-first grouping`, () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("starts Echo Travel → PayKit → Blue Owl, never a weaker case", async ({ page }) => {
      await page.goto(`/${locale}/work/echo-travel`);
      const pager = page.locator(".ppager");
      await expect(pager).toHaveAttribute("aria-label", locale === "fr" ? "Parcourir les réalisations" : "Browse portfolio projects");
      await expect(pager.getByRole("link", { name: /PayKit/ })).toHaveAttribute("href", `/${locale}/work/paykit`);
      expect(await pager.locator('a[href*="emargo"]').count()).toBe(0);

      await pager.getByRole("link", { name: /PayKit/ }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/work/paykit$`));
      await expect(page.locator(".ppager").getByRole("link", { name: /Blue Owl/ })).toBeVisible();
      await page.locator(".ppager").getByRole("link", { name: /Blue Owl/ }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/work/blueowl$`));
      expect(await page.locator(".ppager").locator('a[href*="emargo"]').count()).toBe(0);
      await expect(page.locator(".case-outro h2")).toHaveText(
        locale === "fr" ? "Vous travaillez sur un problème similaire ?" : "Working on a similar problem?"
      );
      await expect(page.locator(".case-outro .btn.p")).toHaveAttribute("href", `/${locale}/contact#freelance`);
      await assertNoHorizontalOverflow(page);
    });

    test("supporting projects stay in their own four-project sequence", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 720 });
      await page.goto(`/${locale}/work/emargo`);
      await expect(page.locator(".ppager").getByRole("link", { name: /weave/ })).toHaveAttribute("href", `/${locale}/work/weave`);
      expect(await page.locator(".case-outro").count()).toBe(0);
      expect(await page.locator(".ppager").locator('a[href*="blueowl"]').count()).toBe(0);
      await assertNoHorizontalOverflow(page);
    });
  });
}

test("unlocalized NetNewsWire universal-link fallback has an isolated root layout", async ({ page }) => {
  const response = await page.goto("/intentlane/netnewswire/article/test-reference", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/intentlane\/netnewswire\/article\/test-reference$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Open in NetNewsWire" })).toBeVisible();
  await expect(page.getByText("Reference: test-reference")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

for (const locale of locales) {
  test(`${locale}: project development journals are accessible from the living homepage`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}`);
    const journals = page.locator(".github-project-list .github-build-log-link");
    if ((await journals.count()) === 0) {
      // GitHub can rate-limit public unauthenticated requests in CI.
      await expect(page.locator(".github-empty").first()).toBeVisible();
      return;
    }
    await expect(journals.first()).toHaveAttribute("href", new RegExp(`^/${locale}/build/[^/]+/[^/]+$`));
    await journals.first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/build/[^/]+/[^/]+$`));
    await expect(page.getByRole("heading", { level: 2, name: locale === "fr" ? "Comment ce projet évolue" : "How this project evolved" })).toBeVisible();
    await expect(page.locator(".build-log-limitation")).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
}


for (const locale of locales) {
  test(locale + ": open-source contributions are accessible and status-labeled", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/" + locale);
    await expect(page.locator(".github-all-contributions-link")).toBeVisible();
    await expect(page.locator(".github-discovery-block")).toBeVisible();
    await page.locator(".github-all-contributions-link").click();
    await expect(page).toHaveURL(new RegExp("/" + locale + "/open-source$"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      locale === "fr" ? "Contributions open source" : "Open-source contributions",
    );
    await expect(page.getByRole("heading", { level: 2, name: locale === "fr"
      ? "Contributions fusionnées" : "Merged contributions" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: locale === "fr"
      ? "Propositions en cours" : "Work under review" })).toBeVisible();
    const accepted = page.locator('[data-testid="contributions-merged"] li');
    const open = page.locator('[data-testid="contributions-open"] li');
    if ((await accepted.count()) > 0) {
      await expect(accepted.first()).toContainText(locale === "fr" ? "PR fusionnée" : "Merged PR");
      await expect(accepted.first().locator("a")).toHaveAttribute("href", /^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+$/);
    }
    if ((await open.count()) > 0) {
      await expect(open.first()).toContainText(locale === "fr" ? "PR ouverte" : "Open PR");
    }
    await assertNoHorizontalOverflow(page);
  });
}
