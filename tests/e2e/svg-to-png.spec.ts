import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('SVG to PNG Conversion Tool E2E', () => {
  const sampleSvgPath = path.join(process.cwd(), 'tests/fixtures/sample.svg');
  const unsafeScriptSvgPath = path.join(process.cwd(), 'tests/fixtures/unsafe-script.svg');

  test('should load /tools/svg-to-png, upload SVG, rasterize to PNG, and download', async ({ page }) => {
    // 1. Open /tools/svg-to-png
    await page.goto('/tools/svg-to-png');
    await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });
    await expect(page).toHaveTitle(/Convert SVG to PNG/i);
    await expect(page.locator('h1')).toHaveText('Convert SVG to PNG');

    // 2. Upload valid SVG file
    const fileInput = page.locator('#svg-file-input');
    await fileInput.setInputFiles(sampleSvgPath);

    // 3. Verify selected file appears in list
    await expect(page.getByText('sample.svg')).toBeVisible();

    // 4. Click Convert to PNG
    const convertBtn = page.getByRole('button', { name: /Convert to PNG/i });
    await expect(convertBtn).toBeEnabled();
    await convertBtn.click();

    // 5. Verify conversion completes
    await expect(page.getByText('Converted', { exact: true })).toBeVisible({ timeout: 15000 });

    // 6. Verify single download button appears
    const downloadBtn = page.getByRole('button', { name: /Download/i });
    await expect(downloadBtn).toBeVisible();

    // 7. Verify download triggers with .png extension
    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('sample.png');
  });

  test('should reject unsafe SVG containing script tags', async ({ page }) => {
    await page.goto('/tools/svg-to-png');
    await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });

    const fileInput = page.locator('#svg-file-input');
    await fileInput.setInputFiles(unsafeScriptSvgPath);

    await expect(page.getByText('unsafe-script.svg')).toBeVisible();
    await expect(page.getByText(/unsupported or unsafe content/i)).toBeVisible({ timeout: 5000 });
  });
});
