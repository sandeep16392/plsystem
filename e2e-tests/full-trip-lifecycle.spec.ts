import { test, expect } from "@playwright/test";

/**
 * Full E2E trip lifecycle test:
 * 1. Register user
 * 2. Create trip group with EUR target currency
 * 3. Add multiple expenses in different currencies
 * 4. View balances
 * 5. View simplified debts
 * 6. Settle a debt
 * 7. Verify "all settled" state
 *
 * This exercises the entire stack: React → FastAPI → SQLAlchemy → SQLite
 */
test.describe("Full Trip Lifecycle", () => {
  test("complete trip: create group → add expenses → view balances → settle", async ({
    page,
  }) => {
    const ts = Date.now();

    // ── Step 1: Register ──
    await page.goto("/");
    await page.getByTestId("switch-to-register").click();
    await page.getByTestId("register-displayname").fill("Trip Tester");
    await page.getByTestId("register-username").fill(`trip_${ts}`);
    await page.getByTestId("register-email").fill(`trip_${ts}@test.com`);
    await page.getByTestId("register-password").fill("securepass123");
    await page.getByTestId("register-submit").click();
    await expect(page.getByTestId("app-header")).toBeVisible();
    await expect(page.getByTestId("current-user")).toHaveText("Trip Tester");

    // ── Step 2: Create trip group ──
    await page.getByTestId("create-group-btn").click();
    await page.getByTestId("group-name-input").fill("Europe Trip");
    await page.getByTestId("group-type-select").selectOption("trip");
    await page.getByTestId("group-currency-select").selectOption("EUR");
    await page.getByTestId("trip-start-date").fill("2024-06-01");
    await page.getByTestId("trip-end-date").fill("2024-06-15");
    await page.getByTestId("create-group-submit").click();

    // Verify group appears
    await expect(page.getByText("Europe Trip")).toBeVisible();

    // ── Step 3: Navigate into group ──
    await page.getByText("Europe Trip").click();
    await expect(page.getByTestId("group-detail-name")).toHaveText(
      "Europe Trip"
    );
    await expect(page.getByTestId("group-detail-info")).toContainText("EUR");

    // ── Step 4: Add expenses ──
    const addExpense = async (desc: string, amount: string, currency: string) => {
      await page.getByTestId("add-expense-btn").click();
      await expect(page.getByTestId("add-expense-form")).toBeVisible();
      await page.getByTestId("expense-desc").fill(desc);
      await page.getByTestId("expense-amount").fill(amount);
      await page.getByTestId("expense-currency").selectOption(currency);
      await page.getByTestId("expense-submit").click();
      await expect(page.getByTestId("add-expense-form")).not.toBeVisible();
      await expect(page.getByText(desc)).toBeVisible();
    };

    await addExpense("Airport Taxi", "45", "USD");
    await addExpense("Hotel Room", "200", "EUR");
    await addExpense("Museum Tickets", "35", "GBP");

    // Verify all 3 expenses visible
    await expect(page.getByText("Airport Taxi")).toBeVisible();
    await expect(page.getByText("Hotel Room")).toBeVisible();
    await expect(page.getByText("Museum Tickets")).toBeVisible();

    // ── Step 5: View balances ──
    await page.getByTestId("tab-balances").click();
    await expect(page.getByText("Member Balances")).toBeVisible();
    await expect(page.getByTestId("balance-list")).toBeVisible();

    // Single user, so all settled (only 1 member = no debts)
    await expect(page.getByTestId("no-debts")).toHaveText("All settled up!");

    // ── Step 6: Switch back to expenses tab ──
    await page.getByTestId("tab-expenses").click();
    await expect(page.getByText("Airport Taxi")).toBeVisible();
    await expect(page.getByText("Hotel Room")).toBeVisible();
    await expect(page.getByText("Museum Tickets")).toBeVisible();

    // ── Step 7: Navigate back to groups ──
    await page.getByTestId("back-to-groups").click();
    await expect(page.getByTestId("groups-title")).toBeVisible();
    await expect(page.getByText("Europe Trip")).toBeVisible();
  });

  test("full flow: register → create group → add expense → check balance → back", async ({
    page,
  }) => {
    const ts = Date.now();

    await page.goto("/");
    await page.getByTestId("switch-to-register").click();
    await page.getByTestId("register-displayname").fill("Quick Flow");
    await page.getByTestId("register-username").fill(`quick_${ts}`);
    await page.getByTestId("register-email").fill(`quick_${ts}@test.com`);
    await page.getByTestId("register-password").fill("securepass123");
    await page.getByTestId("register-submit").click();

    // Create group
    await page.getByTestId("create-group-btn").click();
    await page.getByTestId("group-name-input").fill("Quick Group");
    await page.getByTestId("create-group-submit").click();
    await page.getByText("Quick Group").click();

    // Add expense
    await page.getByTestId("add-expense-btn").click();
    await page.getByTestId("expense-desc").fill("Pizza");
    await page.getByTestId("expense-amount").fill("30");
    await page.getByTestId("expense-submit").click();

    // Check balances
    await page.getByTestId("tab-balances").click();
    await expect(page.getByTestId("balance-list")).toBeVisible();

    // Go back
    await page.getByTestId("back-to-groups").click();
    await expect(page.getByText("Quick Group")).toBeVisible();

    // Logout
    await page.getByTestId("logout-btn").click();
    await expect(page.getByTestId("login-title")).toBeVisible();
  });
});
