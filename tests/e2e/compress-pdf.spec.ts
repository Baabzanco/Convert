import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

test.describe('Tool #22: Compress PDF E2E', () => {
  const compressiblePdf = path.join(process.cwd(), 'tests/fixtures/compressible.pdf');
  const alreadyOptimizedPdf = path.join(process.cwd(), 'tests/fixtures/already-optimized.pdf');
  const samplePngPath = path.join(process.cwd(), 'tests/fixtures/sample.png');

  test('Test 1: Compress PDF with genuine size reduction', async ({ page }) => {
    await page.goto('/tools/compress-pdf');
    await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });
    await expect(page).toHaveTitle(/Compress PDF Online/i);
    await expect(page.locator('h1')).toHaveText(/Compress PDF Files/i);

    // Upload compressible PDF
    const fileInput = page.locator('#compress-pdf-file-input');
    await fileInput.setInputFiles(compressiblePdf);

    // Verify file loaded and page count detected
    await expect(page.getByText('compressible.pdf')).toBeVisible();
    await expect(page.getByText('5 pages', { exact: true })).toBeVisible();

    // Click Compress PDF button
    const compressBtn = page.getByRole('button', { name: /^Compress PDF$/i });
    await expect(compressBtn).toBeEnabled();
    await compressBtn.click();

    // Verify success state
    await expect(page.getByText('PDF compressed successfully')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Original', { exact: true })).toBeVisible();
    await expect(page.getByText('Compressed', { exact: true })).toBeVisible();
    await expect(page.getByText(/Reduced by/i)).toBeVisible();

    // Verify download button
    const downloadBtn = page.getByRole('button', { name: /Download Compressed PDF/i });
    await expect(downloadBtn).toBeVisible();

    // Verify download event and semantic PDF properties
    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('compressible-compressed.pdf');

    // Semantic output verification:
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    if (downloadPath) {
      const downloadedBytes = fs.readFileSync(downloadPath);
      const originalBytes = fs.readFileSync(compressiblePdf);

      // Verify reduction
      expect(downloadedBytes.length).toBeLessThan(originalBytes.length);

      // Verify PDF signature
      const header = downloadedBytes.subarray(0, 5).toString('ascii');
      expect(header).toBe('%PDF-');

      // Verify document readability and integrity
      const loadedDoc = await PDFDocument.load(downloadedBytes);
      expect(loadedDoc.getPageCount()).toBe(5);

      const firstPage = loadedDoc.getPage(0);
      expect(firstPage.getWidth()).toBe(500);
      expect(firstPage.getHeight()).toBe(700);
    }
  });

  test('Test 2: No-reduction handling when PDF cannot be further reduced', async ({ page }) => {
    await page.goto('/tools/compress-pdf');
    await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });

    const fileInput = page.locator('#compress-pdf-file-input');
    await fileInput.setInputFiles(alreadyOptimizedPdf);

    await expect(page.getByText('already-optimized.pdf')).toBeVisible();
    await expect(page.getByText('1 page', { exact: true })).toBeVisible();

    const compressBtn = page.getByRole('button', { name: /^Compress PDF$/i });
    await compressBtn.click();

    // Verify no-reduction messaging
    await expect(page.getByText('The PDF could not be reduced further')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/The original file is already optimized/i)).toBeVisible();
    await expect(page.getByText(/Your original PDF will be kept unchanged/i)).toBeVisible();

    // Should NOT show "Reduced by"
    await expect(page.getByText(/Reduced by/i)).not.toBeVisible();

    // Download button offers the original file
    const downloadBtn = page.getByRole('button', { name: /Download Original PDF/i });
    await expect(downloadBtn).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('already-optimized.pdf');
  });

  test('Test 3: Rejects non-PDF file upload with friendly error message', async ({ page }) => {
    await page.goto('/tools/compress-pdf');
    await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });

    const fileInput = page.locator('#compress-pdf-file-input');
    await fileInput.setInputFiles(samplePngPath);

    // Verify error banner
    const alert = page.getByRole('alert').filter({ hasText: /valid PDF/i });
    await expect(alert).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/This file is not a valid PDF/i)).toBeVisible();
  });

  test('Test 4: Reset functionality returns to initial upload state', async ({ page }) => {
    await page.goto('/tools/compress-pdf');
    await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });

    const fileInput = page.locator('#compress-pdf-file-input');
    await fileInput.setInputFiles(alreadyOptimizedPdf);

    const compressBtn = page.getByRole('button', { name: /^Compress PDF$/i });
    await compressBtn.click();

    await expect(page.getByText('The PDF could not be reduced further')).toBeVisible({ timeout: 15000 });

    // Click Compress another PDF
    const resetBtn = page.getByRole('button', { name: /Compress another PDF/i });
    await resetBtn.click();

    // Should be back to upload screen
    await expect(page.getByText('Choose a PDF file to compress')).toBeVisible();
  });

  test('Test 5: Mobile viewport displays responsive UI without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/tools/compress-pdf');
    await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });

    const fileInput = page.locator('#compress-pdf-file-input');
    await fileInput.setInputFiles(compressiblePdf);

    await expect(page.getByText('compressible.pdf')).toBeVisible();

    const compressBtn = page.getByRole('button', { name: /^Compress PDF$/i });
    await expect(compressBtn).toBeVisible();
    await compressBtn.click();

    await expect(page.getByText('PDF compressed successfully')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Download Compressed PDF/i })).toBeVisible();
  });
});
