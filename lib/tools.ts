export interface ToolDefinition {
  slug: string;
  name: string;
  category:
    | "image-converter"
    | "image-utility"
    | "pdf-converter"
    | "pdf-utility";
  inputFormats: string[];
  outputFormats: string[];
  engine: string;
  clientSide: boolean;
  title: string;
  description: string;
  h1: string;
  intro: string;
  howTo: {
    title: string;
    description: string;
  }[];
  features?: {
    title: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  relatedTools: string[];
}

export const TOOLS: ToolDefinition[] = [
  // 1. JPG to PNG
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    category: 'image-converter',
    inputFormats: ['jpg', 'jpeg'],
    outputFormats: ['png'],
    engine: 'image-convert',
    clientSide: true,
    title: 'Convert JPG to PNG Online – Free Browser-Based Converter',
    description: 'Convert JPG and JPEG images to PNG format directly in your browser. Free, fast, and secure with no file uploads to a server and no registration required.',
    h1: 'Convert JPG to PNG',
    intro: 'Convert your JPG or JPEG images to PNG format for free, directly inside your web browser. There is no software to install, no registration, and no file uploads to external servers—all processing happens entirely on your device.',
    howTo: [
      { title: 'Upload your JPG or JPEG files', description: 'Select or drag and drop up to 20 JPG or JPEG images from your device (up to 50 MB each).' },
      { title: 'Click Convert to PNG', description: 'Click the Convert button to process your images locally in your browser.' },
      { title: 'Download your PNG files', description: 'Download individual PNG files or grab all converted images in a single ZIP file.' },
    ],
    features: [
      { title: 'Browser-Based Processing', description: 'Conversions execute locally in your browser using modern Web Workers, without sending files over the internet.' },
      { title: 'Supports JPG and JPEG', description: 'Accepts standard .jpg and .jpeg files up to 50 MB per file.' },
      { title: 'Multiple Files & ZIP Download', description: 'Process up to 20 files at once and download individual outputs or all files as a ZIP archive.' },
      { title: 'Original Dimensions Preserved', description: 'Maintains your exact pixel width and height without automatic resizing or loss of resolution.' },
    ],
    faq: [
      { question: 'What is the difference between JPG and PNG?', answer: 'JPG is a compressed format commonly used for digital photography, while PNG provides clean rendering for graphics and supports transparency.' },
      { question: 'Can I convert multiple JPG files at once?', answer: 'Yes, you can select up to 20 JPG or JPEG images at once and download each converted PNG individually or all together as a ZIP file.' },
      { question: 'Will the image dimensions change?', answer: 'No, the output PNG will keep the exact original width and height dimensions of your source JPEG image.' },
      { question: 'Are my files uploaded to a server?', answer: 'No. The conversion is performed entirely in your browser using client-side processing. Your files never leave your device.' },
      { question: 'Is JPG to PNG conversion free?', answer: 'Yes, this converter is completely free with no registration, subscriptions, or hidden charges.' },
    ],
    relatedTools: ['png-to-jpg', 'jpg-to-webp', 'compress-image', 'image-to-pdf'],
  },

  // 2. PNG to JPG
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG',
    category: 'image-converter',
    inputFormats: ['png'],
    outputFormats: ['jpg'],
    engine: 'image-convert',
    clientSide: true,
    title: 'Convert PNG to JPG Online – Free Browser-Based Converter',
    description: 'Convert PNG images to JPG format directly in your browser. Choose quality levels and custom background colors for transparent areas. 100% private, no file uploads.',
    h1: 'Convert PNG to JPG',
    intro: 'Convert PNG images into lightweight, universal JPG files directly in your browser. Control output quality and choose a solid white or black background for transparent areas.',
    howTo: [
      { title: 'Upload your PNG files', description: 'Drag and drop your PNG images into the dropzone or click to browse files from your device.' },
      { title: 'Choose JPG quality and background color', description: 'Select your preferred JPG compression level (High 90%, Medium 80%, or Low 70%) and background color for transparency.' },
      { title: 'Click Convert to JPG', description: 'Hit the Convert to JPG button to begin client-side processing directly in your browser.' },
      { title: 'Download your JPG files', description: 'Download your converted JPG images individually or save all of them together as a ZIP archive.' },
    ],
    features: [
      { title: 'PNG to JPG Conversion', description: 'Fast, high-fidelity conversion from PNG to universal JPEG format.' },
      { title: 'Multiple Files', description: 'Convert up to 20 PNG images simultaneously in a single batch.' },
      { title: '50 MB per File', description: 'Handles large high-resolution PNG photos and illustrations up to 50 MB each.' },
      { title: 'JPG Quality Options', description: 'Easily select High (90%), Medium (80%), or Low (70%) compression.' },
      { title: 'White or Black Background for Transparency', description: 'Cleanly composite transparent or semi-transparent areas onto your choice of solid white or black.' },
      { title: 'Original Dimensions Preserved', description: 'Preserves the exact pixel width and height of each image without resizing or stretching.' },
      { title: 'Browser-Based Processing', description: 'Converts entirely within your browser for speed and privacy. Files are never sent to external servers.' },
      { title: 'No Registration', description: 'Completely free with no sign-up, subscriptions, watermarks, or hidden limitations.' },
    ],
    faq: [
      {
        question: 'What happens to transparent areas when converting PNG to JPG?',
        answer: 'JPG format does not support transparency. Any transparent or semi-transparent areas in your PNG are cleanly filled with your choice of a solid white or black background before saving.',
      },
      {
        question: 'Can I convert multiple PNG files at once?',
        answer: 'Yes, you can upload and convert up to 20 PNG files in a single batch and download them individually or all together as a convenient ZIP archive.',
      },
      {
        question: 'Will the image dimensions change?',
        answer: 'No, the converted JPG will keep the exact original width and height dimensions in pixels of your source PNG image without distortion or cropping.',
      },
      {
        question: 'Can I choose the JPG quality?',
        answer: 'Yes, you can choose between High (90%), Medium (80%), and Low (70%) compression levels. Higher quality preserves more detail, while lower quality produces smaller file sizes.',
      },
      {
        question: 'Are my PNG files uploaded to a server?',
        answer: 'No, all conversion occurs entirely on your device inside your web browser using client-side processing. Your files never leave your computer or phone.',
      },
      {
        question: 'Is PNG to JPG conversion free?',
        answer: 'Yes, this converter is completely free with no usage fees, subscriptions, watermarks, or registration required.',
      },
    ],
    relatedTools: ['jpg-to-png', 'png-to-webp', 'compress-image', 'resize-image'],
  },

  // 3. JPG to WEBP
  {
    slug: 'jpg-to-webp',
    name: 'JPG to WebP',
    category: 'image-converter',
    inputFormats: ['jpg', 'jpeg'],
    outputFormats: ['webp'],
    engine: 'image-convert',
    clientSide: true,
    title: 'Convert JPG to WebP – Fast, Free & Browser-Based',
    description: 'Convert JPG and JPEG images to WebP format right in your browser. Choose your quality preset, convert multiple files, and download individually or as a ZIP.',
    h1: 'Convert JPG to WebP',
    intro: 'Convert your JPG and JPEG images into modern WebP format entirely inside your browser. Because processing happens on your device, your source photos are never uploaded to our server. Choose your preferred quality preset, convert multiple files up to 50 MB each, and download outputs individually or as a convenient ZIP archive with no registration required.',
    howTo: [
      { title: 'Upload your JPG or JPEG files', description: 'Drop your JPG or JPEG files into the upload area or click to browse files from your device.' },
      { title: 'Choose your WebP quality', description: 'Select High (90%), Medium (80%), or Low (70%) compression based on your file size and fidelity preferences.' },
      { title: 'Click Convert to WebP', description: 'Start client-side conversion. Your images are converted directly in your browser without server uploads.' },
      { title: 'Download your WebP files', description: 'Save each converted WebP image individually or download all files together in a single ZIP archive.' },
    ],
    features: [
      { title: 'JPG to WebP Conversion', description: 'Convert standard JPG and JPEG photographs to modern WebP images with fast browser execution.' },
      { title: 'JPG and JPEG Support', description: 'Accepts both .jpg and .jpeg files with full signature validation.' },
      { title: 'Multiple Files Batch Processing', description: 'Process up to 20 images in a single batch with individual and batch progress indicators.' },
      { title: '50 MB Per File Limit', description: 'Generous file size allowance up to 50 MB per image to handle high-resolution camera photos.' },
      { title: 'Quality Presets', description: 'Choose between High (90%), Medium (80%), or Low (70%) quality presets for balanced compression.' },
      { title: 'Original Dimensions Preserved', description: 'Preserves the exact width and height of each image without scaling, cropping, or distortion.' },
      { title: 'Browser-Based Processing', description: 'All conversion happens on your local device. Source files are never uploaded to our server.' },
      { title: 'No Registration', description: 'Completely free to use with no account, subscriptions, watermarks, or hidden fees.' },
      { title: 'Individual & ZIP Downloads', description: 'Download your WebP images one by one or save the whole batch at once as a ZIP archive.' },
    ],
    faq: [
      {
        question: 'What is WebP?',
        answer: 'WebP is a modern image format developed by Google that provides superior lossy and lossless compression for web images, enabling smaller file sizes while maintaining comparable visual quality across modern web browsers.',
      },
      {
        question: 'Why convert JPG to WebP?',
        answer: 'Converting JPG to WebP can significantly reduce file size without noticeable loss of visual clarity, helping websites load faster and save bandwidth.',
      },
      {
        question: 'Can I convert multiple JPG files at once?',
        answer: 'Yes, you can upload and convert up to 20 JPG or JPEG files at once, and download them either individually or together as a ZIP archive.',
      },
      {
        question: 'Will the image dimensions change?',
        answer: 'No, the converted WebP image retains the exact original pixel width and height of your source image.',
      },
      {
        question: 'Can I choose WebP quality?',
        answer: 'Yes, you can select from three quality presets: High (90%), Medium (80%), or Low (70%). Higher quality preserves finer detail, while lower quality yields smaller files.',
      },
      {
        question: 'Are my JPG files uploaded to a server?',
        answer: 'No, all processing is performed locally in your web browser using HTML5 Canvas and Web Worker technology. Your source files are never uploaded to our server.',
      },
      {
        question: 'Is JPG to WebP conversion free?',
        answer: 'Yes, the tool is 100% free to use with no registration, usage limits, or watermarks.',
      },
    ],
    relatedTools: ['jpg-to-png', 'png-to-jpg', 'webp-to-jpg', 'png-to-webp'],
  },

  // 4. WEBP to JPG
  {
    slug: 'webp-to-jpg',
    name: 'WEBP to JPG',
    category: 'image-converter',
    inputFormats: ['webp'],
    outputFormats: ['jpg'],
    engine: 'image-convert',
    clientSide: true,
    title: 'WEBP to JPG Converter – Fast & Free Online Utility',
    description: 'Convert WEBP files to universal JPG format for compatibility with older software, image viewers, and legacy systems.',
    h1: 'Convert WEBP to JPG',
    intro: 'Turn modern WEBP graphics into universally compatible JPG files for offline presentations, printing, and legacy photo editors.',
    howTo: [
      { title: 'Upload WEBP image', description: 'Choose your WEBP file from your device.' },
      { title: 'Verify conversion', description: 'Check output settings.' },
      { title: 'Download JPG', description: 'Save your standard JPG image.' },
    ],
    faq: [
      { question: 'Can I open the resulting JPG on any device?', answer: 'Yes, JPG is supported by virtually every operating system, image editor, and device in existence.' },
    ],
    relatedTools: ['jpg-to-webp', 'webp-to-png', 'compress-image'],
  },

  // 5. PNG to WEBP
  {
    slug: 'png-to-webp',
    name: 'PNG to WEBP',
    category: 'image-converter',
    inputFormats: ['png'],
    outputFormats: ['webp'],
    engine: 'image-convert',
    clientSide: true,
    title: 'PNG to WEBP Converter – Preserve Transparency with Smaller Size',
    description: 'Convert PNG images to WEBP while keeping full alpha channel transparency with dramatically reduced file weight.',
    h1: 'Convert PNG to WEBP',
    intro: 'Retain crisp alpha transparency while slashing file sizes by converting your heavy PNG assets into modern WEBP format.',
    howTo: [
      { title: 'Upload PNG files', description: 'Select PNG files with or without transparent backgrounds.' },
      { title: 'Set options', description: 'Configure compression preferences.' },
      { title: 'Download WEBP', description: 'Download lightweight transparent WEBP files.' },
    ],
    faq: [
      { question: 'Does WEBP support transparent backgrounds like PNG?', answer: 'Yes, WEBP fully supports alpha channel transparency while achieving smaller file sizes than PNG.' },
    ],
    relatedTools: ['webp-to-png', 'jpg-to-webp', 'compress-image'],
  },

  // 6. WEBP to PNG
  {
    slug: 'webp-to-png',
    name: 'WEBP to PNG',
    category: 'image-converter',
    inputFormats: ['webp'],
    outputFormats: ['png'],
    engine: 'image-convert',
    clientSide: true,
    title: 'WEBP to PNG Converter – Lossless Transparent Images',
    description: 'Convert WEBP images to lossless PNG format with transparent backgrounds intact. Free, fast browser-based converter.',
    h1: 'Convert WEBP to PNG',
    intro: 'Convert WEBP images into crisp PNG format for editing in Photoshop, Illustrator, and other creative desktop applications.',
    howTo: [
      { title: 'Upload WEBP', description: 'Select your WEBP files.' },
      { title: 'Review options', description: 'Confirm PNG output settings.' },
      { title: 'Download PNG', description: 'Save the converted PNG file.' },
    ],
    faq: [
      { question: 'Is transparency preserved from WEBP to PNG?', answer: 'Yes, any transparency present in the original WEBP is faithfully retained in the generated PNG.' },
    ],
    relatedTools: ['png-to-webp', 'webp-to-jpg', 'jpg-to-png'],
  },

  // 7. HEIC to JPG
  {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG',
    category: 'image-converter',
    inputFormats: ['heic', 'heif'],
    outputFormats: ['jpg'],
    engine: 'image-convert',
    clientSide: true,
    title: 'HEIC to JPG Converter – Convert iPhone Photos Online',
    description: 'Convert Apple HEIC and HEIF photos from iPhone or iPad into standard JPG images without downloading third-party apps.',
    h1: 'Convert HEIC to JPG',
    intro: 'Easily turn high-efficiency iPhone HEIC photos into standard JPG format for sharing on Windows, Android, and social media.',
    howTo: [
      { title: 'Upload HEIC photo', description: 'Select photos taken with your iPhone or Apple device.' },
      { title: 'Convert', description: 'Let our browser engine decode the HEIC format.' },
      { title: 'Download JPG', description: 'Download your standard, universal JPG photo.' },
    ],
    faq: [
      { question: 'What is a HEIC file?', answer: 'HEIC is Apple default photo format that provides high quality at small file sizes, but is not natively supported on all non-Apple devices.' },
    ],
    relatedTools: ['jpg-to-png', 'compress-image', 'image-to-pdf'],
  },

  // 8. SVG to PNG
  {
    slug: 'svg-to-png',
    name: 'SVG to PNG',
    category: 'image-converter',
    inputFormats: ['svg'],
    outputFormats: ['png'],
    engine: 'image-convert',
    clientSide: true,
    title: 'SVG to PNG Converter – Render Vector Graphics to High-Res PNG',
    description: 'Rasterize scalable vector graphics (SVG) into crisp, high-resolution PNG images with transparent background support.',
    h1: 'Convert SVG to PNG',
    intro: 'Convert scalable vector SVG icons, illustrations, and logos into transparent raster PNG images suitable for all platforms.',
    howTo: [
      { title: 'Upload SVG file', description: 'Drop your vector graphic file into the upload zone.' },
      { title: 'Choose resolution', description: 'Select desired output dimensions or scale.' },
      { title: 'Download PNG', description: 'Save your crisp, rasterized PNG image.' },
    ],
    faq: [
      { question: 'Can I export high-resolution PNGs from SVG?', answer: 'Yes, because SVG is resolution-independent, you can rasterize to any desired pixel dimension without blurriness.' },
    ],
    relatedTools: ['png-to-jpg', 'resize-image'],
  },

  // 9. GIF to PNG
  {
    slug: 'gif-to-png',
    name: 'GIF to PNG',
    category: 'image-converter',
    inputFormats: ['gif'],
    outputFormats: ['png'],
    engine: 'image-convert',
    clientSide: true,
    title: 'GIF to PNG Converter – Extract Still Frame to Lossless PNG',
    description: 'Convert GIF images to crisp, full-color PNG images. Extract key frames with superior 24-bit color depth.',
    h1: 'Convert GIF to PNG',
    intro: 'Convert 256-color GIF animations or graphics into full 24-bit color lossless PNG files with transparent backgrounds.',
    howTo: [
      { title: 'Upload GIF', description: 'Select your GIF file.' },
      { title: 'Process', description: 'Convert the image data to PNG format.' },
      { title: 'Download PNG', description: 'Save your clean PNG image.' },
    ],
    faq: [
      { question: 'Will an animated GIF remain animated in PNG?', answer: 'Standard PNG files represent single static images with richer color depth. For animations, the first or key frame is captured.' },
    ],
    relatedTools: ['jpg-to-png', 'png-to-webp'],
  },

  // 10. BMP to PNG
  {
    slug: 'bmp-to-png',
    name: 'BMP to PNG',
    category: 'image-converter',
    inputFormats: ['bmp'],
    outputFormats: ['png'],
    engine: 'image-convert',
    clientSide: true,
    title: 'BMP to PNG Converter – Compress Raw Bitmaps Online',
    description: 'Convert large uncompressed Windows Bitmap (BMP) images into compact, lossless PNG files instantly.',
    h1: 'Convert BMP to PNG',
    intro: 'Shrink bulky BMP bitmap graphics into lightweight PNG files without discarding a single pixel of visual quality.',
    howTo: [
      { title: 'Upload BMP', description: 'Choose your BMP image file.' },
      { title: 'Compress to PNG', description: 'Apply lossless compression.' },
      { title: 'Download PNG', description: 'Retrieve your compact PNG file.' },
    ],
    faq: [
      { question: 'Why are BMP files so large?', answer: 'BMP files store raw pixel arrays without compression. PNG compresses this data losslessly, often saving over 70% in file size.' },
    ],
    relatedTools: ['png-to-jpg', 'compress-image'],
  },

  // 11. Compress Image
  {
    slug: 'compress-image',
    name: 'Compress Image',
    category: 'image-utility',
    inputFormats: ['jpg', 'jpeg', 'png', 'webp'],
    outputFormats: ['jpg', 'png', 'webp'],
    engine: 'image-compress',
    clientSide: true,
    title: 'Compress Image Online – Reduce Image File Size Without Quality Loss',
    description: 'Compress JPG, PNG, and WEBP images in seconds. Optimize file size for web, email, and social sharing while maintaining clarity.',
    h1: 'Compress Images Online',
    intro: 'Reduce the file size of your photos and graphics up to 80% without visible loss in quality. Completely client-side and free.',
    howTo: [
      { title: 'Upload images', description: 'Select up to 20 images to compress in a single batch.' },
      { title: 'Choose compression level', description: 'Select between balanced, maximum compression, or custom quality.' },
      { title: 'Download compressed images', description: 'Download your lightweight files individually or all at once.' },
    ],
    faq: [
      { question: 'How much can image compression reduce file size?', answer: 'Typically between 40% and 80% depending on the original format and visual complexity.' },
      { question: 'Is my data secure?', answer: 'Yes, compression runs directly in your browser without transmitting your photos across the internet.' },
    ],
    relatedTools: ['resize-image', 'jpg-to-webp', 'png-to-jpg'],
  },

  // 12. Resize Image
  {
    slug: 'resize-image',
    name: 'Resize Image',
    category: 'image-utility',
    inputFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp'],
    outputFormats: ['jpg', 'png', 'webp'],
    engine: 'image-resize',
    clientSide: true,
    title: 'Resize Image Dimensions Online – Exact Width & Height',
    description: 'Resize image dimensions by pixels or percentage while maintaining aspect ratio. Fast, responsive, and privacy-first.',
    h1: 'Resize Image Dimensions',
    intro: 'Change the dimensions of your photos in pixels or percentages while locking aspect ratio to prevent stretching or distortion.',
    howTo: [
      { title: 'Upload your image', description: 'Drop your photo into the resize tool.' },
      { title: 'Specify dimensions', description: 'Enter width, height, or scale percentage with aspect ratio lock.' },
      { title: 'Download resized image', description: 'Save your perfectly scaled image.' },
    ],
    faq: [
      { question: 'Does resizing keep the aspect ratio?', answer: 'Yes, you can toggle aspect ratio locking on or off to preserve natural proportions.' },
    ],
    relatedTools: ['crop-image', 'compress-image', 'rotate-image'],
  },

  // 13. Crop Image
  {
    slug: 'crop-image',
    name: 'Crop Image',
    category: 'image-utility',
    inputFormats: ['jpg', 'jpeg', 'png', 'webp'],
    outputFormats: ['jpg', 'png', 'webp'],
    engine: 'image-crop',
    clientSide: true,
    title: 'Crop Image Online – Trim & Frame Photos Free',
    description: 'Crop photos online with custom aspect ratios or freehand framing. Cut out unwanted areas and frame your images.',
    h1: 'Crop Images Online',
    intro: 'Trim unwanted borders or focus on specific subjects with our visual crop tool. Supports square (1:1), 16:9, 4:3, and freeform framing.',
    howTo: [
      { title: 'Upload image', description: 'Select the photo you want to crop.' },
      { title: 'Adjust crop frame', description: 'Drag the handles or select a preset ratio.' },
      { title: 'Download cropped image', description: 'Export your newly cropped image.' },
    ],
    faq: [
      { question: 'Are standard social media presets supported?', answer: 'Yes, presets for profile avatars, banners, and standard aspect ratios are available.' },
    ],
    relatedTools: ['resize-image', 'rotate-image', 'compress-image'],
  },

  // 14. Rotate Image
  {
    slug: 'rotate-image',
    name: 'Rotate Image',
    category: 'image-utility',
    inputFormats: ['jpg', 'jpeg', 'png', 'webp'],
    outputFormats: ['jpg', 'png', 'webp'],
    engine: 'image-rotate',
    clientSide: true,
    title: 'Rotate Image Online – 90°, 180° & Flip Horizontally/Vertically',
    description: 'Rotate photos 90 degrees clockwise, counter-clockwise, 180 degrees, or flip mirrored orientations with one click.',
    h1: 'Rotate and Flip Images',
    intro: 'Fix sideways or upside-down smartphone photos in seconds. Rotate by 90-degree increments or flip horizontally and vertically.',
    howTo: [
      { title: 'Upload image', description: 'Choose any photo that needs orientation correction.' },
      { title: 'Rotate or flip', description: 'Click 90° clockwise, 90° counter-clockwise, or flip buttons.' },
      { title: 'Save corrected photo', description: 'Download your properly oriented image.' },
    ],
    faq: [
      { question: 'Does rotating degrade photo quality?', answer: 'No, lossless rotation preserves the exact original pixels without recompressing needlessly.' },
    ],
    relatedTools: ['crop-image', 'resize-image', 'compress-image'],
  },

  // 15. Image to PDF
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    category: 'image-utility',
    inputFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp'],
    outputFormats: ['pdf'],
    engine: 'image-to-pdf',
    clientSide: true,
    title: 'Image to PDF Converter – Combine Photos into a Single PDF Document',
    description: 'Convert multiple JPG, PNG, and WEBP photos into a clean, paginated PDF document. Reorder pages and configure margins easily.',
    h1: 'Convert Images to PDF',
    intro: 'Combine multiple photos, receipts, or document scans into a professional, shareable PDF file right inside your browser.',
    howTo: [
      { title: 'Add images', description: 'Upload all images you wish to include in your document.' },
      { title: 'Order pages', description: 'Arrange photos into your preferred sequence.' },
      { title: 'Create PDF', description: 'Generate and download your combined PDF file.' },
    ],
    faq: [
      { question: 'Can I mix different image formats in one PDF?', answer: 'Yes, you can combine JPG, PNG, and WEBP files into a single unified PDF.' },
    ],
    relatedTools: ['jpg-to-pdf', 'png-to-pdf', 'merge-pdf'],
  },

  // 16. JPG to PDF
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'pdf-converter',
    inputFormats: ['jpg', 'jpeg'],
    outputFormats: ['pdf'],
    engine: 'pdf-convert',
    clientSide: true,
    title: 'JPG to PDF Converter – Turn JPEG Photos into PDF Documents',
    description: 'Convert JPG images to PDF documents quickly. Fast, private, and client-side conversion for invoices, scans, and photos.',
    h1: 'Convert JPG to PDF',
    intro: 'Quickly package JPEG photos into a clean PDF document. Ideal for submitting receipts, contracts, and assignments.',
    howTo: [
      { title: 'Upload JPG files', description: 'Select your JPG photos or documents.' },
      { title: 'Adjust layout', description: 'Configure page orientation and margin settings.' },
      { title: 'Download PDF', description: 'Save your generated PDF document.' },
    ],
    faq: [
      { question: 'Is there a file size limit?', answer: 'You can convert images up to 50 MB per file, with up to 20 files per batch.' },
    ],
    relatedTools: ['image-to-pdf', 'png-to-pdf', 'pdf-to-jpg'],
  },

  // 17. PNG to PDF
  {
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    category: 'pdf-converter',
    inputFormats: ['png'],
    outputFormats: ['pdf'],
    engine: 'pdf-convert',
    clientSide: true,
    title: 'PNG to PDF Converter – High Quality PNG to PDF Document',
    description: 'Convert PNG graphics and screenshots to clear, vector-friendly PDF pages. Retains sharpness and clarity.',
    h1: 'Convert PNG to PDF',
    intro: 'Convert PNG screenshots, graphics, and scanned pages into neat, portable PDF files ready for printing or email distribution.',
    howTo: [
      { title: 'Upload PNG files', description: 'Choose your PNG images.' },
      { title: 'Set page layout', description: 'Choose page size (A4, Letter, or Fit to Image).' },
      { title: 'Download PDF', description: 'Retrieve your compiled PDF file.' },
    ],
    faq: [
      { question: 'Will screenshots look crisp in the PDF?', answer: 'Yes, PNG files are embedded at full resolution without blurring or degradation.' },
    ],
    relatedTools: ['jpg-to-pdf', 'image-to-pdf', 'pdf-to-png'],
  },

  // 18. PDF to JPG
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf-converter',
    inputFormats: ['pdf'],
    outputFormats: ['jpg'],
    engine: 'pdf-convert',
    clientSide: true,
    title: 'PDF to JPG Converter – Extract PDF Pages as High-Quality Images',
    description: 'Convert PDF pages into high-resolution JPG images. Extract all pages or individual selections directly in your browser.',
    h1: 'Convert PDF to JPG',
    intro: 'Turn multi-page PDF documents into individual, shareable JPG images. Perfect for embedding slides or document pages onto the web.',
    howTo: [
      { title: 'Upload PDF', description: 'Select your PDF document (up to 100 MB).' },
      { title: 'Select pages', description: 'Choose to extract all pages or specific page numbers.' },
      { title: 'Download JPGs', description: 'Download your high-resolution JPG files.' },
    ],
    faq: [
      { question: 'Can I extract just one specific page?', answer: 'Yes, you can extract individual pages or the entire document as image files.' },
    ],
    relatedTools: ['pdf-to-png', 'jpg-to-pdf', 'compress-pdf'],
  },

  // 19. PDF to PNG
  {
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'pdf-converter',
    inputFormats: ['pdf'],
    outputFormats: ['png'],
    engine: 'pdf-convert',
    clientSide: true,
    title: 'PDF to PNG Converter – Render Crisp Vector PDF Pages to PNG',
    description: 'Convert PDF documents into crisp, lossless PNG images. Ideal for vector diagrams, text-heavy documents, and charts.',
    h1: 'Convert PDF to PNG',
    intro: 'Render PDF document pages into ultra-sharp PNG images, preserving sharp fonts, charts, and fine graphic lines.',
    howTo: [
      { title: 'Select PDF', description: 'Drop your PDF into the converter.' },
      { title: 'Render pages', description: 'Our browser engine renders each page at high DPI.' },
      { title: 'Download PNG files', description: 'Save your crisp PNG images.' },
    ],
    faq: [
      { question: 'Why choose PNG over JPG for PDF extraction?', answer: 'PNG preserves sharp text contrast and vector lines without JPEG ringing artifacts.' },
    ],
    relatedTools: ['pdf-to-jpg', 'png-to-pdf', 'split-pdf'],
  },

  // 20. Merge PDF
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf-utility',
    inputFormats: ['pdf'],
    outputFormats: ['pdf'],
    engine: 'pdf-merge',
    clientSide: true,
    title: 'Merge PDF Files Online – Combine Multiple PDFs into One',
    description: 'Combine multiple PDF documents into a single organized file in seconds. Drag and drop to reorder pages and files.',
    h1: 'Merge PDF Files',
    intro: 'Join separate PDF files together into one seamless document. Reorder individual documents before combining with zero data loss.',
    howTo: [
      { title: 'Upload PDF files', description: 'Add two or more PDF files to combine.' },
      { title: 'Reorder files', description: 'Drag documents into your desired order.' },
      { title: 'Merge and download', description: 'Click Merge to generate your unified PDF.' },
    ],
    faq: [
      { question: 'How many PDF files can I merge at once?', answer: 'You can merge up to 20 PDF documents in a single operation.' },
      { question: 'Are bookmarks and form fields preserved?', answer: 'Yes, standard structural document data is retained during the merge process.' },
    ],
    relatedTools: ['split-pdf', 'reorder-pdf-pages', 'compress-pdf'],
  },

  // 21. Split PDF
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf-utility',
    inputFormats: ['pdf'],
    outputFormats: ['pdf'],
    engine: 'pdf-split',
    clientSide: true,
    title: 'Split PDF Online – Extract Pages or Separate Into Individual Documents',
    description: 'Split large PDF documents into smaller files or extract individual pages by range. Fast, private, and free.',
    h1: 'Split PDF Pages',
    intro: 'Extract selected pages from a large PDF document or divide a file into multiple smaller PDFs by custom page ranges.',
    howTo: [
      { title: 'Upload PDF', description: 'Select the PDF file you want to split.' },
      { title: 'Specify ranges', description: 'Input page numbers or ranges (e.g., 1-3, 5, 8-10).' },
      { title: 'Download separated PDFs', description: 'Retrieve your split document files.' },
    ],
    faq: [
      { question: 'Can I split by custom page ranges?', answer: 'Yes, enter any combination of single pages or page ranges.' },
    ],
    relatedTools: ['merge-pdf', 'delete-pdf-pages', 'reorder-pdf-pages'],
  },

  // 22. Compress PDF
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    category: 'pdf-utility',
    inputFormats: ['pdf'],
    outputFormats: ['pdf'],
    engine: 'pdf-compress',
    clientSide: true,
    title: 'Compress PDF Online – Reduce PDF File Size Free',
    description: 'Compress PDF documents to easily share via email or upload to portal limits while preserving readable text and diagrams.',
    h1: 'Compress PDF Documents',
    intro: 'Shrink oversized PDF files to meet email attachment limits and upload constraints while retaining clear readability.',
    howTo: [
      { title: 'Upload PDF', description: 'Select the PDF document to compress.' },
      { title: 'Choose compression level', description: 'Select recommended or high compression.' },
      { title: 'Download smaller PDF', description: 'Save your optimized, lightweight PDF.' },
    ],
    faq: [
      { question: 'Will compression make my PDF text blurry?', answer: 'No, text remains vector-based and sharp; compression targets embedded bitmap images and redundant metadata.' },
    ],
    relatedTools: ['merge-pdf', 'split-pdf', 'compress-image'],
  },

  // 23. Rotate PDF
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'pdf-utility',
    inputFormats: ['pdf'],
    outputFormats: ['pdf'],
    engine: 'pdf-rotate',
    clientSide: true,
    title: 'Rotate PDF Pages Online – Permanently Fix PDF Orientation',
    description: 'Rotate individual PDF pages or all pages 90, 180, or 270 degrees clockwise. Save corrected documents permanently.',
    h1: 'Rotate PDF Pages',
    intro: 'Fix upside-down or sideways pages in scanned documents. Rotate single pages or the entire document permanently in seconds.',
    howTo: [
      { title: 'Upload PDF', description: 'Choose your PDF file.' },
      { title: 'Select pages to rotate', description: 'Rotate all pages or click individual thumbnails.' },
      { title: 'Save rotated PDF', description: 'Download your permanently oriented document.' },
    ],
    faq: [
      { question: 'Does rotating modify the original PDF text?', answer: 'No, the document content remains intact; only the page display angle coordinate is updated.' },
    ],
    relatedTools: ['reorder-pdf-pages', 'delete-pdf-pages', 'merge-pdf'],
  },

  // 24. Delete PDF Pages
  {
    slug: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    category: 'pdf-utility',
    inputFormats: ['pdf'],
    outputFormats: ['pdf'],
    engine: 'pdf-delete-pages',
    clientSide: true,
    title: 'Delete PDF Pages Online – Remove Unwanted Pages from PDF',
    description: 'Select and remove blank or unwanted pages from your PDF file. Download a clean, trimmed document instantly.',
    h1: 'Delete Pages from PDF',
    intro: 'Quickly strip out unnecessary covers, blank pages, or outdated sections from any PDF document without re-scanning.',
    howTo: [
      { title: 'Upload PDF', description: 'Upload the document you want to trim.' },
      { title: 'Select pages to remove', description: 'Click pages to mark them for removal or enter page numbers.' },
      { title: 'Download trimmed PDF', description: 'Save your cleaned-up PDF file.' },
    ],
    faq: [
      { question: 'Can I remove multiple pages at once?', answer: 'Yes, select as many pages as you like across the document.' },
    ],
    relatedTools: ['split-pdf', 'reorder-pdf-pages', 'rotate-pdf'],
  },

  // 25. Reorder PDF Pages
  {
    slug: 'reorder-pdf-pages',
    name: 'Reorder PDF Pages',
    category: 'pdf-utility',
    inputFormats: ['pdf'],
    outputFormats: ['pdf'],
    engine: 'pdf-reorder-pages',
    clientSide: true,
    title: 'Reorder PDF Pages Online – Rearrange Pages with Drag & Drop',
    description: 'Rearrange page order in any PDF file using visual drag and drop thumbnails. Reorganize your document in seconds.',
    h1: 'Reorder PDF Pages',
    intro: 'Organize your document pages in the exact sequence you want. Simply drag and drop page thumbnails into the correct order.',
    howTo: [
      { title: 'Upload PDF', description: 'Open your document in the reorder tool.' },
      { title: 'Drag to reorder', description: 'Rearrange page thumbnails visually into your desired sequence.' },
      { title: 'Save new document', description: 'Download your restructured PDF file.' },
    ],
    faq: [
      { question: 'Can I also rotate or remove pages while reordering?', answer: 'Yes, our visual page manager lets you rotate, delete, and reorder simultaneously.' },
    ],
    relatedTools: ['delete-pdf-pages', 'rotate-pdf', 'merge-pdf'],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolDefinition['category']): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getAllTools(): ToolDefinition[] {
  return TOOLS;
}
