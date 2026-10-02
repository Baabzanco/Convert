import { test, expect } from '@playwright/test';

test.describe('Admin CMS Phase 04 — Blog CMS End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as Admin before running Blog CMS tests
    await page.goto('/admin/login');
    await page.locator('#admin-email').fill('admin@filetools.local');
    await page.locator('#admin-password').fill('AdminPassword123!');
    await page.getByRole('button', { name: /Sign in to Dashboard/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test('Test 1: Navigate to Blog Management directory and verify initial UI', async ({ page }) => {
    await page.goto('/admin/blog');
    await expect(page.locator('h1')).toHaveText(/Blog CMS Directory/i);
    await expect(page.getByRole('link', { name: /Create New Post/i })).toBeVisible();

    // Verify search and filter controls are visible
    await expect(page.locator('input[placeholder*="Search posts by title"]')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();
  });

  test('Test 2: Create a new draft article and verify draft isolation', async ({ page }) => {
    await page.goto('/admin/blog/new');
    await expect(page.locator('h1')).toHaveText(/Create New Blog Post/i);

    const testSlug = `e2e-test-draft-${Date.now().toString(36)}`;
    const testTitle = `E2E Test Draft Article ${Date.now()}`;

    // Fill Title and Slug
    await page.locator('#post-title').fill(testTitle);
    await page.locator('#post-slug').fill(testSlug);

    // Submit form
    await page.getByRole('button', { name: /Create & Open Editor/i }).click();

    // Verify redirected to editor
    await expect(page).toHaveURL(new RegExp(`/admin/blog/`), { timeout: 10000 });
    await expect(page.locator('h1')).toContainText(testTitle);

    // Draft Isolation: Visit public post URL — must return 404
    const response = await page.goto(`/blog/${testSlug}`);
    expect(response?.status()).toBe(404);
  });

  test('Test 3: Preview Draft displays draft banner and post details', async ({ page }) => {
    // Navigate to blog directory
    await page.goto('/admin/blog');

    // Create a new post specifically for preview test
    await page.getByRole('link', { name: /Create New Post/i }).click();
    const testSlug = `preview-test-${Date.now().toString(36)}`;
    const testTitle = `Preview Mode Test Post ${Date.now()}`;

    await page.locator('#post-title').fill(testTitle);
    await page.locator('#post-slug').fill(testSlug);
    await page.getByRole('button', { name: /Create & Open Editor/i }).click();

    await expect(page).toHaveURL(new RegExp(`/admin/blog/`), { timeout: 10000 });

    // Click Preview button
    await page.getByRole('link', { name: /Preview/i }).click();
    await expect(page).toHaveURL(new RegExp(`/admin/blog/.+/preview`), { timeout: 10000 });

    // Verify preview banner and title
    await expect(page.getByText(/Draft Preview Mode/i)).toBeVisible();
    await expect(page.locator('h1')).toHaveText(testTitle);
  });

  test('Test 4: Publish post, verify public site renders it, then unpublish', async ({ page }) => {
    // Handle browser confirm dialogs for publish/unpublish
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.goto('/admin/blog/new');
    const pubSlug = `published-e2e-${Date.now().toString(36)}`;
    const pubTitle = `Published Guide E2E ${Date.now()}`;

    await page.locator('#post-title').fill(pubTitle);
    await page.locator('#post-slug').fill(pubSlug);
    await page.getByRole('button', { name: /Create & Open Editor/i }).click();

    await expect(page).toHaveURL(new RegExp(`/admin/blog/`), { timeout: 10000 });
    await expect(page.locator('#post-title')).toHaveValue(pubTitle, { timeout: 10000 });

    // Click Publish button and wait for response
    const [publishRes] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/publish') && r.status() === 200),
      page.getByRole('button', { name: 'Publish', exact: true }).click(),
    ]);
    const pubData = await publishRes.json();
    const publishedSlug = pubData.post.slug;

    // Verify button text changed to Unpublish
    await expect(page.getByRole('button', { name: /Unpublish/i })).toBeVisible({ timeout: 10000 });

    // Public URL must now return 200 and display the title
    const res = await page.goto(`/blog/${publishedSlug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText(pubTitle);

    // Unpublish post
    await page.goto('/admin/blog');
    const postRow = page.locator('tbody tr').filter({ hasText: pubTitle });
    await expect(postRow).toBeVisible();

    // Click unpublish button in table row and wait for API response
    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/unpublish') && r.status() === 200),
      postRow.getByRole('button', { name: /Unpublish/i }).click(),
    ]);

    // After unpublishing, public URL should return 404
    const unpubRes = await page.goto(`/blog/${publishedSlug}`);
    expect(unpubRes?.status()).toBe(404);
  });
});
