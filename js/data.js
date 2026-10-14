/* ==========================================================
   REKOM™ — CATÀLEG
   Totes les dades de la botiga viuen aquí. Per afegir un
   producte nou només cal afegir un objecte a PRODUCTS.
   ========================================================== */

window.REKOM_CONFIG = {
  currency: 'EUR',
  locale: 'es-ES',
  freeShippingFrom: 150,
  shipping: {
    standard: { label: 'Standard', eta: '3–5 business days', price: 5.95 },
    express:  { label: 'Express',  eta: '24–48 h',           price: 9.95 }
  },
  // Codis de descompte (percentatge)
  discountCodes: { REKOM10: 10 },
  // Data del proper drop (compte enrere a la home i a la botiga)
  nextDrop: { name: 'Drop 002', date: '2026-12-05T20:00:00+01:00' },
  sizes: ['S-M', 'L-XL'],
  editionSize: 50
};

window.REKOM_PRODUCTS = [
  {
    id: 'umbra',
    name: 'Umbra',
    drop: 'Drop 001',
    tagline: 'The shadow you wear.',
    colorway: 'Jet Black / Ultraviolet',
    colors: ['black', 'purple'],
    swatch: ['#0b0b0d', '#5d00ff'],
    price: 119.95,
    badge: 'Bestseller',
    stock: { 'S-M': 6, 'L-XL': 3 },
    description:
      'Total black, zero noise. Umbra keeps the front almost silent — a single R on the chest — and lets the back do the talking with a hand-printed ultraviolet REKOM wordmark across the shoulders.',
    details: [
      'Heavyweight brushed cotton fleece',
      'Relaxed oversized fit, dropped shoulders',
      'Double-layer hood with purple-tipped drawcords',
      'Hand-printed ultraviolet back graphic',
      'Kangaroo pocket & ribbed cuffs and hem'
    ]
  },
  {
    id: 'venom',
    name: 'Venom',
    drop: 'Drop 001',
    tagline: 'Spreads before you notice.',
    colorway: 'Midnight Navy / Bone White',
    colors: ['navy', 'white'],
    swatch: ['#1c1554', '#f1f0f5'],
    price: 119.95,
    badge: 'New',
    stock: { 'S-M': 9, 'L-XL': 7 },
    description:
      'An all-over cut of the REKOM R, mutated and wrapped around the body. Bone white panels bleed into midnight navy — no two angles read the same. The back carries a clean oversized R on a solid navy field.',
    details: [
      'Heavyweight brushed cotton fleece',
      'Relaxed oversized fit, dropped shoulders',
      'All-over contrast pattern',
      'Oversized R back graphic',
      'Kangaroo pocket & ribbed cuffs and hem'
    ]
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    drop: 'Drop 001',
    tagline: 'Light and dark, same body.',
    colorway: 'Bone White / Jet Black',
    colors: ['white', 'black'],
    swatch: ['#f1f0f5', '#0b0b0d'],
    price: 119.95,
    badge: 'Low stock',
    stock: { 'S-M': 2, 'L-XL': 4 },
    description:
      'The inverse of Venom. Eclipse is built on a bone white base swallowed by giant black strokes of the R — a piece that looks different every time you move. Loud, graphic, unmistakable.',
    details: [
      'Heavyweight brushed cotton fleece',
      'Relaxed oversized fit, dropped shoulders',
      'All-over black-on-white pattern',
      'Purple-tipped drawcords',
      'Kangaroo pocket & ribbed cuffs and hem'
    ]
  },
  {
    id: 'void',
    name: 'Void',
    drop: 'Drop 001',
    tagline: 'Camouflage for the underground.',
    colorway: 'Jet Black / Ultraviolet Camo',
    colors: ['black', 'purple'],
    swatch: ['#0b0b0d', '#3a19c9'],
    price: 119.95,
    badge: null,
    stock: { 'S-M': 8, 'L-XL': 0 },
    description:
      'REKOM camo. Liquid ultraviolet shapes crawl up the sleeves and explode across the back, hiding the wordmark inside the pattern. Clean black body, tonal chest R. Made to disappear in the crowd — and stand out anyway.',
    details: [
      'Heavyweight brushed cotton fleece',
      'Relaxed oversized fit, dropped shoulders',
      'Ultraviolet camo sleeves & back',
      'Tonal embroidered-look chest R',
      'Kangaroo pocket & ribbed cuffs and hem'
    ]
  }
];

// Rutes d'imatge generades a partir de l'id
window.REKOM_PRODUCTS.forEach(p => {
  p.img = {
    front: `assets/img/products/${p.id}-front-700.webp`,
    back: `assets/img/products/${p.id}-back-700.webp`,
    frontLg: `assets/img/products/${p.id}-front-1400.webp`,
    backLg: `assets/img/products/${p.id}-back-1400.webp`
  };
  p.url = `product.html?id=${p.id}`;
});
