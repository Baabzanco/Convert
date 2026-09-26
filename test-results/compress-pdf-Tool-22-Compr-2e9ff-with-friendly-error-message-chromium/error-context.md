# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: compress-pdf.spec.ts >> Tool #22: Compress PDF E2E >> Test 3: Rejects non-PDF file upload with friendly error message
- Location: tests/e2e/compress-pdf.spec.ts:76:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="alert"]')
Expected: visible
Error: strict mode violation: locator('[role="alert"]') resolved to 2 elements:
    1) <div role="alert" class="p-4 rounded-lg flex items-start gap-3 text-sm animate-fadeIn bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B]">…</div> aka getByText('This file is not a valid PDF. Please choose a valid PDF file.✕')
    2) <div role="alert" aria-live="assertive" id="__next-route-announcer__"></div> aka locator('[id="__next-route-announcer__"]')

Call log:
  - Expect "toBeVisible" locator('[role="alert"]') with timeout 10000ms
  - waiting for locator('[role="alert"]')

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
      - generic [ref=e36]:
        - alert [ref=e37]:
          - generic [ref=e40]: This file is not a valid PDF. Please choose a valid PDF file.
          - button "Dismiss message" [ref=e41]: ✕
        - button "Upload PDF file to compress" [ref=e42] [cursor=pointer]:
          - heading "Choose a PDF file to compress" [level=2] [ref=e47]
          - paragraph [ref=e48]: Drag and drop your document here, or browse your files
          - generic [ref=e49]:
            - generic [ref=e50]: "Maximum file size: 100 MB"
            - generic [ref=e51]: •
            - generic [ref=e52]: 1 PDF at a time
      - generic "Advertisement space" [ref=e53]:
        - generic [ref=e54]:
          - generic [ref=e55]: Advertisement
          - generic [ref=e56]: Space reserved to eliminate layout shift
      - region [ref=e57]:
        - heading "How to Use Compress PDF" [level=2] [ref=e58]
        - generic [ref=e59]:
          - generic [ref=e60]:
            - generic [ref=e61]: "1"
            - heading "Upload your PDF" [level=3] [ref=e62]
            - paragraph [ref=e63]: Drag and drop or select your PDF file (up to 100 MB).
          - generic [ref=e64]:
            - generic [ref=e65]: "2"
            - heading "Start the compression" [level=3] [ref=e66]
            - paragraph [ref=e67]: Click Compress PDF to run safe client-side structural optimization.
          - generic [ref=e68]:
            - generic [ref=e69]: "3"
            - heading "Compare file sizes" [level=3] [ref=e70]
            - paragraph [ref=e71]: Review the original and resulting file sizes with transparent reduction metrics.
          - generic [ref=e72]:
            - generic [ref=e73]: "4"
            - heading "Download your PDF" [level=3] [ref=e74]
            - paragraph [ref=e75]: Save the optimized PDF file or keep your original document unchanged.
      - region [ref=e76]:
        - heading "Why Use Our Compress PDF" [level=2] [ref=e77]
        - generic [ref=e78]:
          - generic [ref=e79]:
            - heading "Safe Structural Optimization" [level=3] [ref=e84]
            - paragraph [ref=e85]: Removes redundant indirect objects and compresses streams without degrading vector typography or images.
          - generic [ref=e86]:
            - heading "No Rasterization Guarantee" [level=3] [ref=e91]
            - paragraph [ref=e92]: Your PDF pages are never converted to raster images, preserving crystal-clear searchable text and original page layout.
          - generic [ref=e93]:
            - heading "Honest Size Comparison" [level=3] [ref=e97]
            - paragraph [ref=e98]: The tool compares exact byte sizes and only reports compression when the resulting file is genuinely smaller.
          - generic [ref=e99]:
            - heading "100% Client-Side Privacy" [level=3] [ref=e104]
            - paragraph [ref=e105]: Your documents never leave your computer. All processing runs locally in your browser.
          - generic [ref=e106]:
            - heading "No Account Required" [level=3] [ref=e111]
            - paragraph [ref=e112]: Free to use with no registrations, no watermarks, and no usage limits.
      - region [ref=e114]:
        - heading "Frequently Asked Questions about Compress PDF" [level=2] [ref=e116]
        - generic [ref=e117]:
          - generic [ref=e118]:
            - heading [level=3] [ref=e119]:
              - button "Does Compress PDF always make a PDF smaller?" [expanded] [ref=e120]
            - region "Does Compress PDF always make a PDF smaller?" [ref=e124]:
              - paragraph [ref=e125]: No. Some PDFs are already optimized. If the generated file is not smaller, the tool keeps the original file instead.
          - heading [level=3] [ref=e127]:
            - button "Will compression reduce PDF quality?" [ref=e128]
          - heading [level=3] [ref=e133]:
            - button "Is Compress PDF free?" [ref=e134]
          - heading [level=3] [ref=e139]:
            - button "Are my PDFs uploaded to a server?" [ref=e140]
      - region [ref=e145]:
        - generic [ref=e146]:
          - heading "Related File Tools" [level=2] [ref=e147]
          - paragraph [ref=e148]: Explore complementary tools for your workflow.
        - generic [ref=e149]:
          - link "Client-side Merge PDF Combine multiple PDF files into one document for free online. Reorder your PDFs, combine them in your chosen order, and download the merged PDF directly in your browser without uploading files to a server. Use Tool" [ref=e150] [cursor=pointer]:
            - /url: /tools/merge-pdf
            - generic [ref=e151]:
              - generic [ref=e152]: Client-side
              - heading "Merge PDF" [level=3] [ref=e161]
              - paragraph [ref=e162]: Combine multiple PDF files into one document for free online. Reorder your PDFs, combine them in your chosen order, and download the merged PDF directly in your browser without uploading files to a server.
            - generic [ref=e163]: Use Tool
          - link "Client-side Split PDF Split PDF files into individual single-page documents, extract specific pages, or divide documents by custom page ranges. Fast, secure, and 100% browser-based with zero file uploads. Use Tool" [ref=e167] [cursor=pointer]:
            - /url: /tools/split-pdf
            - generic [ref=e168]:
              - generic [ref=e169]: Client-side
              - heading "Split PDF" [level=3] [ref=e178]
              - paragraph [ref=e179]: Split PDF files into individual single-page documents, extract specific pages, or divide documents by custom page ranges. Fast, secure, and 100% browser-based with zero file uploads.
            - generic [ref=e180]: Use Tool
          - link "Client-side PDF to JPG Convert PDF pages into high-resolution JPG images. Select specific pages or convert the entire document, configure quality and scale, and download your images individually or as a ZIP archive. Use Tool" [ref=e184] [cursor=pointer]:
            - /url: /tools/pdf-to-jpg
            - generic [ref=e185]:
              - generic [ref=e186]: Client-side
              - heading "PDF to JPG" [level=3] [ref=e195]
              - paragraph [ref=e196]: Convert PDF pages into high-resolution JPG images. Select specific pages or convert the entire document, configure quality and scale, and download your images individually or as a ZIP archive.
            - generic [ref=e197]: Use Tool
          - link "Client-side PDF to PNG Convert PDF pages into crisp, lossless PNG images online. Select specific pages or extract the entire document, configure output resolution scale, and download your PNG files directly in your browser without uploading files to a server. Use Tool" [ref=e201] [cursor=pointer]:
            - /url: /tools/pdf-to-png
            - generic [ref=e202]:
              - generic [ref=e203]: Client-side
              - heading "PDF to PNG" [level=3] [ref=e212]
              - paragraph [ref=e213]: Convert PDF pages into crisp, lossless PNG images online. Select specific pages or extract the entire document, configure output resolution scale, and download your PNG files directly in your browser without uploading files to a server.
            - generic [ref=e214]: Use Tool
          - link "Client-side Image to PDF Convert JPG, PNG, and WebP images into a clean, paginated PDF document. Reorder pages, customize orientation, and combine multiple photos securely without server uploads. Use Tool" [ref=e218] [cursor=pointer]:
            - /url: /tools/image-to-pdf
            - generic [ref=e219]:
              - generic [ref=e220]: Client-side
              - heading "Image to PDF" [level=3] [ref=e230]
              - paragraph [ref=e231]: Convert JPG, PNG, and WebP images into a clean, paginated PDF document. Reorder pages, customize orientation, and combine multiple photos securely without server uploads.
            - generic [ref=e232]: Use Tool
          - link "Client-side JPG to PDF Convert JPG and JPEG images into a clean, paginated PDF document. Combine multiple photos, arrange page order, and generate professional PDFs directly in your browser for free without uploading files to a server. Use Tool" [ref=e236] [cursor=pointer]:
            - /url: /tools/jpg-to-pdf
            - generic [ref=e237]:
              - generic [ref=e238]: Client-side
              - heading "JPG to PDF" [level=3] [ref=e248]
              - paragraph [ref=e249]: Convert JPG and JPEG images into a clean, paginated PDF document. Combine multiple photos, arrange page order, and generate professional PDFs directly in your browser for free without uploading files to a server.
            - generic [ref=e250]: Use Tool
          - link "Client-side PNG to PDF Convert PNG images into a clean, paginated PDF document. Combine multiple graphics, screenshots, or transparent logos into one document directly in your browser without uploading files to a server. Use Tool" [ref=e254] [cursor=pointer]:
            - /url: /tools/png-to-pdf
            - generic [ref=e255]:
              - generic [ref=e256]: Client-side
              - heading "PNG to PDF" [level=3] [ref=e266]
              - paragraph [ref=e267]: Convert PNG images into a clean, paginated PDF document. Combine multiple graphics, screenshots, or transparent logos into one document directly in your browser without uploading files to a server.
            - generic [ref=e268]: Use Tool
  - contentinfo [ref=e272]:
    - generic [ref=e273]:
      - generic [ref=e274]:
        - generic [ref=e275]:
          - link "FileTools Home" [ref=e276] [cursor=pointer]:
            - /url: /
            - generic [ref=e282]: FileTools
          - paragraph [ref=e283]: Fast, privacy-focused image and PDF utility tools. Process files safely in your browser without registration or uploads.
        - generic [ref=e284]:
          - heading "Tools & Converters" [level=3] [ref=e285]
          - list [ref=e286]:
            - listitem [ref=e287]:
              - link "Image Tools" [ref=e288] [cursor=pointer]:
                - /url: /image-tools
            - listitem [ref=e289]:
              - link "PDF Tools" [ref=e290] [cursor=pointer]:
                - /url: /pdf-tools
            - listitem [ref=e291]:
              - link "JPG to PNG" [ref=e292] [cursor=pointer]:
                - /url: /tools/jpg-to-png
            - listitem [ref=e293]:
              - link "Compress Image" [ref=e294] [cursor=pointer]:
                - /url: /tools/compress-image
            - listitem [ref=e295]:
              - link "Merge PDF" [ref=e296] [cursor=pointer]:
                - /url: /tools/merge-pdf
        - generic [ref=e297]:
          - heading "Formats & Guides" [level=3] [ref=e298]
          - list [ref=e299]:
            - listitem [ref=e300]:
              - link "JPG Format Guide" [ref=e301] [cursor=pointer]:
                - /url: /formats/jpg
            - listitem [ref=e302]:
              - link "PNG Format Guide" [ref=e303] [cursor=pointer]:
                - /url: /formats/png
            - listitem [ref=e304]:
              - link "WEBP Format Guide" [ref=e305] [cursor=pointer]:
                - /url: /formats/webp
            - listitem [ref=e306]:
              - link "PDF Format Guide" [ref=e307] [cursor=pointer]:
                - /url: /formats/pdf
            - listitem [ref=e308]:
              - link "Blog & Tutorials" [ref=e309] [cursor=pointer]:
                - /url: /blog
        - generic [ref=e310]:
          - heading "About & Legal" [level=3] [ref=e311]
          - list [ref=e312]:
            - listitem [ref=e313]:
              - link "About Us" [ref=e314] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e315]:
              - link "Privacy Policy" [ref=e316] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e317]:
              - link "Terms of Service" [ref=e318] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e319]:
              - link "Contact" [ref=e320] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e321]:
        - paragraph [ref=e322]: © 2026 FileTools. Free online file utility service. All rights reserved.
        - paragraph [ref=e323]: Client-side processing • 100% Free • No registration
  - button "Open Next.js Dev Tools" [ref=e329] [cursor=pointer]
  - alert [ref=e333]
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
  30  |     await expect(page.getByText('Original')).toBeVisible();
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
> 84  |     await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
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