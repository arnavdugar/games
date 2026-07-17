import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import sharp from "sharp";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const sourceIcon = path.join(publicDirectory, "icon.svg");

// Cover the PWA manifest sizes, the 64px Edge icon, and the 180px Apple icon.
const standardIconSizes = [64, 180, 192, 512];
const maskableIconSizes = [180, 512];

// The source already has non-maskable breathing room. Shrinking it by another
// 20% keeps the full die inside the maskable icon's guaranteed safe zone.
const paddedForegroundScale = 0.8;
const paddedIconBackground = "#f4f7f6";

const pngOptions = {
  compressionLevel: 9,
  palette: true,
};

function getIconFilename(size, maskable = false) {
  return `icon-${size}${maskable ? "-maskable" : ""}.png`;
}

async function generateStandardIcon(size) {
  const filename = getIconFilename(size);

  await sharp(sourceIcon)
    .resize(size, size)
    .png(pngOptions)
    .toFile(path.join(publicDirectory, filename));

  return filename;
}

async function generateMaskableIcon(size) {
  const filename = getIconFilename(size, true);
  const foregroundSize = Math.round(size * paddedForegroundScale);
  const foreground = await sharp(sourceIcon)
    .resize(foregroundSize, foregroundSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: paddedIconBackground,
    },
  })
    .composite([{ input: foreground, gravity: "center" }])
    .png(pngOptions)
    .toFile(path.join(publicDirectory, filename));

  return filename;
}

await mkdir(publicDirectory, { recursive: true });

const generatedIcons = await Promise.all([
  ...standardIconSizes.map(generateStandardIcon),
  ...maskableIconSizes.map(generateMaskableIcon),
]);

console.log(`Generated ${generatedIcons.length} icons:`);
for (const filename of generatedIcons) {
  console.log(`  public/${filename}`);
}
