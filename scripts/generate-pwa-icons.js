const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateIcons() {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const logoSrc = path.join(__dirname, '..', 'public', 'images', 'logo-gold.png');
  if (!fs.existsSync(logoSrc)) {
    console.error('Source logo not found at', logoSrc);
    return;
  }

  // Helper to create a dark luxury background with centered logo
  async function makeIcon(size, paddingRatio, outputPath) {
    const bg = { r: 17, g: 17, b: 17, alpha: 1 }; // #111111 Matte Black
    const logoSize = Math.round(size * (1 - paddingRatio * 2));

    const resizedLogo = await sharp(logoSrc)
      .resize({
        width: logoSize,
        height: logoSize,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bg
      }
    })
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .png()
      .toFile(outputPath);

    console.log(`Generated: ${outputPath} (${size}x${size})`);
  }

  await makeIcon(192, 0.15, path.join(iconsDir, 'icon-192.png'));
  await makeIcon(512, 0.18, path.join(iconsDir, 'icon-512.png'));
  await makeIcon(512, 0.25, path.join(iconsDir, 'icon-maskable.png'));
  await makeIcon(180, 0.15, path.join(iconsDir, 'apple-touch-icon.png'));

  console.log('All PWA icons generated successfully.');
}

generateIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
