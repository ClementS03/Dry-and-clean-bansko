/**
 * Genere les images Open Graph en 1200x630 dans public/.
 *
 *   node scripts/make-og.mjs
 *
 * Playwright n est pas une dependance du projet, le script le prend dans
 * le dossier voisin freelanceos. Surcharge possible :
 *   PLAYWRIGHT_PATH=/chemin/vers/playwright node scripts/make-og.mjs
 *
 * Regles : jamais de prix, jamais de telephone, jamais de QR code.
 * Le texte reste loin des bords, certaines plateformes rognent 10 pour cent.
 */
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? "../../freelanceos/node_modules/playwright");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
// pathToFileURL encode les espaces du chemin, que file:/// brut laisserait casser
const asUrl = (p) => pathToFileURL(path.join(PUBLIC, p)).href;

// Les photos sources vivent hors de public/ pour que le script reste idempotent :
// sans cela, un second passage recadrerait une image deja recadree.
const SOURCE = path.join(ROOT, "scripts", "og-source");
const srcUrl = (p) => pathToFileURL(path.join(SOURCE, p)).href;

const W = 1200;
const H = 630;
const SPLIT = 44.5; // largeur du panneau sombre, en pourcent

/** Panneau droit de l accueil : le meme canape, avant au-dessus, apres en dessous. */
const beforeAfter = `
  <div class="pane">
    <div class="half">
      <img src="${asUrl("gallery/home/before-1.jpg")}" alt="">
      <span class="tag tag-dark">%BEFORE%</span>
    </div>
    <div class="rule"></div>
    <div class="half">
      <img src="${asUrl("gallery/home/after-1.jpg")}" alt="">
      <span class="tag tag-gold">%AFTER%</span>
    </div>
  </div>`;

/**
 * Panneau droit de la page business : la photo de chambre n existe que dans
 * l ancienne OG, on la recadre depuis celle-ci plutot que de la perdre.
 * Source 1503x789, le panneau sombre s y arrete a 44.5 pour cent.
 */
const croppedFrom = (file) => {
  const srcW = 1503;
  const srcH = 789;
  // Dans l ancienne image le titre debordait du panneau sombre sur la photo.
  // On coupe au-dela pour ne pas recuperer ce fantome de texte.
  const cropX = 0.48;
  const paneW = W * (1 - SPLIT / 100);
  const scale = Math.max(paneW / (srcW * (1 - cropX)), H / srcH);
  const w = srcW * scale;
  const h = srcH * scale;
  return `
  <div class="pane">
    <img class="crop" src="${srcUrl(file)}"
         style="width:${w}px;height:${h}px;margin-left:${-srcW * cropX * scale}px;margin-top:${(H - h) / 2}px">
  </div>`;
};

const IMAGES = [
  {
    file: "og-image-bg.jpg",
    kicker: "Мебели · Апартаменти · Прозорци",
    title: ["Като", "нови."],
    text: "Професионално почистване на място в Банско и региона.",
    badges: ["Идваме при вас", "Безплатна оферта"],
    domain: "wetdrycleaningbansko.com",
    pane: beforeAfter.replace("%BEFORE%", "Преди").replace("%AFTER%", "След"),
  },
  {
    file: "og-image.jpg",
    kicker: "Furniture · Flats · Windows",
    title: ["Like new", "again."],
    text: "Professional cleaning at your place in Bansko and the region.",
    badges: ["We come to you", "Free offer"],
    domain: "wetdrycleaningbansko.com",
    pane: beforeAfter.replace("%BEFORE%", "Before").replace("%AFTER%", "After"),
  },
  {
    file: "og-image-ru.jpg",
    kicker: "Мебель · Квартиры · Окна",
    title: ["Как", "новые."],
    text: "Профессиональная уборка у вас в Банско и окрестностях.",
    badges: ["Приезжаем к вам", "Бесплатное предложение"],
    domain: "wetdrycleaningbansko.com",
    pane: beforeAfter.replace("%BEFORE%", "До").replace("%AFTER%", "После"),
  },
  {
    file: "og-hotels-bg.jpg",
    kicker: "За хотели · Гестхаузи · Бизнес обекти",
    title: ["Гостите забелязват", "чистотата."],
    text: "Почистване около вашите гости и вашия график.",
    badges: ["Около гостите", "Месечни договори", "Застраховани"],
    domain: "wetdrycleaningbansko.com/business",
    pane: croppedFrom("og-hotels-bg.jpg"),
  },
  {
    file: "og-hotels.jpg",
    kicker: "For hotels · Guesthouses · Businesses",
    title: ["Your guests notice", "cleanliness."],
    text: "Cleaning that works around your guests and your schedule.",
    badges: ["Around your guests", "Monthly contracts", "Insured"],
    domain: "wetdrycleaningbansko.com/business",
    pane: croppedFrom("og-hotels.jpg"),
  },
  {
    file: "og-hotels-ru.jpg",
    kicker: "Для отелей · Гостевых домов · Бизнеса",
    title: ["Гости замечают", "чистоту."],
    text: "Уборка вокруг ваших гостей и вашего графика.",
    badges: ["Вокруг гостей", "Договоры на месяц", "Застрахованы"],
    domain: "wetdrycleaningbansko.com/business",
    pane: croppedFrom("og-hotels-ru.jpg"),
  },
];

