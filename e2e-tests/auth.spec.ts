import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login page by default", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("login-title")).toHaveText("Sign In");
    await expect(page.getByTestId("login-form")).toBeVisible();
  });

  test("should switch to register page", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("switch-to-register").click();
    await expect(page.getByTestId("register-title")).toHaveText("Create Account");
    await expect(page.getByTestId("register-form")).toBeVisible();
  });

  test("should switch back to login from register", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("switch-to-register").click();
    await page.getByTestId("switch-to-login").click();
    await expect(page.getByTestId("login-title")).toHaveText("Sign In");
  });

  test("should register a new user", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("switch-to-register").click();

    await page.getByTestId("register-displayname").fill("Playwright User");
    await page.getByTestId("register-username").fill("pw_user_" + Date.now());
    await page.getByTestId("register-email").fill(`pw_${Date.now()}@test.com`);
    await page.getByTestId("register-password").fill("securepass123");
    await page.getByTestId("register-submit").click();

    // Should redirect to groups page after successful registration
    await expect(page.getByTestId("app-header")).toHaveText("SplitWise");
    await expect(page.getByTestId("groups-title")).toBeVisible();
  });

  test("should show error on duplicate registration", async ({ page }) => {
    const username = "dup_user_" + Date.now();
    await page.goto("/");

    // Register first time
    await page.getByTestId("switch-to-register").click();
    await page.getByTestId("register-displayname").fill("First");
    await page.getByTestId("register-username").fill(username);
    await page.getByTestId("register-email").fill(`${username}@test.com`);
    await page.getByTestId("register-password").fill("securepass123");
    await page.getByTestId("register-submit").click();
    await expect(page.getByTestId("app-header")).toBeVisible();

    // Logout
    await page.getByTestId("logout-btn").click();

    // Try register same username
    await page.getByTestId("switch-to-register").click();
    await page.getByTestId("register-displayname").fill("Second");
    await page.getByTestId("register-username").fill(username);
    await page.getByTestId("register-email").fill(`different_${Date.now()}@test.com`);
    await page.getByTestId("register-password").fill("securepass123");
    await page.getByTestId("register-submit").click();

    await expect(page.getByTestId("register-error")).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    const username = "login_test_" + Date.now();
    await page.goto("/");

    // Register first
    await page.getByTestId("switch-to-register").click();
    await page.getByTestId("register-displayname").fill("Login Tester");
    await page.getByTestId("register-username").fill(username);
    await page.getByTestId("register-email").fill(`${username}@test.com`);
    await page.getByTestId("register-password").fill("securepass123");
    await page.getByTestId("register-submit").click();
    await expect(page.getByTestId("app-header")).toBeVisible();

    // Logout
    await page.getByTestId("logout-btn").click();
    await expect(page.getByTestId("login-title")).toBeVisible();

    // Login
    await page.getByTestId("login-username").fill(username);
    await page.getByTestId("login-password").fill("securepass123");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("current-user")).toHaveText("Login Tester");
  });

  test("should show error on invalid login", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("login-username").fill("nonexistent_user");
    await page.getByTestId("login-password").fill("wrongpass");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("login-error")).toBeVisible();
  });

  test("should logout and return to login", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("switch-to-register").click();
    await page.getByTestId("register-displayname").fill("Logout Test");
    await page.getByTestId("register-username").fill("logout_" + Date.now());
    await page.getByTestId("register-email").fill(`logout_${Date.now()}@test.com`);
    await page.getByTestId("register-password").fill("securepass123");
    await page.getByTestId("register-submit").click();
    await expect(page.getByTestId("app-header")).toBeVisible();

    await page.getByTestId("logout-btn").click();
    await expect(page.getByTestId("login-title")).toBeVisible();
  });
});
