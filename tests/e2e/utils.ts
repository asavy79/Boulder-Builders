import { expect, Page } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

export const signIn = async (page: Page) => {
    await page.goto("http://localhost:3000/sign-in");
    await page.waitForSelector('input[name="email"]');
    await page.getByPlaceholder("you@example.com").fill(process.env.TEST_EMAIL!);
    await page.getByPlaceholder("Your password").fill(process.env.TEST_PASSWORD!);
    await page.getByText("Sign In", { exact: true }).click();
    await expect(page).toHaveURL(/.*feed/);
}

export const signOut = async (page: Page) => {
    await page.getByText("Sign Out", { exact: true }).click();
    await expect(page).toHaveURL(/.*sign-in/);
}