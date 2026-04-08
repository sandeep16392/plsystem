import { test, expect, Page } from "@playwright/test";

async function registerAndLogin(page: Page, suffix: string) {
  const username = `grp_${suffix}_${Date.now()}`;
  await page.goto("/");
  await page.getByTestId("switch-to-register").click();
  await page.getByTestId("register-displayname").fill(`User ${suffix}`);
  await page.getByTestId("register-username").fill(username);
  await page.getByTestId("register-email").fill(`${username}@test.com`);
  await page.getByTestId("register-password").fill("securepass123");
  await page.getByTestId("register-submit").click();
  await expect(page.getByTestId("groups-title")).toBeVisible();
  return username;
}

test.describe("Groups", () => {
  test("should show empty state when no groups", async ({ page }) => {
    await registerAndLogin(page, "empty");
    await expect(page.getByTestId("groups-empty")).toHaveText(
      "No groups yet. Create your first one!"
    );
  });

  test("should create a basic group", async ({ page }) => {
    await registerAndLogin(page, "basic");

    await page.getByTestId("create-group-btn").click();
    await expect(page.getByTestId("create-group-title")).toBeVisible();

    await page.getByTestId("group-name-input").fill("Weekend Trip");
    await page.getByTestId("create-group-submit").click();

    // Should navigate back to groups list
    await expect(page.getByTestId("groups-list")).toBeVisible();
    await expect(page.getByText("Weekend Trip")).toBeVisible();
  });

  test("should create a trip group with dates and currency", async ({
    page,
  }) => {
    await registerAndLogin(page, "trip");

    await page.getByTestId("create-group-btn").click();
    await page.getByTestId("group-name-input").fill("Japan Trip 2024");
    await page.getByTestId("group-type-select").selectOption("trip");
    await page.getByTestId("group-currency-select").selectOption("JPY");

    // Trip date fields should appear
    await expect(page.getByTestId("trip-start-date")).toBeVisible();
    await page.getByTestId("trip-start-date").fill("2024-03-01");
    await page.getByTestId("trip-end-date").fill("2024-03-15");

    await page.getByTestId("create-group-submit").click();

    await expect(page.getByText("Japan Trip 2024")).toBeVisible();
    await expect(page.getByText("JPY")).toBeVisible();
  });

  test("should navigate into group detail", async ({ page }) => {
    await registerAndLogin(page, "detail");

    // Create group
    await page.getByTestId("create-group-btn").click();
    await page.getByTestId("group-name-input").fill("Detail Test Group");
    await page.getByTestId("create-group-submit").click();
    await expect(page.getByText("Detail Test Group")).toBeVisible();

    // Click to open
    await page.getByText("Detail Test Group").click();
    await expect(page.getByTestId("group-detail-name")).toHaveText(
      "Detail Test Group"
    );
    await expect(page.getByTestId("no-expenses")).toHaveText(
      "No expenses yet"
    );
  });

  test("should navigate back from group detail", async ({ page }) => {
    await registerAndLogin(page, "nav");
    await page.getByTestId("create-group-btn").click();
    await page.getByTestId("group-name-input").fill("Nav Test");
    await page.getByTestId("create-group-submit").click();
    await page.getByText("Nav Test").click();
    await expect(page.getByTestId("group-detail-name")).toBeVisible();

    await page.getByTestId("back-to-groups").click();
    await expect(page.getByTestId("groups-title")).toBeVisible();
  });

  test("should create multiple groups and list them", async ({ page }) => {
    await registerAndLogin(page, "multi");

    for (const name of ["Group Alpha", "Group Beta", "Group Gamma"]) {
      await page.getByTestId("create-group-btn").click();
      await page.getByTestId("group-name-input").fill(name);
      await page.getByTestId("create-group-submit").click();
      await expect(page.getByText(name)).toBeVisible();
    }

    const cards = page.getByTestId("groups-list").locator("button");
    await expect(cards).toHaveCount(3);
  });

  test("should go back from create group form", async ({ page }) => {
    await registerAndLogin(page, "back");
    await page.getByTestId("create-group-btn").click();
    await expect(page.getByTestId("create-group-title")).toBeVisible();
    await page.getByTestId("back-btn").click();
    await expect(page.getByTestId("groups-title")).toBeVisible();
  });
});
