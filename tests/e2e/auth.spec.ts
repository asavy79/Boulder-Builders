import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { signIn } from "./utils";

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });


test.describe("Authentication", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000");
    });

    test("sign in flow", async ({ page }) => {
        await signIn(page);
    });

    test("sign in with invalid credentials", async ({ page }) => {
        await page.getByRole("link", { name: "Join the Community" }).click();
        await expect(page).toHaveURL(/.*sign-in/);

        await page.waitForSelector('input[name="email"]');

        await page.getByPlaceholder("you@example.com").fill("invalid@example.com");
        await page.getByPlaceholder("Your password").fill("invalidpassword");

        await page.getByText("Sign In", { exact: true }).click();

        await expect(page.getByText("Invalid credentials")).toBeVisible();
    });

}); 