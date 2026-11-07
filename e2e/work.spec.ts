import { test, expect } from "@playwright/test";

test.describe("work gallery", () => {
  test("/work leads with professional contributions and keeps other work accessible", async ({ page }) => {
    await page.goto("/fr/work");
    const cards = page.locator(".grid .card");
    await expect(cards).toHaveCount(4);
    const imgs = page.locator(".grid .card img");
    await expect(imgs).toHaveCount(0);
    await expect(page.getByTestId("other-projects").getByRole("link")).toHaveCount(6);
  });

  test("a gallery card links to its detail page", async ({ page }) => {
    await page.goto("/fr/work");
    await page.getByTestId("other-projects").getByRole("link", { name: /Largo/ }).click();
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
  test("/about identifies the developer and keeps contact accessible", async ({ page }) => {
    await page.goto("/fr/about");
    await expect(page.locator("h1")).toContainText("Guillaume Flambard");
    // le CTA existe
    await expect(page.locator('a[href="/fr/contact"]').last()).toBeVisible();
  });
});

test.describe("home", () => {
  test("home connects buyer needs to professional cases", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator(".client-example")).toHaveCount(4);
    await expect(page.locator('#examples a[href="/fr/work/flylooping"]')).toBeVisible();
  });
});
