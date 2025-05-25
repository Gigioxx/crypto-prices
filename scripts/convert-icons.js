// Script to convert SVG icons to PNG format
// Run this after upgrading to Node.js 22+

import path from 'path';

async function convertSvgToPng() {
  try {
    const { default: sharp } = await import('sharp');

    // Convert 192x192 icon
    await sharp(path.join(__dirname, '../public/icon-192x192.svg'))
      .png()
      .toFile(path.join(__dirname, '../public/icon-192x192.png'));

    // Convert 512x512 icon
    await sharp(path.join(__dirname, '../public/icon-512x512.svg'))
      .png()
      .toFile(path.join(__dirname, '../public/icon-512x512.png'));

    console.log('✅ Icons converted successfully!');
  } catch (error) {
    console.error('❌ Error converting icons:', error.message);
    console.log('💡 Make sure to install sharp: bun add -D sharp');
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  convertSvgToPng();
}

export { convertSvgToPng };
