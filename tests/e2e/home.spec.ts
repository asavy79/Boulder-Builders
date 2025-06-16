import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000");
    });

    test("displays main hero section content", async ({ page }) => {
        await expect(page.getByText("Where Boulder's Builders Connect")).toBeVisible();
        await expect(page.getByText("Join a thriving community of developers, creators, and tech enthusiasts in Boulder.")).toBeVisible();
        await expect(page.getByRole("button", { name: "Join the Community" })).toBeVisible();
    });

    test("displays features section with all cards", async ({ page }) => {
        await expect(page.getByText("Everything You Need to Connect & Grow")).toBeVisible();

        // Check all feature cards
        await expect(page.getByText("Share Projects")).toBeVisible();
        await expect(page.getByText("Collaborate")).toBeVisible();
        await expect(page.getByText("Learn Together")).toBeVisible();
        await expect(page.getByText("Build Streaks")).toBeVisible();
    });

    test("displays CTA section", async ({ page }) => {
        await expect(page.getByText("Ready to Join Boulder's Tech Community?")).toBeVisible();
        await expect(page.getByText("Connect with local developers, share your projects, and be part of something bigger.")).toBeVisible();
        await expect(page.getByRole("button", { name: "Get Started Now" })).toBeVisible();
    });

    test("buttons are clickable", async ({ page }) => {
        const joinButton = page.getByRole("button", { name: "Join the Community" });
        const getStartedButton = page.getByRole("button", { name: "Get Started Now" });

        await expect(joinButton).toBeEnabled();
        await expect(getStartedButton).toBeEnabled();
    });

    test("feature cards have correct content", async ({ page }) => {
        // Check Share Projects card
        await expect(page.getByText("Showcase your latest builds and get feedback from fellow developers")).toBeVisible();

        // Check Collaborate card
        await expect(page.getByText("Find partners for your next project through our messaging system")).toBeVisible();

        // Check Learn Together card
        await expect(page.getByText("Share and discover new skills with the Boulder tech community")).toBeVisible();

        // Check Build Streaks card
        await expect(page.getByText("Stay motivated with daily sharing and learning streaks")).toBeVisible();
    });
});