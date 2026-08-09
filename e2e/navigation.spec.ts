import { test, expect } from "@playwright/test";

test.describe("navigation", () => {
  test("nav shows Home · Work · Lab · About · Contact", async ({ page }) => {
    await page.goto("/fr");
    const nav = page.locator(".navlinks");
    await expect(nav.getByRole("link", { name: "Accueil" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Travail" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Lab" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "À propos" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("logo links to home", async ({ page }) => {
    await page.goto("/fr/work");
    await page.locator(".logo").click();
    await expect(page).toHaveURL(/\/fr$/);
  });

  test("nav links navigate to correct routes", async ({ page }) => {
    await page.goto("/fr");
    await page.locator(".navlinks").getByRole("link", { name: "Travail" }).click();
    await expect(page).toHaveURL(/\/fr\/work/);
    await page.goto("/fr");
    await page.locator(".navlinks").getByRole("link", { name: "À propos" }).click();
    await expect(page).toHaveURL(/\/fr\/about/);
    await page.goto("/fr");
    await page.locator(".navlinks").getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/fr\/contact/);
  });

  test("active state marks current page", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator(".navlinks a.on")).toHaveText("Accueil");
    await page.goto("/fr/work");
    await expect(page.locator(".navlinks a.on")).toHaveText("Travail");
    await page.goto("/fr/about");
    await expect(page.locator(".navlinks a.on")).toHaveText("À propos");
    await page.goto("/fr/contact");
    await expect(page.locator(".navlinks a.on")).toHaveText("Contact");
  });

  test("Lab link points to external lab.memolabs.dev", async ({ page }) => {
    await page.goto("/fr");
    const lab = page.locator(".navlinks").getByRole("link", { name: "Lab" });
    expect(await lab.getAttribute("href")).toBe("https://lab.memolabs.dev");
  });
});
