/* ==========================================================
   REKOM™ — HOME
   ========================================================== */
(() => {
  const { $, $$ } = window.REKOM;

  // Spotlight: canviar entre davant i darrere
  const spot = $('#spot');
  if (spot) {
    const label = $('[data-spot-label]', spot);
    const show = side => {
      $$('img', spot).forEach(img => img.classList.toggle('is-hidden', img.dataset.side !== side));
      $$('[data-spot]', spot).forEach(b => b.classList.toggle('active', b.dataset.spot === side));
      label.textContent = side === 'front' ? 'Front' : 'Back';
    };
    $$('[data-spot]', spot).forEach(b => b.addEventListener('click', () => show(b.dataset.spot)));
  }

  // Paraula gegant del hero: segueix suaument el ratolí
  const word = $('#hero-word');
  const hero = $('.hero');
  if (word && hero && matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let tx = 0, ty = 0, x = 0, y = 0;
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * -40;
      ty = ((e.clientY - r.top) / r.height - 0.5) * -24;
    });
    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      word.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      requestAnimationFrame(loop);
    };
    loop();
  }
})();
