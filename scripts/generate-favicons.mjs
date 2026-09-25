import fs from "fs";
import path from "path";
import sharp from "sharp";

const sourcePath = path.resolve("public/brand/her-drive-light.png");

async function generate() {
  console.log("Generating favicons from:", sourcePath);
  const inputBuffer = fs.readFileSync(sourcePath);

  // Generate PNG sizes
  const sizes = [16, 32, 48, 64, 180, 192, 512];
  const pngBuffers = {};

  for (const size of sizes) {
    pngBuffers[size] = await sharp(inputBuffer)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  // Write high-res PNG icons
  fs.writeFileSync(path.resolve("public/favicon.png"), pngBuffers[48]);
  fs.writeFileSync(path.resolve("public/favicon-32x32.png"), pngBuffers[32]);
  fs.writeFileSync(path.resolve("public/favicon-16x16.png"), pngBuffers[16]);
  fs.writeFileSync(path.resolve("public/apple-touch-icon.png"), pngBuffers[180]);
  fs.writeFileSync(path.resolve("app/icon.png"), pngBuffers[192]);
  fs.writeFileSync(path.resolve("app/apple-icon.png"), pngBuffers[180]);

  // Create a proper ICO file containing 16x16, 32x32, and 48x48 PNGs
  const icoSizes = [16, 32, 48];
  const numImages = icoSizes.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + numImages * entrySize;

  const entries = [];
  const imageBuffers = [];

  for (const s of icoSizes) {
    const buf = pngBuffers[s];
    imageBuffers.push(buf);

    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(s, 0); // width (16, 32, 48)
    entry.writeUInt8(s, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8); // size of image
    entry.writeUInt32LE(offset, 12); // offset

    entries.push(entry);
    offset += buf.length;
  }

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(numImages, 4); // number of images

  const icoBuffer = Buffer.concat([header, ...entries, ...imageBuffers]);

  // Write ICO to app/favicon.ico and public/favicon.ico
  fs.writeFileSync(path.resolve("app/favicon.ico"), icoBuffer);
  fs.writeFileSync(path.resolve("public/favicon.ico"), icoBuffer);

  console.log("Successfully generated all favicons (app/favicon.ico, public/favicon.ico, app/icon.png, public/favicon.png, etc.)");
}

generate().catch(console.error);
