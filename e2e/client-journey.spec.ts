import { expect, test } from "@playwright/test";

for (const locale of ["fr", "en"] as const) {
  test(`${locale}: a buyer can choose an example then contact the freelancer`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator(".hero .lede")).toContainText(locale === "fr" ? "agences" : "agencies");
    await expect(page.locator(".hero-actions > a")).toHaveCount(2);
    await page.locator('.hero-actions a[href="#examples"]').click();
    await expect(page.locator("#examples")).toBeInViewport();
    await expect(page.locator(".client-example")).toHaveCount(3);
    await expect(page.locator('.client-example a[href="https://demos.memolabs.dev/partenaire-automation/"]')).toBeVisible();
    await page.locator(`.client-example a[href="/${locale}/work/echo-travel"]`).click();
    await expect(page.locator(".case-snapshot")).toBeVisible();
    await page.locator(".case-outro .btn.p").click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/contact#freelance$`));
    await expect(page.locator(".contact-choice-links")).toBeVisible();
  });

  test(`${locale}: contact works without JavaScript and has one set of email options`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    try {
      await page.goto(`/${locale}/contact#freelance`);
      await expect(page.locator(".contact-choice-address")).toHaveCount(1);
      await expect(page.locator(".contact-choice-address")).toHaveText("contact@memolabs.dev");
      await expect(page.locator(".contact-choice-links a")).toHaveCount(3);
      for (const link of await page.locator(".contact-choice-links a").all()) await expect(link).toBeVisible();
      await expect(page.locator(".contact-choice-links")).not.toHaveRole("button");
      const email = await page.locator('.contact-choice-links a[href^="mailto:"]').getAttribute("href");
      const gmail = new URL((await page.locator('.contact-choice-links a[href*="mail.google.com"]').getAttribute("href"))!);
      const outlook = new URL((await page.locator('.contact-choice-links a[href*="outlook.office.com"]').getAttribute("href"))!);
      expect(gmail.searchParams.get("to")).toBe("contact@memolabs.dev");
      expect(outlook.searchParams.get("to")).toBe("contact@memolabs.dev");
      expect(gmail.searchParams.get("su")).toBe(outlook.searchParams.get("subject"));
      expect(decodeURIComponent(email!)).toContain(gmail.searchParams.get("su"));
      await expect(page.locator('#recruitment a[href^="mailto:"]')).not.toHaveAttribute("href", email!);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    } finally {
      await context.close();
    }
  });

  test(`${locale}: contact stays legible and usable at mobile, compact and desktop widths`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const width of [390, 1000, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/contact`);
      await expect(page.locator("#freelance h2")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(page.locator(".contact-choice-address")).toHaveCSS("color", "rgb(250, 249, 247)");
      const links = page.locator(".contact-choice-links a");
      for (const link of await links.all()) {
        await expect(link).toBeVisible();
        expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      await links.first().focus();
      await page.keyboard.press("Tab");
      await expect(links.nth(1)).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: testInfo.outputPath(`${locale}-contact-${width}.png`), fullPage: true });
      }
      await page.goto(`/${locale}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: testInfo.outputPath(`${locale}-home-${width}.png`), fullPage: true });
      }
    }
    expect(errors).toEqual([]);
  });
}