const html = (d) => `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${W}px; height:${H}px; background:#0A0A0A; display:flex; overflow:hidden; }
  .left { width:${SPLIT}%; height:100%; padding:44px 40px; display:flex; flex-direction:column;
          background:linear-gradient(135deg,#141206 0%,#0A0A0A 62%); }
  .brand { display:flex; align-items:center; gap:16px; }
  .brand img { width:52px; height:52px; border-radius:50%; object-fit:cover; }
  .brand span { font-family:Oswald,sans-serif; font-weight:500; font-size:22px; letter-spacing:.14em;
                text-transform:uppercase; color:#F5F0E8; }
  .brand b { color:#F5C400; }
  .body { margin-top:auto; }
  .kicker { font-family:Oswald,sans-serif; font-weight:500; font-size:15px; letter-spacing:.16em;
            text-transform:uppercase; color:#F5C400; margin-bottom:14px; }
  h1 { font-family:Oswald,sans-serif; font-weight:700; font-size:56px; line-height:1.02;
       letter-spacing:-.01em; text-transform:uppercase; color:#F5F0E8; }
  h1 em { font-style:normal; color:#F5C400; }
  p { font-family:'DM Sans',sans-serif; font-size:19px; line-height:1.45; color:rgba(245,240,232,.72);
      margin-top:16px; max-width:24em; }
  .badges { display:flex; flex-wrap:wrap; gap:9px; margin-top:24px; }
  .badge { font-family:Oswald,sans-serif; font-weight:500; font-size:13px; letter-spacing:.09em;
           text-transform:uppercase; color:#F5F0E8; border:1px solid rgba(245,196,0,.32);
           background:rgba(245,196,0,.07); border-radius:3px; padding:8px 13px; }
  .domain { font-family:Oswald,sans-serif; font-weight:500; font-size:14px; letter-spacing:.13em;
            text-transform:uppercase; color:#F5C400; margin-top:26px; }
  .pane { width:${100 - SPLIT}%; height:100%; position:relative; overflow:hidden; background:#0A0A0A; }
  .half { position:relative; width:100%; height:50%; overflow:hidden; }
  .half img { width:100%; height:100%; object-fit:cover; display:block; }
  .rule { position:absolute; top:50%; left:0; right:0; height:3px; background:#F5C400;
          transform:translateY(-1.5px); z-index:2; }
  .crop { display:block; object-fit:cover; }
  .tag { position:absolute; top:16px; left:16px; font-family:Oswald,sans-serif; font-weight:700;
         font-size:13px; letter-spacing:.1em; text-transform:uppercase; padding:5px 11px; border-radius:3px; }
  .tag-dark { background:rgba(10,10,10,.82); color:#F5F0E8; }
  .tag-gold { background:#F5C400; color:#0A0A0A; }
</style></head>
<body>
  <div class="left">
    <div class="brand">
      <img src="${asUrl("logo.png")}" alt="">
      <span>Wet<b>&amp;</b>Dry Cleaning</span>
    </div>
    <div class="body">
      <div class="kicker">${d.kicker}</div>
      <h1>${d.title[0]} <em>${d.title[1]}</em></h1>
      <p>${d.text}</p>
      <div class="badges">${d.badges.map((b) => `<span class="badge">${b}</span>`).join("")}</div>
      <div class="domain">${d.domain}</div>
    </div>
  </div>
  ${d.pane}
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

// Une page issue de setContent a pour origine about:blank et Chromium y
// bloque les sous-ressources file://. On passe donc par un fichier reel.
const tmp = path.join(ROOT, "scripts", ".og-tmp.html");

for (const image of IMAGES) {
  fs.writeFileSync(tmp, html(image), "utf8");
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(PUBLIC, image.file),
    type: "jpeg",
    quality: 88,
    clip: { x: 0, y: 0, width: W, height: H },
  });
  console.log("ecrit", image.file, W + "x" + H);
}

fs.unlinkSync(tmp);
await browser.close();
