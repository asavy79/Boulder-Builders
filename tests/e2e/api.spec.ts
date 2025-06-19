import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { signIn } from "./utils";

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

test.describe("API", () => {

    test("test unauthenticated user cannot access protected routes", async ({ page }) => {
        const response = await page.request.get("http://localhost:3000/api/posts");
        expect(response.status()).toBe(401);
    });

    test("test authenticated user can access protected routes", async ({ page }) => {
        await signIn(page);

        const response = await page.request.get("http://localhost:3000/api/posts");
        expect(response.status()).toBe(200);
    });

    test("test user can not delete a post that they did not create", async ({ page }) => {
        await signIn(page);
        const response = await page.request.delete("http://localhost:3000/api/posts/c36a8775-5535-47b8-b9b5-4a65d664fe06");
        expect(response.status()).toBe(500);
    });

});