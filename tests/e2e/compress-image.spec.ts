import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Tool #11: Compress Image E2E', () => {
  const sampleJpgPath = path.join(process.cwd(), 'tests/fixtures/sample.jpg');
  const samplePngPath = path.join(process.cwd(), 'tests/fixtures/sample.png');
  const sampleWebpPath = path.join(process.cwd(), 'tests/fixtures/sample.webp');
  const animatedWebpPath = path.join(process.cwd(), 'tests/fixtures/animated.webp');
  const corruptedJpgPath = path.join(process.cwd(), 'tests/fixtures/corrupted.jpg');

  test('should load /tools/compress-image, adjust quality, upload JPG, compress and download', async ({ page }) => {
    // 1. Open /tools/compress-image
    await page.goto('/tools/compress-image');
    await expect(page).toHaveTitle(/Compress Image/i);
    await expect(page.locator('h1')).toHaveText(/Compress Images Online|Compress Image/i);

    // 2. Upload valid JPG file
    const fileInput = page.locator('#compress-file-input');
    await fileInput.setInputFiles(sampleJpgPath);

    // 3. Verify selected file appears in list with quality controls
    await expect(page.getByText('sample.jpg')).toBeVisible();
    await expect(page.locator('#compress-quality-slider')).toBeVisible();
    await expect(page.getByText('80%')).toBeVisible();

    // 4. Click Compress Image
    const compressBtn = page.locator('#compress-submit-btn');
    await expect(compressBtn).toBeEnabled();
    await compressBtn.click();

    // 5. Verify compression completes
    await expect(page.locator('#compress-download-btn-0')).toBeVisible({ timeout: 15000 });

    // 6. Verify download triggers with original filename and extension
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#compress-download-btn-0').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('sample.jpg');
  });

  test('should compress PNG with lossless optimization and preserve PNG format', async ({ page }) => {
    await page.goto('/tools/compress-image');

    const fileInput = page.locator('#compress-file-input');
    await fileInput.setInputFiles(samplePngPath);

    await expect(page.getByText('sample.png')).toBeVisible();

    const compressBtn = page.locator('#compress-submit-btn');
    await expect(compressBtn).toBeEnabled();
    await compressBtn.click();

    await expect(page.locator('#compress-download-btn-0')).toBeVisible({ timeout: 15000 });

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#compress-download-btn-0').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('sample.png');
  });

  test('should reject animated WebP files with clear error message', async ({ page }) => {
    await page.goto('/tools/compress-image');

    const fileInput = page.locator('#compress-file-input');
    await fileInput.setInputFiles(animatedWebpPath);

    await expect(page.getByText('animated.webp')).toBeVisible();
    await expect(
      page.getByText('Animated WebP files are not supported by this compression tool.')
    ).toBeVisible({ timeout: 5000 });
  });

  test('should reject corrupted JPG file with error message', async ({ page }) => {
    await page.goto('/tools/compress-image');

    const fileInput = page.locator('#compress-file-input');
    await fileInput.setInputFiles(corruptedJpgPath);

    await expect(page.getByText('corrupted.jpg')).toBeVisible();
    await expect(page.getByText(/not a valid JPEG image|not a valid image/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('should support batch compression and ZIP download', async ({ page }) => {
    await page.goto('/tools/compress-image');

    const fileInput = page.locator('#compress-file-input');
    await fileInput.setInputFiles([sampleJpgPath, sampleWebpPath]);

    await expect(page.getByText('sample.jpg')).toBeVisible();
    await expect(page.getByText('sample.webp')).toBeVisible();

    const compressBtn = page.locator('#compress-submit-btn');
    await compressBtn.click();

    await expect(page.locator('#compress-download-all-zip-btn')).toBeVisible({ timeout: 15000 });

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#compress-download-all-zip-btn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.zip$/i);
  });
});
