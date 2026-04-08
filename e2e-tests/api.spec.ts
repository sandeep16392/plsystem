import { test, expect } from "@playwright/test";

/**
 * API-level tests using Playwright's request context.
 * These test the backend API directly (no browser needed)
 * but still exercise the full stack: FastAPI → Services → Repos → SQLite.
 */
const API = "http://localhost:8000/api";

test.describe("API: Health & Schema", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const resp = await request.get(`${API}/health`);
    expect(resp.ok()).toBeTruthy();
    expect(await resp.json()).toEqual({ status: "ok" });
  });

  test("OpenAPI schema is accessible", async ({ request }) => {
    const resp = await request.get(`${API}/openapi.json`);
    expect(resp.ok()).toBeTruthy();
    const schema = await resp.json();
    expect(schema.info.title).toBe("Splitwise Multi-Currency API");
  });
});

test.describe.serial("API: Full Lifecycle", () => {
  let token: string;
  let userId: string;
  let groupId: string;

  test("register user", async ({ request }) => {
    const ts = Date.now();
    const resp = await request.post(`${API}/auth/register`, {
      data: {
        username: `api_user_${ts}`,
        email: `api_${ts}@test.com`,
        password: "securepass123",
        display_name: "API Tester",
      },
    });
    expect(resp.status()).toBe(201);
    const data = await resp.json();
    token = data.access_token;
    userId = data.user.id;
    expect(token).toBeTruthy();
    expect(data.user.display_name).toBe("API Tester");
  });

  test("create group", async ({ request }) => {
    const resp = await request.post(`${API}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: "API Test Group",
        group_type: "trip",
        target_currency: "EUR",
        trip_start_date: "2024-06-01",
        trip_end_date: "2024-06-15",
      },
    });
    expect(resp.status()).toBe(201);
    const data = await resp.json();
    groupId = data.id;
    expect(data.name).toBe("API Test Group");
    expect(data.target_currency).toBe("EUR");
    expect(data.members).toHaveLength(1);
    expect(data.members[0].role).toBe("admin");
  });

  test("list groups returns created group", async ({ request }) => {
    const resp = await request.get(`${API}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(resp.ok()).toBeTruthy();
    const groups = await resp.json();
    expect(groups.length).toBeGreaterThanOrEqual(1);
    expect(groups.some((g: { name: string }) => g.name === "API Test Group")).toBeTruthy();
  });

  test("add expense to group", async ({ request }) => {
    const resp = await request.post(`${API}/groups/${groupId}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        description: "API Dinner",
        amount: "120.50",
        currency: "USD",
      },
    });
    expect(resp.status()).toBe(201);
    const data = await resp.json();
    expect(data.description).toBe("API Dinner");
    expect(parseFloat(data.amount)).toBe(120.5);
    expect(data.splits).toHaveLength(1); // Only 1 member
  });

  test("add second expense", async ({ request }) => {
    const resp = await request.post(`${API}/groups/${groupId}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        description: "API Museum",
        amount: "35.00",
        currency: "GBP",
        category: "entertainment",
      },
    });
    expect(resp.status()).toBe(201);
    expect((await resp.json()).category).toBe("entertainment");
  });

  test("list expenses returns both", async ({ request }) => {
    const resp = await request.get(`${API}/groups/${groupId}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(resp.ok()).toBeTruthy();
    const expenses = await resp.json();
    expect(expenses).toHaveLength(2);
  });

  test("get balances", async ({ request }) => {
    const resp = await request.get(`${API}/groups/${groupId}/balances`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(resp.ok()).toBeTruthy();
    const balances = await resp.json();
    // Single user → balance should be ~0
    for (const b of balances) {
      expect(Math.abs(parseFloat(b.balance))).toBeLessThan(0.01);
    }
  });

  test("get simplified debts (empty for single user)", async ({ request }) => {
    const resp = await request.get(`${API}/groups/${groupId}/debts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(resp.ok()).toBeTruthy();
    expect(await resp.json()).toEqual([]);
  });

  test("get group activities", async ({ request }) => {
    const resp = await request.get(`${API}/groups/${groupId}/activities`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(resp.ok()).toBeTruthy();
    const activities = await resp.json();
    expect(activities.length).toBeGreaterThanOrEqual(2);
    const types = activities.map((a: { activity_type: string }) => a.activity_type);
    expect(types).toContain("group_created");
    expect(types).toContain("expense_created");
  });

  test("get user activity feed", async ({ request }) => {
    const resp = await request.get(`${API}/activities`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(resp.ok()).toBeTruthy();
    const activities = await resp.json();
    expect(activities.length).toBeGreaterThanOrEqual(1);
  });

  test("update group", async ({ request }) => {
    const resp = await request.patch(`${API}/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: "Renamed Group" },
    });
    expect(resp.ok()).toBeTruthy();
    expect((await resp.json()).name).toBe("Renamed Group");
  });

  test("unauthenticated request is rejected", async ({ request }) => {
    const resp = await request.get(`${API}/groups`);
    expect(resp.status()).toBe(403);
  });

  test("invalid token is rejected", async ({ request }) => {
    const resp = await request.get(`${API}/groups`, {
      headers: { Authorization: "Bearer invalid.token.here" },
    });
    expect(resp.status()).toBe(401);
  });
});
