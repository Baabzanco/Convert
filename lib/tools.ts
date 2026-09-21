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
    name: 'WebP to JPG',
    category: 'image-converter',
    inputFormats: ['webp'],
    outputFormats: ['jpg'],
    engine: 'image-convert',
    clientSide: true,
    title: 'Convert WEBP to JPG – Fast, Free & Browser-Based',
    description: 'Convert WEBP images to JPG format directly in your browser. Choose JPG quality, choose background color for transparent areas, convert multiple files, and download individually or as a ZIP.',
    h1: 'Convert WEBP to JPG',
    intro: 'Convert your WEBP images into universally compatible JPG format directly in your web browser. WebP is great for modern websites, but older photo viewers, desktop editors, and legacy workflows still require standard JPEG files. Our converter processes everything locally on your device—your source photos are never uploaded to our server. Choose your JPG quality preset, select a solid white or black background for transparent areas, convert multiple files up to 50 MB each, and download outputs individually or as a single ZIP archive with no registration required.',
    howTo: [
      { title: 'Upload your WEBP files', description: 'Drag and drop your WEBP images into the upload area or click to select files from your device (up to 20 files, 50 MB each).' },
      { title: 'Choose your JPG quality and background color', description: 'Select your preferred JPG quality (High 90%, Medium 80%, Low 70%) and a solid white or black background for any transparent areas.' },
      { title: 'Click Convert to JPG', description: 'Click the Convert to JPG button to begin instant, client-side processing in your browser.' },
      { title: 'Download your JPG files', description: 'Download each converted JPG image individually or save all converted files at once in a convenient ZIP archive.' },
    ],
    features: [
      { title: 'WEBP to JPG Conversion', description: 'Easily convert modern WebP images into universal JPG photos compatible with any device or software.' },
      { title: 'Multiple Files Batch Processing', description: 'Upload and convert up to 20 WebP files at once with real-time individual and batch progress tracking.' },
      { title: '50 MB Per File Limit', description: 'Support for high-resolution graphics and large photo exports up to 50 MB per file.' },
      { title: 'JPG Quality Options', description: 'Choose between High (90%), Medium (80%), or Low (70%) compression presets to optimize clarity and size.' },
      { title: 'Background Options for Transparency', description: 'Seamlessly composite transparent and semi-transparent WebP pixels onto a solid white or black background.' },
      { title: 'Original Dimensions Preserved', description: 'Retains the exact original pixel width and height without unwanted resizing, cropping, or distortion.' },
      { title: 'Browser-Based Processing', description: 'Conversions execute entirely inside your browser using HTML5 Canvas and Web Workers. Source files never touch our servers.' },
      { title: 'No Registration', description: '100% free to use with no account required, no email collection, no subscriptions, and no watermarks.' },
      { title: 'Individual and ZIP Downloads', description: 'Download your converted JPEG files one by one or bundle all files into a single webp-to-jpg-files.zip archive.' },
    ],
    faq: [
      {
        question: 'What is the difference between WebP and JPG?',
        answer: 'WebP is a modern web format supporting lossy/lossless compression and alpha transparency, while JPG is the universal standard format for photographs supported by virtually every software and device.',
      },
      {
        question: 'Why convert WebP to JPG?',
        answer: 'While WebP works well on modern web browsers, many desktop photo editors, older operating systems, office applications, and printing services still require JPG files.',
      },
      {
        question: 'What happens to transparent areas in WebP?',
        answer: 'Because the JPG format does not support transparency, any transparent or partially transparent pixels are composited onto your chosen solid background color (White or Black) before JPEG encoding.',
      },
      {
        question: 'Can I convert multiple WebP files at once?',
        answer: 'Yes, you can upload and convert up to 20 WebP files at the same time and download them individually or as a single ZIP archive.',
      },
      {
        question: 'Will the image dimensions change?',
        answer: 'No, the converted JPG image preserves the exact width and height in pixels of your source WebP image.',
      },
      {
        question: 'Can I choose JPG quality?',
        answer: 'Yes, you can select from three JPG quality presets: High (90%), Medium (80%), or Low (70%). Higher quality produces larger files, while lower quality yields smaller files.',
      },
      {
        question: 'Are my WebP files uploaded to a server?',
        answer: 'No, all processing happens entirely inside your browser on your device using client-side Web Workers and HTML5 Canvas. Your files are never sent to our server.',
      },
      {
        question: 'Is WEBP to JPG conversion free?',
        answer: 'Yes, this converter is completely free to use with no registration, no file counts, and no hidden subscriptions.',
      },
    ],
    relatedTools: ['jpg-to-png', 'png-to-jpg', 'jpg-to-webp'],
  },

  // 5. PNG to WEBP
  {
    slug: 'png-to-webp',
    name: 'PNG to WebP',
    category: 'image-converter',
    inputFormats: ['png'],
    outputFormats: ['webp'],
    engine: 'image-convert',
    clientSide: true,
    title: 'Convert PNG to WebP Online – Free Browser-Based Converter',
    description: 'Convert PNG images to modern WebP format directly in your browser with transparency preserved. Choose WebP quality, convert multiple files, and download individually or as a ZIP.',
    h1: 'Convert PNG to WebP',
    intro: 'Convert your PNG images into modern, lightweight WebP format directly inside your web browser. WebP preserves full alpha channel transparency while achieving smaller file sizes compared to heavy PNG files. All processing happens locally on your device, meaning your source images are never uploaded to our server. Choose your preferred quality preset, convert multiple files up to 50 MB each, and download outputs individually or together in a single ZIP archive with no registration required.',
    howTo: [
      { title: 'Upload your PNG files', description: 'Drag and drop or select up to 20 PNG images from your device (up to 50 MB each).' },
      { title: 'Choose WebP quality', description: 'Select High (90%), Medium (80%), or Low (70%) compression presets based on your quality preferences.' },
      { title: 'Click Convert to WebP', description: 'Click the Convert to WebP button to begin instant, client-side processing directly in your browser.' },
      { title: 'Download your WebP files', description: 'Download each converted WebP image individually or save all converted files at once in a convenient ZIP archive.' },
    ],
    features: [
      { title: 'PNG to WebP Conversion', description: 'Convert PNG images into modern, web-optimized WebP files with fast browser execution.' },
      { title: 'Transparency Preservation', description: 'Keeps full alpha channel transparency and transparent backgrounds intact without adding solid colors.' },
      { title: 'Multiple Files Batch Processing', description: 'Upload and convert up to 20 PNG files in a single batch with real-time progress indicators.' },
      { title: '50 MB Per File Limit', description: 'Generous file size allowance up to 50 MB per image to handle high-resolution graphics and illustrations.' },
      { title: 'WebP Quality Presets', description: 'Choose between High (90%), Medium (80%), or Low (70%) quality presets for balanced compression.' },
      { title: 'Original Dimensions Preserved', description: 'Preserves the exact width and height of each image without scaling, cropping, or distortion.' },
      { title: 'Browser-Based Processing', description: 'Conversions execute entirely inside your browser using HTML5 Canvas and Web Workers. Source files never touch our servers.' },
      { title: 'No Registration', description: '100% free to use with no account required, no email collection, no subscriptions, and no watermarks.' },
      { title: 'Individual & ZIP Downloads', description: 'Download your WebP images one by one or bundle all files into a single png-to-webp-files.zip archive.' },
    ],
    faq: [
      {
        question: 'What happens to transparent areas when converting PNG to WebP?',
        answer: 'WebP supports transparency, so the tool preserves the PNG\'s alpha channel rather than adding a background.',
      },
      {
        question: 'Can I convert multiple PNG files at once?',
        answer: 'Yes, you can upload and convert up to 20 PNG files in a single batch and download each converted WebP individually or all together as a ZIP archive.',
      },
      {
        question: 'Can I choose WebP quality?',
        answer: 'Yes, you can select from three quality presets: High (90%), Medium (80%), or Low (70%). Higher quality produces larger files, while lower quality yields smaller files.',
      },
      {
        question: 'Will my image dimensions change?',
        answer: 'No, the converted WebP retains the exact original pixel width and height dimensions of your source PNG image.',
      },
      {
        question: 'Are my PNG files uploaded to a server?',
        answer: 'No. All conversion is executed locally in your browser using client-side processing. Your files never leave your device.',
      },
      {
        question: 'Is PNG to WebP conversion free?',
        answer: 'Yes, this converter is completely free to use with no account registration, subscriptions, or watermarks.',
      },
    ],
    relatedTools: ['jpg-to-png', 'png-to-jpg', 'jpg-to-webp', 'webp-to-jpg'],
  },

  // 6. WEBP to PNG
  {
    slug: 'webp-to-png',
    name: 'WebP to PNG',
    category: 'image-converter',
    inputFormats: ['webp'],
    outputFormats: ['png'],
    engine: 'image-convert',
    clientSide: true,
    title: 'Convert WebP to PNG Online – Free Browser-Based Converter',
    description: 'Convert WebP images to PNG format directly in your browser with full transparency preserved. Free, fast, private, and with no file uploads to a server.',
    h1: 'Convert WebP to PNG',
    intro: 'Convert your WebP images into universal, lossless PNG format directly inside your web browser. Transparent WebP backgrounds and alpha channels are faithfully preserved without adding solid colors or flattening layers. All processing executes locally on your device, ensuring your files are never uploaded to an external server. Convert multiple files up to 50 MB each, keep your exact original pixel dimensions, and download outputs individually or as a ZIP archive with no registration required.',
    howTo: [
      { title: 'Upload your WebP files', description: 'Drag and drop or select up to 20 WebP images from your device (up to 50 MB each).' },
      { title: 'Click Convert to PNG', description: 'Click the Convert to PNG button to begin instant client-side processing directly in your browser.' },
      { title: 'Download your PNG files', description: 'Download each converted PNG image individually or save all converted files at once in a convenient ZIP archive.' },
    ],
    features: [
      { title: 'WebP to PNG Conversion', description: 'Easily convert modern WebP images into universal PNG format compatible with all editing software and platforms.' },
      { title: 'Transparency Preservation', description: 'Faithfully retains full alpha channel transparency and transparent backgrounds without flattening onto solid colors.' },
      { title: 'Multiple Files Batch Processing', description: 'Upload and convert up to 20 WebP files at once with real-time individual and batch progress indicators.' },
      { title: '50 MB Per File Limit', description: 'Generous file size allowance up to 50 MB per image to handle high-resolution photos and digital illustrations.' },
      { title: 'Original Dimensions Preserved', description: 'Preserves the exact pixel width and height of each image without resizing, cropping, or aspect ratio changes.' },
      { title: 'Browser-Based Processing', description: 'Conversions execute entirely inside your browser using HTML5 Canvas and Web Workers. Source files never touch our servers.' },
      { title: 'No Registration', description: '100% free to use with no account required, no email collection, no subscriptions, and no watermarks.' },
      { title: 'Individual & ZIP Downloads', description: 'Download your converted PNG files one by one or bundle all files into a single webp-to-png-files.zip archive.' },
      { title: 'First-Frame Animation Handling', description: 'Animated WebP files are converted using the first frame into a standard static PNG image.' },
    ],
    faq: [
      {
        question: 'Does WebP to PNG conversion preserve transparency?',
        answer: 'Yes. The tool keeps the WebP transparency when the source image and browser decoder provide an alpha channel.',
      },
      {
        question: 'Can I convert multiple WebP files at once?',
        answer: 'Yes, you can upload and convert up to 20 WebP files in a single batch and download each converted PNG individually or all together as a ZIP archive.',
      },
      {
        question: 'Will the image dimensions change?',
        answer: 'No, the converted PNG retains the exact original pixel width and height dimensions of your source WebP image.',
      },
      {
        question: 'Is PNG lossless?',
        answer: 'Yes, PNG uses lossless compression, meaning the decoded image pixels are preserved cleanly without compression artifacts.',
      },
      {
        question: 'What happens to animated WebP files?',
        answer: 'Animated WebP files are converted using the first frame into a standard static PNG image.',
      },
      {
        question: 'Are my WebP files uploaded to a server?',
        answer: 'No. All processing happens entirely inside your browser on your device using client-side processing. Your files never leave your device.',
      },
      {
        question: 'Is WebP to PNG conversion free?',
        answer: 'Yes, this converter is completely free to use with no account registration, subscriptions, or watermarks.',
      },
    ],
    relatedTools: ['png-to-webp', 'webp-to-jpg', 'jpg-to-png', 'png-to-jpg'],
  },

  // 7. HEIC to JPG
  {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG',
    category: 'image-converter',
    inputFormats: ['heic'],
    outputFormats: ['jpg'],
    engine: 'image-convert',
    clientSide: true,
    title: 'Convert HEIC to JPG Online Free – Private iPhone Photo Converter',
    description: 'Convert Apple HEIC photos from iPhone or iPad into universal JPG images directly in your browser. Fast, private client-side conversion without file uploads.',
    h1: 'Convert HEIC to JPG',
    intro: 'Turn high-efficiency iPhone and iPad HEIC photos into universally compatible JPG files directly in your browser without uploading your images to any remote server.',
    howTo: [
      { title: 'Upload HEIC photos', description: 'Select or drag and drop your .heic photos taken on iPhone, iPad, or Mac.' },
      { title: 'Choose JPG quality', description: 'Pick from High (90%), Medium (80%), or Low (70%) compression presets.' },
      { title: 'Convert & Download', description: 'Process securely in your browser and download individual JPGs or a single ZIP archive.' },
    ],
    faq: [
      { question: 'Why should I convert HEIC to JPG?', answer: 'HEIC is Apple default photo format that saves space, but many Windows PCs, older devices, web browsers, and websites only accept standard JPG files.' },
      { question: 'Are my photos uploaded to a server?', answer: 'No. All HEIC decoding and JPG encoding happen 100% locally inside your web browser. Your personal photos never leave your device.' },
      { question: 'Does the conversion preserve photo quality?', answer: 'Yes. Our client-side engine decodes the full pixel resolution from your HEIC file and encodes clean, high-fidelity JPG images with adjustable quality.' },
      { question: 'Is EXIF metadata (date, location, camera details) preserved?', answer: 'Browser-based HEIC decoding prioritizes visual image fidelity and broad compatibility. Metadata preservation is not guaranteed across all browser decoders.' },
    ],
    relatedTools: ['jpg-to-png', 'png-to-jpg', 'webp-to-jpg'],
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
    title: 'Convert SVG to PNG Online Free – High-Resolution Vector Rasterizer',
    description: 'Convert scalable vector graphics (SVG) into crisp, high-resolution PNG images with full transparency support. 100% private, client-side browser conversion.',
    h1: 'Convert SVG to PNG',
    intro: 'Transform scalable vector SVG graphics, icons, and illustrations into crisp, transparent PNG images directly in your browser without uploading files to any remote server.',
    howTo: [
      { title: 'Upload SVG vectors', description: 'Drag and drop or select your .svg files into the upload area.' },
      { title: 'Instant Browser Rasterization', description: 'Our client-side engine parses vector paths, viewBox, and transparent backgrounds securely on your device.' },
      { title: 'Download Crisp PNG', description: 'Download your transparent PNG images individually or bundled as a single ZIP archive.' },
    ],
    faq: [
      { question: 'Why should I convert SVG to PNG?', answer: 'SVG is a vector format ideal for responsive web design, but many software applications, social media platforms, word processors, and email clients require standard raster PNG images with transparent backgrounds.' },
      { question: 'Is my SVG processed securely?', answer: 'Yes. All SVG parsing and rasterization occur entirely within your browser sandbox. We strictly block active scripts, external requests, and foreign objects to guarantee security.' },
      { question: 'Does SVG to PNG maintain transparent backgrounds?', answer: 'Yes. Vector alpha channels and transparent canvas areas in your SVG are fully preserved in the output 32-bit RGBA PNG image.' },
      { question: 'How are SVG dimensions determined?', answer: 'Our converter automatically reads the SVG width, height, and viewBox attributes to determine the exact pixel dimensions while maintaining crisp aspect ratios.' },
      { question: 'Are my files uploaded to an external server?', answer: 'No. The entire conversion runs client-side inside your browser. No files or vector data are ever sent over the network.' },
      { question: 'Can I batch convert multiple SVG files?', answer: 'Yes! You can select up to 20 SVG files at once and download all rendered PNGs individually or packaged in a ZIP file.' },
      { question: 'What if my SVG has no width or height attributes?', answer: 'Our parser inspects the viewBox to calculate the proportional pixel dimensions. If neither is specified, a standard 800×800 pixel canvas is used.' },
      { question: 'Why did an SVG fail to convert?', answer: 'Files containing active script tags, inline event handlers, external stylesheet links, or corrupted XML syntax are rejected to protect your privacy and system security.' },
    ],
    relatedTools: ['jpg-to-png', 'png-to-jpg', 'png-to-webp', 'webp-to-png'],
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
    title: 'GIF to PNG Converter – Extract First Frame to Lossless PNG',
    description: 'Convert GIF images and animated GIFs to crisp, lossless PNG images with full transparency support. 100% private client-side browser conversion.',
    h1: 'Convert GIF to PNG',
    intro: 'Convert static or animated GIF images into transparent, lossless PNG files directly in your browser without uploading files to any remote server. Animated GIF files are converted using the first frame.',
    howTo: [
      { title: 'Upload your GIF files', description: 'Drag and drop your .gif files or select them from your device (up to 20 files, max 50 MB each).' },
      { title: 'Click Convert to PNG', description: 'Our browser engine extracts and renders the first frame with full transparency. Animated GIFs are converted using the first frame.' },
      { title: 'Download your PNG files', description: 'Download your converted PNG files individually or bundle them all together in a single ZIP archive.' },
    ],
    faq: [
      { question: 'Can I convert an animated GIF to PNG?', answer: 'Yes. This tool converts the first rendered frame of an animated GIF into a static PNG.' },
      { question: 'Does GIF to PNG preserve transparency?', answer: 'Yes. Transparent pixels in the source GIF are fully preserved in the output PNG image.' },
      { question: 'Can I convert multiple GIF files at once?', answer: 'Yes, you can upload and batch convert up to 20 GIF files simultaneously.' },
      { question: 'Will the image dimensions change?', answer: 'No, the output PNG retains the exact logical screen dimensions of your original GIF.' },
      { question: 'Does the tool convert every animation frame?', answer: 'No. The MVP converts only the first frame.' },
      { question: 'Are my GIF files uploaded to a server?', answer: 'No. All conversions happen entirely in your browser using client-side Web Workers and Canvas. Your files never leave your device.' },
      { question: 'Is GIF to PNG conversion free?', answer: 'Yes, it is completely free to use with no account or registration required.' },
    ],
    relatedTools: ['jpg-to-png', 'png-to-jpg', 'svg-to-png', 'webp-to-png'],
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
    title: 'Convert BMP to PNG Online – Free Browser-Based Converter',
    description: 'Convert Windows Bitmap (BMP) images to PNG format directly in your browser. Lossless, fast, and secure with no file uploads to a server.',
    h1: 'Convert BMP to PNG',
    intro: 'Convert uncompressed Windows Bitmap (BMP) files into compact, lossless PNG images directly inside your web browser. BMP files often take up excessive storage space because pixel data is stored without compression. Our browser-based converter turns your BMPs into high-fidelity PNG files while preserving original pixel dimensions and colors. All processing happens entirely on your device with no software installation, no registration, and no file uploads to external servers.',
    howTo: [
      { title: 'Upload your BMP files', description: 'Select or drag and drop up to 20 BMP images from your device (up to 50 MB each).' },
      { title: 'Click Convert to PNG', description: 'Click the Convert button to begin fast, client-side conversion directly in your browser.' },
      { title: 'Download your PNG files', description: 'Download individual converted PNG files or grab all converted images in a single ZIP file.' },
    ],
    features: [
      { title: 'BMP to PNG Conversion', description: 'Easily convert uncompressed Windows Bitmap (.bmp) graphics into lightweight, universal PNG files.' },
      { title: 'Original Dimensions Preserved', description: 'Maintains the exact pixel width, height, and color channels without automatic resizing or loss of quality.' },
      { title: 'Batch File Processing', description: 'Upload and convert up to 20 BMP files simultaneously in a single session.' },
      { title: '50 MB Per File Limit', description: 'Handles high-resolution bitmap graphics up to 50 MB per file.' },
      { title: 'Browser-Based Processing', description: 'Conversions execute entirely locally on your device without sending files over the network.' },
      { title: 'Individual & ZIP Downloads', description: 'Download each converted PNG file individually or package all images into a convenient ZIP archive.' },
      { title: '100% Free & Private', description: 'Free forever with no registration, subscriptions, watermarks, or account limits.' },
    ],
    faq: [
      { question: 'What is a BMP file?', answer: 'BMP (Bitmap Image File) is an uncompressed raster graphics format developed for Windows that stores pixel data in a grid. Because it is uncompressed, BMP files can be very large.' },
      { question: 'Why convert BMP to PNG?', answer: 'PNG provides lossless compression, meaning it significantly reduces file size (often by 70% or more) without sacrificing any visual detail or image quality.' },
      { question: 'Can I convert multiple BMP files at once?', answer: 'Yes, you can upload and batch convert up to 20 BMP images at the same time and download them individually or as a single ZIP archive.' },
      { question: 'Will the image dimensions change?', answer: 'No, the output PNG retains the exact original pixel width and height dimensions of your source BMP image.' },
      { question: 'Does BMP to PNG preserve transparency?', answer: 'Yes, 32-bit BMP files containing an alpha channel or transparency are faithfully converted with transparency preserved.' },
      { question: 'Are my BMP files uploaded to a server?', answer: 'No. All processing happens entirely inside your browser on your device. Your files are never transmitted to external servers.' },
      { question: 'Can every BMP file be converted?', answer: 'Common browser-supported BMP variants (including standard 24-bit RGB and 32-bit RGBA bitmaps, both bottom-up and top-down) are converted seamlessly. Corrupted or rare historical BMP encodings unsupported by browsers may fail validation.' },
      { question: 'Is BMP to PNG conversion free?', answer: 'Yes, this converter is completely free to use with no account registration, subscriptions, or watermarks.' },
    ],
    relatedTools: ['jpg-to-png', 'png-to-jpg', 'png-to-webp', 'webp-to-png'],
  },

  // 11. Compress Image
  {
    slug: 'compress-image',
    name: 'Compress Image',
    category: 'image-utility',
    inputFormats: ['jpg', 'jpeg', 'png', 'webp'],
    outputFormats: ['jpg', 'jpeg', 'png', 'webp'],
    engine: 'image-compress',
    clientSide: true,
    title: 'Compress Images Online – Free Client-Side Image Compressor',
    description: 'Compress JPG, PNG, and WebP images directly in your browser. Reduce file size while preserving pixel dimensions, quality, and transparency.',
    h1: 'Compress Images Online',
    intro: 'Reduce the file size of your JPG, PNG, and WebP images directly in your web browser. Adjustable quality settings allow you to optimize lossy JPG and WebP photos for faster web loading and easier sharing, while PNG images use safe lossless re-encoding. Original pixel dimensions and transparency are strictly preserved with no software installation, no registration, and no file uploads to external servers.',
    howTo: [
      { title: 'Upload your images', description: 'Select or drag and drop up to 20 JPG, PNG, or WebP images from your device (up to 50 MB each).' },
      { title: 'Choose compression quality', description: 'Adjust the compression slider (10–100%) to find your desired balance between image fidelity and file size.' },
      { title: 'Click Compress Images', description: 'Start instant client-side compression locally inside your browser.' },
      { title: 'Compare original and compressed sizes', description: 'Review your saved bytes and percentage reductions for each individual image.' },
      { title: 'Download your compressed images', description: 'Download each compressed image individually or download all files together in a single ZIP archive.' },
    ],
    features: [
      { title: 'JPG, PNG & WebP Support', description: 'Compress JPEG photographs, PNG graphics, and WebP images without changing the output format.' },
      { title: 'Adjustable Quality Controls', description: 'Fine-tune lossy compression for JPG and WebP with a responsive quality slider from 10% to 100%.' },
      { title: 'Lossless PNG Protection', description: 'PNG images retain crisp alpha transparency and lossless fidelity, keeping the original if no size reduction occurs.' },
      { title: 'Original Dimensions Preserved', description: 'Compresses image files without altering pixel width or height dimensions.' },
      { title: 'Batch Processing', description: 'Upload and compress up to 20 images simultaneously in a single session.' },
      { title: '50 MB Per File Limit', description: 'Supports high-resolution photographs and large graphic assets up to 50 MB each.' },
      { title: '100% Client-Side Privacy', description: 'Images are processed entirely on your device with no network uploads or server storage.' },
      { title: 'Individual & ZIP Downloads', description: 'Save images one-by-one or grab the entire batch packaged into a single ZIP archive.' },
    ],
    faq: [
      { question: 'How does image compression reduce file size?', answer: 'Image compression removes redundant pixel data and optimizes encoding tables. For lossy formats like JPG and WebP, subtle color variations are optimized. For PNG, lossless compression reorganizes data without discarding visual information.' },
      { question: 'Which image formats can I compress?', answer: 'You can compress JPG, JPEG, PNG, and WebP images. The tool always keeps the exact same format as your source file.' },
      { question: 'Does image compression change the dimensions?', answer: 'No. The pixel width and height dimensions of your image remain exactly identical before and after compression.' },
      { question: 'Can I compress multiple images at once?', answer: 'Yes, you can upload and batch compress up to 20 images at the same time and download them individually or as a single ZIP archive.' },
      { question: 'Does JPG compression reduce image quality?', answer: 'At the recommended default of 80%, JPG compression significantly reduces file size with virtually no noticeable visual difference. Lower settings yield smaller files with higher compression.' },
      { question: 'Does PNG compression reduce image quality?', answer: 'No. PNG uses lossless browser re-encoding to preserve crisp lines and transparent backgrounds. If re-encoding does not yield a smaller file size, the original image is preserved with zero loss.' },
      { question: 'Can WebP images be compressed?', answer: 'Yes. Static WebP images can be compressed using adjustable quality settings while preserving transparency.' },
      { question: 'Are my images uploaded to a server?', answer: 'No. All processing happens entirely inside your browser on your device. Your files are never transmitted to external servers.' },
      { question: 'Is image compression free?', answer: 'Yes, this tool is completely free with no registration, subscriptions, or watermarks.' },
    ],
    relatedTools: ['jpg-to-png', 'png-to-jpg', 'jpg-to-webp', 'webp-to-png'],
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
