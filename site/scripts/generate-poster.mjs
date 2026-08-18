// Generates the QR poster: poster.html (source of truth, styled with the
// site's own palette/font) plus poster.pdf (rendered from it). The PDF
// render step needs a local Chromium binary — see README note below.
import QRCode from "qrcode";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://valvk.github.io/rozkazhy/";
const OUT_DIR = join(__dirname, "..", "public");
const FONT_DIR = join(__dirname, "..", "node_modules", "@fontsource", "pt-sans", "files");

const qrSvg = await QRCode.toString(SITE_URL, {
  type: "svg",
  margin: 0,
  color: { dark: "#2B2A33", light: "#00000000" },
});

// Embed the actual font files as base64 rather than relying on whatever's
// installed on the machine that renders the poster — print typography
// should match the brand exactly, not fall back silently.
function fontDataUri(filename) {
  const buf = readFileSync(join(FONT_DIR, filename));
  return `data:font/woff2;base64,${buf.toString("base64")}`;
}
const ptSansRegular = fontDataUri("pt-sans-cyrillic-400-normal.woff2");
const ptSansBold = fontDataUri("pt-sans-cyrillic-700-normal.woff2");

const html = `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "PT Sans";
    font-weight: 400;
    src: url("${ptSansRegular}") format("woff2");
  }
  @font-face {
    font-family: "PT Sans";
    font-weight: 700;
    src: url("${ptSansBold}") format("woff2");
  }
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    width: 210mm;
    height: 297mm;
    font-family: "PT Sans", -apple-system, "Segoe UI", Roboto, sans-serif;
    background: #FBF8F3;
    color: #2B2A33;
  }
  .poster {
    width: 210mm;
    height: 297mm;
    padding: 18mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  .dot {
    position: absolute;
    border-radius: 50%;
  }
  .eyebrow {
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6B6B78;
  }
  h1 {
    font-size: 76px;
    font-weight: 700;
    margin: 10px 0 0;
    letter-spacing: -0.01em;
  }
  .tagline {
    font-size: 22px;
    color: #6B6B78;
    text-align: center;
    max-width: 130mm;
    margin-top: 14px;
    line-height: 1.4;
  }
  .card-row {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-top: 26px;
  }
  .card {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }
  .qr-block {
    background: white;
    border-radius: 32px;
    padding: 20px;
    box-shadow: 0 8px 30px rgba(43,42,51,0.12);
  }
  .qr-block svg {
    width: 62mm;
    height: 62mm;
    display: block;
  }
  .scan-label {
    font-weight: 700;
    font-size: 20px;
    margin-top: 18px;
    text-align: center;
  }
  .url {
    font-size: 15px;
    color: #6B6B78;
    margin-top: 6px;
  }
  .footer {
    font-size: 13px;
    color: #6B6B78;
    text-align: center;
  }
</style>
</head>
<body>
  <div class="poster">
    <div class="dot" style="width:70px;height:70px;background:#E0A526;opacity:0.25;top:20mm;left:14mm;"></div>
    <div class="dot" style="width:40px;height:40px;background:#377196;opacity:0.25;top:60mm;right:16mm;"></div>
    <div class="dot" style="width:50px;height:50px;background:#43763F;opacity:0.2;bottom:70mm;left:18mm;"></div>
    <div class="dot" style="width:34px;height:34px;background:#BA3E5F;opacity:0.25;bottom:40mm;right:22mm;"></div>

    <div style="text-align:center; margin-top: 12mm;">
      <div class="eyebrow">Картки замість слів</div>
      <h1>Розкажи</h1>
      <p class="tagline">
        Застосунок для дітей, яким важко говорити словами.
        Дотик до картки — і чути голос, який дитина впізнає.
      </p>
      <div class="card-row">
        <div class="card" style="background:#E0A526;"></div>
        <div class="card" style="background:#43763F;"></div>
        <div class="card" style="background:#D97B3D;"></div>
        <div class="card" style="background:#377196;"></div>
        <div class="card" style="background:#BA3E5F;"></div>
      </div>
    </div>

    <div style="display:flex; flex-direction: column; align-items:center;">
      <div class="qr-block">${qrSvg}</div>
      <div class="scan-label">Наведіть камеру телефону</div>
      <div class="url">${SITE_URL.replace("https://", "")}</div>
    </div>

    <div class="footer">Безкоштовно · Відкритий код (MIT) · Без реклами</div>
  </div>
</body>
</html>
`;

writeFileSync(join(OUT_DIR, "poster.html"), html);
console.log("Wrote", join(OUT_DIR, "poster.html"));
