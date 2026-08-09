import { test, expect } from "@playwright/test";

test.describe("work gallery", () => {
  test("/work shows the featured products gallery with images", async ({ page }) => {
    await page.goto("/fr/work");
    const cards = page.locator(".grid .card");
    await expect(cards).toHaveCount(8);
    const imgs = page.locator(".grid .card img");
    expect(await imgs.count()).toBeGreaterThanOrEqual(7);
  });

  test("a gallery card links to its detail page", async ({ page }) => {
    await page.goto("/fr/work");
    await page.locator(".grid .card", { hasText: "Largo" }).first().click();
    await expect(page).toHaveURL(/\/fr\/work\/largo/);
    await expect(page.locator("h1")).toContainText("Largo");
  });

  test("no stale experiment listing on /work", async ({ page }) => {
    await page.goto("/fr/work");
    // les expérimentations (stasis, oss-miner…) ne doivent plus apparaître
    await expect(page.locator("body")).not.toContainText("oss-miner");
    await expect(page.locator("body")).not.toContainText("stasis");
  });
});

test.describe("about", () => {
  test("/about shows studio content without product repetition", async ({ page }) => {
    await page.goto("/fr/about");
    await expect(page.locator("h1")).toContainText("Memo Labs");
    // le CTA existe
    await expect(page.getByRole("link", { name: /Travaillons ensemble|Let's work/i })).toBeVisible();
  });
});

test.describe("home", () => {
  test("home shows the featured gallery (vitrine)", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator(".grid .card")).toHaveCount(8);
  });
});
