import fs from "fs";
import path from "path";
import sharp from "sharp";

async function processWebpageLogo() {
  const inputPath = path.resolve("icons/webpage logo.jpg");
  console.log("Processing input:", inputPath);

  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const rgba = Buffer.alloc(w * h * 4);

  // Initialize RGBA buffer
  for (let i = 0; i < w * h; i++) {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = 255;
  }

  function isNeutral(idx) {
    const r = data[idx * 3];
    const g = data[idx * 3 + 1];
    const b = data[idx * 3 + 2];
    const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    const minVal = Math.min(r, g, b);
    return diff < 15 && minVal > 170;
  }

  function isGrayChecker(idx) {
    const r = data[idx * 3];
    const g = data[idx * 3 + 1];
    const b = data[idx * 3 + 2];
    const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    return diff < 15 && r >= 190 && r <= 230;
  }

  // Flood-fill all checkerboard regions
  const visited = new Uint8Array(w * h);
  const queue = [];

  for (let i = 0; i < w * h; i++) {
    if (isGrayChecker(i)) {
      queue.push(i);
      visited[i] = 1;
    }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    rgba[curr * 4 + 3] = 0; // Set transparent

    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < w - 1 ? curr + 1 : -1,
      cy > 0 ? curr - w : -1,
      cy < h - 1 ? curr + w : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n] && isNeutral(n)) {
        visited[n] = 1;
        queue.push(n);
      }
    }
  }

  console.log(`Rendered ${queue.length} checkerboard pixels to transparent alpha.`);

  // Save full-res master transparent PNG
  const cleanEmblemBuffer = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .trim() // Trim outer transparent padding for perfect centering
    .png()
    .toBuffer();

  const brandDir = path.resolve("public/brand");
  if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

  fs.writeFileSync(path.join(brandDir, "webpage-logo.png"), cleanEmblemBuffer);
  fs.writeFileSync(path.join(brandDir, "her-drive-light.png"), cleanEmblemBuffer);
  console.log("Saved master emblem to public/brand/webpage-logo.png and public/brand/her-drive-light.png");

  // Generate Favicon sizes
  const sizes = [16, 32, 48, 64, 180, 192, 512];
  const pngBuffers = {};

  for (const s of sizes) {
    pngBuffers[s] = await sharp(cleanEmblemBuffer)
      .resize(s, s, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  fs.writeFileSync(path.resolve("public/favicon.png"), pngBuffers[48]);
  fs.writeFileSync(path.resolve("public/favicon-32x32.png"), pngBuffers[32]);
  fs.writeFileSync(path.resolve("public/favicon-16x16.png"), pngBuffers[16]);
  fs.writeFileSync(path.resolve("public/apple-touch-icon.png"), pngBuffers[180]);
  fs.writeFileSync(path.resolve("app/icon.png"), pngBuffers[192]);
  fs.writeFileSync(path.resolve("app/apple-icon.png"), pngBuffers[180]);

  // Generate standard ICO file for legacy browser fallbacks
  const icoSizes = [16, 32, 48];
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + icoSizes.length * entrySize;

  const entries = [];
  const imageBuffers = [];

  for (const s of icoSizes) {
    const buf = pngBuffers[s];
    imageBuffers.push(buf);

    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(s, 0);
    entry.writeUInt8(s, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);

    entries.push(entry);
    offset += buf.length;
  }

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(icoSizes.length, 4);

  const icoBuffer = Buffer.concat([header, ...entries, ...imageBuffers]);
  fs.writeFileSync(path.resolve("public/favicon.ico"), icoBuffer);

  console.log("Successfully generated all webpage logos and browser favicons.");
}

processWebpageLogo().catch(console.error);
