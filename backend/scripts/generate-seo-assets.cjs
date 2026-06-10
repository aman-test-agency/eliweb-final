const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..", "..");
const logoPath = path.join(root, "frontend/public/eliweb-logo.png");
const publicDir = path.join(root, "frontend/public");
const appDir = path.join(root, "frontend/app");

async function logoBuffer(size) {
  return sharp(logoPath)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  const logo512 = await logoBuffer(400);

  await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: logo512, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "favicon1.png"));

  await sharp({
    create: { width: 512, height: 512, channels: 3, background: "#0A0A0A" },
  })
    .composite([{ input: logo512, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "faviconbg.png"));

  const favicon32 = await sharp(path.join(publicDir, "faviconbg.png")).resize(32, 32).png().toBuffer();
  await sharp(favicon32).toFile(path.join(publicDir, "favicon1.png"));
  await sharp(favicon32).toFile(path.join(appDir, "favicon1.png"));

  fs.copyFileSync(path.join(publicDir, "favicon1.png"), path.join(appDir, "icon.png"));
  fs.copyFileSync(path.join(publicDir, "favicon1.png"), path.join(appDir, "apple-icon.png"));

  const ogLogo = await sharp(logoPath)
    .resize(140, 140, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const ogSvg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0A0A0A"/>
  <text x="600" y="300" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#F5C842" text-anchor="middle">EliWeb.in</text>
  <text x="600" y="380" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#888888" text-anchor="middle">We Build. We Edit. We Elevate.</text>
</svg>`);

  await sharp(ogSvg)
    .composite([{ input: ogLogo, top: 90, left: 530 }])
    .jpeg({ quality: 90 })
    .toFile(path.join(publicDir, "og-image.jpg"));

  console.log("SEO assets generated in frontend/public and frontend/app");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
