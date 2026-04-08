import { test, expect, Page } from "@playwright/test";

async function registerAndLogin(page: Page, suffix: string) {
  const username = `exp_${suffix}_${Date.now()}`;
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

async function createGroupAndNavigate(page: Page, name: string) {
  await page.getByTestId("create-group-btn").click();
  await page.getByTestId("group-name-input").fill(name);
  await page.getByTestId("create-group-submit").click();
  await page.getByText(name).click();
  await expect(page.getByTestId("group-detail-name")).toHaveText(name);
}

test.describe("Expenses", () => {
  test("should add an expense to a group", async ({ page }) => {
    await registerAndLogin(page, "addexp");
    await createGroupAndNavigate(page, "Expense Group");

    // Click add expense
    await page.getByTestId("add-expense-btn").click();
    await expect(page.getByTestId("add-expense-form")).toBeVisible();

    // Fill form
    await page.getByTestId("expense-desc").fill("Team Lunch");
    await page.getByTestId("expense-amount").fill("85.50");
    await page.getByTestId("expense-submit").click();

    // Expense should appear in list
    await expect(page.getByTestId("add-expense-form")).not.toBeVisible();
    await expect(page.getByText("Team Lunch")).toBeVisible();
    await expect(page.getByText("$85.50")).toBeVisible();
  });

  test("should add multiple expenses", async ({ page }) => {
    await registerAndLogin(page, "multiexp");
    await createGroupAndNavigate(page, "Multi Expense");

    const expenses = [
      { desc: "Groceries", amount: "42.00" },
      { desc: "Gas", amount: "55.75" },
      { desc: "Snacks", amount: "12.30" },
    ];

    for (const exp of expenses) {
      await page.getByTestId("add-expense-btn").click();
      await page.getByTestId("expense-desc").fill(exp.desc);
      await page.getByTestId("expense-amount").fill(exp.amount);
      await page.getByTestId("expense-submit").click();
      await expect(page.getByTestId("add-expense-form")).not.toBeVisible();
      await expect(page.getByText(exp.desc)).toBeVisible();
    }

    // All 3 expenses visible
    await expect(page.getByText("Groceries")).toBeVisible();
    await expect(page.getByText("Gas")).toBeVisible();
    await expect(page.getByText("Snacks")).toBeVisible();
  });

  test("should add expense with different currency", async ({ page }) => {
    await registerAndLogin(page, "diffcur");
    await createGroupAndNavigate(page, "Currency Group");

    await page.getByTestId("add-expense-btn").click();
    await page.getByTestId("expense-desc").fill("Euro Dinner");
    await page.getByTestId("expense-amount").fill("75");
    await page.getByTestId("expense-currency").selectOption("EUR");
    await page.getByTestId("expense-submit").click();
    await expect(page.getByTestId("add-expense-form")).not.toBeVisible();

    await expect(page.getByText("Euro Dinner")).toBeVisible();
  });

  test("should cancel adding expense", async ({ page }) => {
    await registerAndLogin(page, "cancel");
    await createGroupAndNavigate(page, "Cancel Group");

    await page.getByTestId("add-expense-btn").click();
    await expect(page.getByTestId("add-expense-form")).toBeVisible();

    // Click cancel button inside the form
    await page.getByTestId("add-expense-form").getByText("Cancel").click();
    await expect(page.getByTestId("add-expense-form")).not.toBeVisible();
  });
});

test.describe("Balances", () => {
  test("should show balance tab with member balances", async ({ page }) => {
    await registerAndLogin(page, "bal");
    await createGroupAndNavigate(page, "Balance Group");

    // Add an expense first
    await page.getByTestId("add-expense-btn").click();
    await page.getByTestId("expense-desc").fill("Balance Test");
    await page.getByTestId("expense-amount").fill("100.00");
    await page.getByTestId("expense-submit").click();

    // Switch to balances tab
    await page.getByTestId("tab-balances").click();
    await expect(page.getByTestId("balance-list")).toBeVisible();
  });

  test("should show all settled when no expenses", async ({ page }) => {
    await registerAndLogin(page, "nobal");
    await createGroupAndNavigate(page, "No Balance Group");

    await page.getByTestId("tab-balances").click();
    await expect(page.getByTestId("no-debts")).toHaveText("All settled up!");
  });

  test("should switch between expenses and balances tabs", async ({
    page,
  }) => {
    await registerAndLogin(page, "tabs");
    await createGroupAndNavigate(page, "Tab Group");

    // Expenses tab default
    await expect(page.getByTestId("add-expense-btn")).toBeVisible();

    // Switch to balances
    await page.getByTestId("tab-balances").click();
    await expect(page.getByText("Member Balances")).toBeVisible();

    // Switch back to expenses
    await page.getByTestId("tab-expenses").click();
    await expect(page.getByTestId("add-expense-btn")).toBeVisible();
  });
});
