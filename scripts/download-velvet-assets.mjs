import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assets = [
  ["public/Images/logo.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/4779220f-8c1c-4532-ac5e-04c7bdc91b1f/Layer+1.png?format=1500w"],
  ["public/Images/hero.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/79cf2ee5-9188-460b-89eb-fb24bae09237/Group+4.png?format=1500w"],
  ["public/Images/storefront.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/16254c0c-1788-4e52-83c7-62a23d43cf05/DSC00715.png?format=1500w"],
  ["public/Images/bakery.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/de63d95d-5a6a-4c24-bd46-29da9a57246f/SYNDEO.jpg?format=750w"],
  ["public/Images/dish-1.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/45f327a5-d596-4cec-aa89-e4680abae414/Group+6.png?format=1500w"],
  ["public/Images/dish-2.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/0635037a-1e05-4c25-ab2a-8ecea14d94b3/ChatGPT+Image+Apr+30%2C+2026%2C+07_51_31+AM.png?format=1500w"],
  ["public/Images/dish-3.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/3fc0c730-f445-46af-bcc3-0742dcf5bf5d/Layer+15.png?format=1500w"],
  ["public/Images/dish-4.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/1b41551f-7538-46fe-91c2-83eeb7d24133/IMG_7737.jpg?format=1500w"],
  ["public/Images/menu/bakery-sweets.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/b218cdea-a8f1-41c6-938b-8bbc4aa05d7f/ChatGPT+Image+Jul+7%2C+2026%2C+11_30_27+PM.png?format=1500w"],
  ["public/Images/specialties/botox.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/58b0b47e-8a8e-4eb6-b326-03ec8d1ec79f/Beige+Minimalist+Skincare+Before+and+After+Instagram+Post.png?format=750w"],
  ["public/Images/specialties/filler.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/358bce2e-1c05-4dac-af64-5bbc1a97d23f/Beige+Minimalist+Skincare+Before+and+After+Instagram+Post+%282%29.PNG?format=750w"],
  ["public/Images/specialties/hydrafacial.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/de63d95d-5a6a-4c24-bd46-29da9a57246f/SYNDEO.jpg?format=750w"],
  ["public/Images/specialties/skin-care.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/97547c25-8865-4296-9ba8-dbf04b2e136e/Screenshot_7-7-2026_234944_mariniskinsolutions.com.jpeg?format=500w"],
  ["public/Images/specialties/chemical-peel.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/ac8a36d7-2878-4145-8317-90d629067a98/ChatGPT+Image+May+29%2C+2026%2C+11_03_20+PM.png?format=750w"],
  ["public/Images/specialties/microneedling.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/1771628003421-H6ARMMEPXJ4MPTYFW3YC/Brown+Minimalist+Skincare+Before+After+Collage+Instagram+Post.png?format=1500w"],
  ["public/Images/specialties/weight-management.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/0635037a-1e05-4c25-ab2a-8ecea14d94b3/ChatGPT+Image+Apr+30%2C+2026%2C+07_51_31+AM.png?format=1500w"],
  ["public/Images/specialties/peptides.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/6fa3e8e9-10b3-4289-b6b2-49ce8b637512/BPC.png?format=750w"],
  ["public/Images/gallery/baklava-boxed.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/58b0b47e-8a8e-4eb6-b326-03ec8d1ec79f/Beige+Minimalist+Skincare+Before+and+After+Instagram+Post.png?format=750w"],
  ["public/Images/gallery/baklava-pistachio-copper.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/d6bb421c-abd8-4b3a-b624-df45920c8ef3/Beige+Minimalist+Skincare+Before+and+After+Instagram+Post.png?format=750w"],
  ["public/Images/gallery/baklava-pistachio-plate.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/358bce2e-1c05-4dac-af64-5bbc1a97d23f/Beige+Minimalist+Skincare+Before+and+After+Instagram+Post+%282%29.PNG?format=750w"],
  ["public/Images/gallery/baklava-tiered-tray.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/714b1c6a-ef47-4dc4-a147-5f056f11de9c/Beige+Minimalist+Skincare+Before+and+After+Instagram+Post+%281%29.PNG?format=750w"],
  ["public/Images/gallery/dessert-tray-box.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/1738398295088-61C4OMD9G85DPIS21J6I/Media+7-7826A1BD-0F55-434D-8690-83BAFFA956A9.jpg?format=750w"],
  ["public/Images/gallery/ladyfingers-pistachio.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/f8c3c779-f257-44e5-96c8-a8610d51ad3b/IMG_1864.JPG?format=750w"],
  ["public/Images/gallery/sweets-platter-lamps.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/1a9fb923-8336-40fb-9629-03702d4b5a88/Artboard+2.png?format=1500w"],
  ["public/Images/gallery/zalabia-rings.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/9b987d2b-c45f-4f63-b2fd-099ed73857e7/HydrinityParty%40LuvByDre-213.jpg?format=750w"],
  ["public/Images/gallery/zalabia-tray.webp", "https://images.squarespace-cdn.com/content/v1/678eb9292771cf0256ecee93/18d58840-fa09-4e30-bf5d-887b250990af/Layer+8.png?format=750w"],
];

for (const [target, url] of assets) {
  await mkdir(path.dirname(target), { recursive: true });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  const output = await sharp(input)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  await writeFile(target, output);
}

console.log(`Replaced ${assets.length} image assets with Velvet imagery.`);
