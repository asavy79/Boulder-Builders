import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000");
    });

    // test("displays main hero section content", async ({ page }) => {
    //     await expect(page.getByText("Where Boulder's Builders Connect")).toBeVisible();
    //     await expect(page.getByText("Join a thriving community of developers, creators, and tech enthusiasts in Boulder.")).toBeVisible();
    //     await expect(page.getByRole("button", { name: "Join the Community" })).toBeVisible();
    // });



});