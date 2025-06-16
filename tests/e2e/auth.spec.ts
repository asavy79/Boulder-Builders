import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000");
    });

    test("sign in flow", async ({ page }) => {
        // Navigate to sign in page
        await page.getByRole("button", { name: "Join the Community" }).click();
        await expect(page).toHaveURL(/.*sign-in/);

        // Fill in sign in form
        await page.getByLabel("Email").fill("alex.savard20@icloud.com");
        await page.getByLabel("Password").fill("goober");
        await page.getByRole("button", { name: "Sign In" }).click();

        // After successful sign in, should be redirected to feed
        await expect(page).toHaveURL(/.*feed/);
    });

    test("sign in with invalid credentials", async ({ page }) => {
        // Navigate to sign in page
        await page.getByRole("button", { name: "Join the Community" }).click();
        await expect(page).toHaveURL(/.*sign-in/);

        // Fill in sign in form with invalid credentials
        await page.getByLabel("Email").fill("invalid@example.com");
        await page.getByLabel("Password").fill("wrongpassword");
        await page.getByRole("button", { name: "Sign In" }).click();

        // Should show error message
        await expect(page.getByText("Invalid credentials")).toBeVisible();
    });

    test("sign up flow", async ({ page }) => {
        // Navigate to sign up page
        await page.getByRole("button", { name: "Join the Community" }).click();
        await page.getByRole("link", { name: "Sign up" }).click();
        await expect(page).toHaveURL(/.*sign-up/);

        // Fill in sign up form
        await page.getByLabel("Email").fill("newuser@example.com");
        await page.getByLabel("Password").fill("newpassword123");
        await page.getByRole("button", { name: "Sign Up" }).click();

        // After successful sign up, should be redirected to feed
        await expect(page).toHaveURL(/.*feed/);
    });

    test("forgot password flow", async ({ page }) => {
        // Navigate to sign in page
        await page.getByRole("button", { name: "Join the Community" }).click();

        // Click forgot password link
        await page.getByRole("link", { name: "Forgot Password?" }).click();
        await expect(page).toHaveURL(/.*forgot-password/);

        // Fill in email for password reset
        await page.getByLabel("Email").fill("test@example.com");
        await page.getByRole("button", { name: "Reset Password" }).click();

        // Should show success message
        await expect(page.getByText(/Check your email/)).toBeVisible();
    });

    test("authenticated user can access protected routes", async ({ page }) => {
        // Sign in first
        await page.getByRole("button", { name: "Join the Community" }).click();
        await page.getByLabel("Email").fill("test@example.com");
        await page.getByLabel("Password").fill("password123");
        await page.getByRole("button", { name: "Sign In" }).click();

        // Try accessing protected routes
        await page.goto("http://localhost:3000/profile");
        await expect(page).toHaveURL(/.*profile/);

        await page.goto("http://localhost:3000/messages");
        await expect(page).toHaveURL(/.*messages/);
    });

    test("unauthenticated user is redirected from protected routes", async ({ page }) => {
        // Try accessing protected routes without signing in
        await page.goto("http://localhost:3000/profile");
        await expect(page).toHaveURL(/.*sign-in/);

        await page.goto("http://localhost:3000/messages");
        await expect(page).toHaveURL(/.*sign-in/);
    });

    test("sign out flow", async ({ page }) => {
        // Sign in first
        await page.getByRole("button", { name: "Join the Community" }).click();
        await page.getByLabel("Email").fill("test@example.com");
        await page.getByLabel("Password").fill("password123");
        await page.getByRole("button", { name: "Sign In" }).click();

        // Click sign out
        await page.getByRole("button", { name: "Sign Out" }).click();

        // Should be redirected to home page
        await expect(page).toHaveURL("http://localhost:3000");
    });
}); 