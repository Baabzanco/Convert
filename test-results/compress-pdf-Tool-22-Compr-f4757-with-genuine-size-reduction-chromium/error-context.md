# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: compress-pdf.spec.ts >> Tool #22: Compress PDF E2E >> Test 1: Compress PDF with genuine size reduction
- Location: tests/e2e/compress-pdf.spec.ts:9:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Original')
Expected: visible
Error: strict mode violation: getByText('Original') resolved to 5 elements:
    1) <p class="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-1">Original</p> aka getByText('Original', { exact: true })
    2) <p class="text-sm text-[#667085] leading-relaxed">Review the original and resulting file sizes with…</p> aka getByText('Review the original and')
    3) <p class="text-sm text-[#667085] leading-relaxed">Save the optimized PDF file or keep your original…</p> aka getByText('Save the optimized PDF file')
    4) <p class="text-sm text-[#667085] leading-relaxed">Your PDF pages are never converted to raster imag…</p> aka getByText('Your PDF pages are never')
    5) <p>No. Some PDFs are already optimized. If the gener…</p> aka getByText('No. Some PDFs are already')

Call log:
  - Expect "toBeVisible" getByText('Original') with timeout 5000ms
  - waiting for getByText('Original')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e5]:
      - link "Free Online File Tools Home" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e12]: FileTools
      - navigation "Main Navigation" [ref=e13]:
        - link "Image Tools" [ref=e14] [cursor=pointer]:
          - /url: /image-tools
        - link "PDF Tools" [ref=e15] [cursor=pointer]:
          - /url: /pdf-tools
        - link "Blog" [ref=e16] [cursor=pointer]:
          - /url: /blog
  - main [ref=e17]:
    - generic [ref=e19]:
      - navigation "Breadcrumb" [ref=e20]:
        - list [ref=e21]:
          - listitem [ref=e22]:
            - link "Home" [ref=e23] [cursor=pointer]:
              - /url: /
          - listitem [ref=e24]:
            - link "PDF Tools" [ref=e27] [cursor=pointer]:
              - /url: /pdf-tools
          - listitem [ref=e28]:
            - generic [ref=e31]: Compress PDF
      - generic [ref=e32]:
        - heading "Compress PDF Files" [level=1] [ref=e33]
        - paragraph [ref=e34]: Reduce PDF file size for free directly in your web browser. Benefit from safe structural optimization, zero file uploads to remote servers, and an honest size comparison that never makes false compression claims.
      - generic [ref=e38]:
        - generic [ref=e43]:
          - heading "PDF compressed successfully" [level=3] [ref=e44]
          - paragraph [ref=e45]: Your document has been optimized without loss of vector clarity.
        - generic [ref=e46]:
          - generic [ref=e47]:
            - paragraph [ref=e48]: Original
            - paragraph [ref=e49]: 5.06 KB
          - generic [ref=e50]:
            - paragraph [ref=e51]: Compressed
            - paragraph [ref=e52]: 3.37 KB
          - generic [ref=e53]:
            - paragraph [ref=e54]: Reduced by
            - generic [ref=e55]: 33.4%
        - generic [ref=e59]:
          - button "Download Compressed PDF" [ref=e60]
          - button "Compress another PDF" [ref=e65]
      - generic "Advertisement space" [ref=e72]:
        - generic [ref=e73]:
          - generic [ref=e74]: Advertisement
          - generic [ref=e75]: Space reserved to eliminate layout shift
      - region [ref=e76]:
        - heading "How to Use Compress PDF" [level=2] [ref=e77]
        - generic [ref=e78]:
          - generic [ref=e79]:
            - generic [ref=e80]: "1"
            - heading "Upload your PDF" [level=3] [ref=e81]
            - paragraph [ref=e82]: Drag and drop or select your PDF file (up to 100 MB).
          - generic [ref=e83]:
            - generic [ref=e84]: "2"
            - heading "Start the compression" [level=3] [ref=e85]
            - paragraph [ref=e86]: Click Compress PDF to run safe client-side structural optimization.
          - generic [ref=e87]:
            - generic [ref=e88]: "3"
            - heading "Compare file sizes" [level=3] [ref=e89]
            - paragraph [ref=e90]: Review the original and resulting file sizes with transparent reduction metrics.
          - generic [ref=e91]:
            - generic [ref=e92]: "4"
            - heading "Download your PDF" [level=3] [ref=e93]
            - paragraph [ref=e94]: Save the optimized PDF file or keep your original document unchanged.
      - region [ref=e95]:
        - heading "Why Use Our Compress PDF" [level=2] [ref=e96]
        - generic [ref=e97]:
          - generic [ref=e98]:
            - heading "Safe Structural Optimization" [level=3] [ref=e103]
            - paragraph [ref=e104]: Removes redundant indirect objects and compresses streams without degrading vector typography or images.
          - generic [ref=e105]:
            - heading "No Rasterization Guarantee" [level=3] [ref=e110]
            - paragraph [ref=e111]: Your PDF pages are never converted to raster images, preserving crystal-clear searchable text and original page layout.
          - generic [ref=e112]:
            - heading "Honest Size Comparison" [level=3] [ref=e116]
            - paragraph [ref=e117]: The tool compares exact byte sizes and only reports compression when the resulting file is genuinely smaller.
          - generic [ref=e118]:
            - heading "100% Client-Side Privacy" [level=3] [ref=e123]
            - paragraph [ref=e124]: Your documents never leave your computer. All processing runs locally in your browser.
          - generic [ref=e125]:
            - heading "No Account Required" [level=3] [ref=e130]
            - paragraph [ref=e131]: Free to use with no registrations, no watermarks, and no usage limits.
      - region [ref=e133]:
        - heading "Frequently Asked Questions about Compress PDF" [level=2] [ref=e135]
        - generic [ref=e136]:
          - generic [ref=e137]:
            - heading [level=3] [ref=e138]:
              - button "Does Compress PDF always make a PDF smaller?" [expanded] [ref=e139]
            - region "Does Compress PDF always make a PDF smaller?" [ref=e143]:
              - paragraph [ref=e144]: No. Some PDFs are already optimized. If the generated file is not smaller, the tool keeps the original file instead.
          - heading [level=3] [ref=e146]:
            - button "Will compression reduce PDF quality?" [ref=e147]
          - heading [level=3] [ref=e152]:
            - button "Is Compress PDF free?" [ref=e153]
          - heading [level=3] [ref=e158]:
            - button "Are my PDFs uploaded to a server?" [ref=e159]
      - region [ref=e164]:
        - generic [ref=e165]:
          - heading "Related File Tools" [level=2] [ref=e166]
          - paragraph [ref=e167]: Explore complementary tools for your workflow.
        - generic [ref=e168]:
          - link "Client-side Merge PDF Combine multiple PDF files into one document for free online. Reorder your PDFs, combine them in your chosen order, and download the merged PDF directly in your browser without uploading files to a server. Use Tool" [ref=e169] [cursor=pointer]:
            - /url: /tools/merge-pdf
            - generic [ref=e170]:
              - generic [ref=e171]: Client-side
              - heading "Merge PDF" [level=3] [ref=e180]
              - paragraph [ref=e181]: Combine multiple PDF files into one document for free online. Reorder your PDFs, combine them in your chosen order, and download the merged PDF directly in your browser without uploading files to a server.
            - generic [ref=e182]: Use Tool
          - link "Client-side Split PDF Split PDF files into individual single-page documents, extract specific pages, or divide documents by custom page ranges. Fast, secure, and 100% browser-based with zero file uploads. Use Tool" [ref=e186] [cursor=pointer]:
            - /url: /tools/split-pdf
            - generic [ref=e187]:
              - generic [ref=e188]: Client-side
              - heading "Split PDF" [level=3] [ref=e197]
              - paragraph [ref=e198]: Split PDF files into individual single-page documents, extract specific pages, or divide documents by custom page ranges. Fast, secure, and 100% browser-based with zero file uploads.
            - generic [ref=e199]: Use Tool
          - link "Client-side PDF to JPG Convert PDF pages into high-resolution JPG images. Select specific pages or convert the entire document, configure quality and scale, and download your images individually or as a ZIP archive. Use Tool" [ref=e203] [cursor=pointer]:
            - /url: /tools/pdf-to-jpg
            - generic [ref=e204]:
              - generic [ref=e205]: Client-side
              - heading "PDF to JPG" [level=3] [ref=e214]
              - paragraph [ref=e215]: Convert PDF pages into high-resolution JPG images. Select specific pages or convert the entire document, configure quality and scale, and download your images individually or as a ZIP archive.
            - generic [ref=e216]: Use Tool
          - link "Client-side PDF to PNG Convert PDF pages into crisp, lossless PNG images online. Select specific pages or extract the entire document, configure output resolution scale, and download your PNG files directly in your browser without uploading files to a server. Use Tool" [ref=e220] [cursor=pointer]:
            - /url: /tools/pdf-to-png
            - generic [ref=e221]:
              - generic [ref=e222]: Client-side
              - heading "PDF to PNG" [level=3] [ref=e231]
              - paragraph [ref=e232]: Convert PDF pages into crisp, lossless PNG images online. Select specific pages or extract the entire document, configure output resolution scale, and download your PNG files directly in your browser without uploading files to a server.
            - generic [ref=e233]: Use Tool
          - link "Client-side Image to PDF Convert JPG, PNG, and WebP images into a clean, paginated PDF document. Reorder pages, customize orientation, and combine multiple photos securely without server uploads. Use Tool" [ref=e237] [cursor=pointer]:
            - /url: /tools/image-to-pdf
            - generic [ref=e238]:
              - generic [ref=e239]: Client-side
              - heading "Image to PDF" [level=3] [ref=e249]
              - paragraph [ref=e250]: Convert JPG, PNG, and WebP images into a clean, paginated PDF document. Reorder pages, customize orientation, and combine multiple photos securely without server uploads.
            - generic [ref=e251]: Use Tool
          - link "Client-side JPG to PDF Convert JPG and JPEG images into a clean, paginated PDF document. Combine multiple photos, arrange page order, and generate professional PDFs directly in your browser for free without uploading files to a server. Use Tool" [ref=e255] [cursor=pointer]:
            - /url: /tools/jpg-to-pdf
            - generic [ref=e256]:
              - generic [ref=e257]: Client-side
              - heading "JPG to PDF" [level=3] [ref=e267]
              - paragraph [ref=e268]: Convert JPG and JPEG images into a clean, paginated PDF document. Combine multiple photos, arrange page order, and generate professional PDFs directly in your browser for free without uploading files to a server.
            - generic [ref=e269]: Use Tool
          - link "Client-side PNG to PDF Convert PNG images into a clean, paginated PDF document. Combine multiple graphics, screenshots, or transparent logos into one document directly in your browser without uploading files to a server. Use Tool" [ref=e273] [cursor=pointer]:
            - /url: /tools/png-to-pdf
            - generic [ref=e274]:
              - generic [ref=e275]: Client-side
              - heading "PNG to PDF" [level=3] [ref=e285]
              - paragraph [ref=e286]: Convert PNG images into a clean, paginated PDF document. Combine multiple graphics, screenshots, or transparent logos into one document directly in your browser without uploading files to a server.
            - generic [ref=e287]: Use Tool
  - contentinfo [ref=e291]:
    - generic [ref=e292]:
      - generic [ref=e293]:
        - generic [ref=e294]:
          - link "FileTools Home" [ref=e295] [cursor=pointer]:
            - /url: /
            - generic [ref=e301]: FileTools
          - paragraph [ref=e302]: Fast, privacy-focused image and PDF utility tools. Process files safely in your browser without registration or uploads.
        - generic [ref=e303]:
          - heading "Tools & Converters" [level=3] [ref=e304]
          - list [ref=e305]:
            - listitem [ref=e306]:
              - link "Image Tools" [ref=e307] [cursor=pointer]:
                - /url: /image-tools
            - listitem [ref=e308]:
              - link "PDF Tools" [ref=e309] [cursor=pointer]:
                - /url: /pdf-tools
            - listitem [ref=e310]:
              - link "JPG to PNG" [ref=e311] [cursor=pointer]:
                - /url: /tools/jpg-to-png
            - listitem [ref=e312]:
              - link "Compress Image" [ref=e313] [cursor=pointer]:
                - /url: /tools/compress-image
            - listitem [ref=e314]:
              - link "Merge PDF" [ref=e315] [cursor=pointer]:
                - /url: /tools/merge-pdf
        - generic [ref=e316]:
          - heading "Formats & Guides" [level=3] [ref=e317]
          - list [ref=e318]:
            - listitem [ref=e319]:
              - link "JPG Format Guide" [ref=e320] [cursor=pointer]:
                - /url: /formats/jpg
            - listitem [ref=e321]:
              - link "PNG Format Guide" [ref=e322] [cursor=pointer]:
                - /url: /formats/png
            - listitem [ref=e323]:
              - link "WEBP Format Guide" [ref=e324] [cursor=pointer]:
                - /url: /formats/webp
            - listitem [ref=e325]:
              - link "PDF Format Guide" [ref=e326] [cursor=pointer]:
                - /url: /formats/pdf
            - listitem [ref=e327]:
              - link "Blog & Tutorials" [ref=e328] [cursor=pointer]:
                - /url: /blog
        - generic [ref=e329]:
          - heading "About & Legal" [level=3] [ref=e330]
          - list [ref=e331]:
            - listitem [ref=e332]:
              - link "About Us" [ref=e333] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e334]:
              - link "Privacy Policy" [ref=e335] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e336]:
              - link "Terms of Service" [ref=e337] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e338]:
              - link "Contact" [ref=e339] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e340]:
        - paragraph [ref=e341]: © 2026 FileTools. Free online file utility service. All rights reserved.
        - paragraph [ref=e342]: Client-side processing • 100% Free • No registration
  - button "Open Next.js Dev Tools" [ref=e348] [cursor=pointer]
  - alert [ref=e352]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import path from 'path';
  3   | 
  4   | test.describe('Tool #22: Compress PDF E2E', () => {
  5   |   const compressiblePdf = path.join(process.cwd(), 'tests/fixtures/compressible.pdf');
  6   |   const alreadyOptimizedPdf = path.join(process.cwd(), 'tests/fixtures/already-optimized.pdf');
  7   |   const samplePngPath = path.join(process.cwd(), 'tests/fixtures/sample.png');
  8   | 
  9   |   test('Test 1: Compress PDF with genuine size reduction', async ({ page }) => {
  10  |     await page.goto('/tools/compress-pdf');
  11  |     await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });
  12  |     await expect(page).toHaveTitle(/Compress PDF Online/i);
  13  |     await expect(page.locator('h1')).toHaveText(/Compress PDF Files/i);
  14  | 
  15  |     // Upload compressible PDF
  16  |     const fileInput = page.locator('#compress-pdf-file-input');
  17  |     await fileInput.setInputFiles(compressiblePdf);
  18  | 
  19  |     // Verify file loaded and page count detected
  20  |     await expect(page.getByText('compressible.pdf')).toBeVisible();
  21  |     await expect(page.getByText('5 pages', { exact: true })).toBeVisible();
  22  | 
  23  |     // Click Compress PDF button
  24  |     const compressBtn = page.getByRole('button', { name: /^Compress PDF$/i });
  25  |     await expect(compressBtn).toBeEnabled();
  26  |     await compressBtn.click();
  27  | 
  28  |     // Verify success state
  29  |     await expect(page.getByText('PDF compressed successfully')).toBeVisible({ timeout: 15000 });
> 30  |     await expect(page.getByText('Original')).toBeVisible();
      |                                              ^ Error: expect(locator).toBeVisible() failed
  31  |     await expect(page.getByText('Compressed')).toBeVisible();
  32  |     await expect(page.getByText(/Reduced by/i)).toBeVisible();
  33  | 
  34  |     // Verify download button
  35  |     const downloadBtn = page.getByRole('button', { name: /Download Compressed PDF/i });
  36  |     await expect(downloadBtn).toBeVisible();
  37  | 
  38  |     // Verify download event
  39  |     const downloadPromise = page.waitForEvent('download');
  40  |     await downloadBtn.click();
  41  |     const download = await downloadPromise;
  42  |     expect(download.suggestedFilename()).toBe('compressible-compressed.pdf');
  43  |   });
  44  | 
  45  |   test('Test 2: No-reduction handling when PDF cannot be further reduced', async ({ page }) => {
  46  |     await page.goto('/tools/compress-pdf');
  47  |     await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });
  48  | 
  49  |     const fileInput = page.locator('#compress-pdf-file-input');
  50  |     await fileInput.setInputFiles(alreadyOptimizedPdf);
  51  | 
  52  |     await expect(page.getByText('already-optimized.pdf')).toBeVisible();
  53  |     await expect(page.getByText('1 page', { exact: true })).toBeVisible();
  54  | 
  55  |     const compressBtn = page.getByRole('button', { name: /^Compress PDF$/i });
  56  |     await compressBtn.click();
  57  | 
  58  |     // Verify no-reduction messaging
  59  |     await expect(page.getByText('The PDF could not be reduced further')).toBeVisible({ timeout: 15000 });
  60  |     await expect(page.getByText(/The original file is already optimized/i)).toBeVisible();
  61  |     await expect(page.getByText(/Your original PDF will be kept unchanged/i)).toBeVisible();
  62  | 
  63  |     // Should NOT show "Reduced by"
  64  |     await expect(page.getByText(/Reduced by/i)).not.toBeVisible();
  65  | 
  66  |     // Download button offers the original file
  67  |     const downloadBtn = page.getByRole('button', { name: /Download Original PDF/i });
  68  |     await expect(downloadBtn).toBeVisible();
  69  | 
  70  |     const downloadPromise = page.waitForEvent('download');
  71  |     await downloadBtn.click();
  72  |     const download = await downloadPromise;
  73  |     expect(download.suggestedFilename()).toBe('already-optimized.pdf');
  74  |   });
  75  | 
  76  |   test('Test 3: Rejects non-PDF file upload with friendly error message', async ({ page }) => {
  77  |     await page.goto('/tools/compress-pdf');
  78  |     await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });
  79  | 
  80  |     const fileInput = page.locator('#compress-pdf-file-input');
  81  |     await fileInput.setInputFiles(samplePngPath);
  82  | 
  83  |     // Verify error banner
  84  |     await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
  85  |     await expect(page.getByText(/This file is not a valid PDF/i)).toBeVisible();
  86  |   });
  87  | 
  88  |   test('Test 4: Reset functionality returns to initial upload state', async ({ page }) => {
  89  |     await page.goto('/tools/compress-pdf');
  90  |     await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });
  91  | 
  92  |     const fileInput = page.locator('#compress-pdf-file-input');
  93  |     await fileInput.setInputFiles(alreadyOptimizedPdf);
  94  | 
  95  |     const compressBtn = page.getByRole('button', { name: /^Compress PDF$/i });
  96  |     await compressBtn.click();
  97  | 
  98  |     await expect(page.getByText('The PDF could not be reduced further')).toBeVisible({ timeout: 15000 });
  99  | 
  100 |     // Click Compress another PDF
  101 |     const resetBtn = page.getByRole('button', { name: /Compress another PDF/i });
  102 |     await resetBtn.click();
  103 | 
  104 |     // Should be back to upload screen
  105 |     await expect(page.getByText('Choose a PDF file to compress')).toBeVisible();
  106 |   });
  107 | 
  108 |   test('Test 5: Mobile viewport displays responsive UI without horizontal overflow', async ({
  109 |     page,
  110 |   }) => {
  111 |     await page.setViewportSize({ width: 375, height: 667 });
  112 |     await page.goto('/tools/compress-pdf');
  113 |     await page.locator('[data-hydrated="true"]').waitFor({ timeout: 10000 });
  114 | 
  115 |     const fileInput = page.locator('#compress-pdf-file-input');
  116 |     await fileInput.setInputFiles(compressiblePdf);
  117 | 
  118 |     await expect(page.getByText('compressible.pdf')).toBeVisible();
  119 | 
  120 |     const compressBtn = page.getByRole('button', { name: /^Compress PDF$/i });
  121 |     await expect(compressBtn).toBeVisible();
  122 |     await compressBtn.click();
  123 | 
  124 |     await expect(page.getByText('PDF compressed successfully')).toBeVisible({ timeout: 15000 });
  125 |     await expect(page.getByRole('button', { name: /Download Compressed PDF/i })).toBeVisible();
  126 |   });
  127 | });
  128 | 
```