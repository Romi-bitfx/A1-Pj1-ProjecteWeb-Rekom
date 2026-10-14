/* ==========================================================
   REKOM™ — PÀGINES LEGALS: índex lateral actiu
   ========================================================== */
(() => {
  const links = [...document.querySelectorAll('.toc a')];
  const heads = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!heads.length) return;

  const setActive = id => links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id); });
  }, { rootMargin: '-20% 0px -70% 0px' });
  heads.forEach(h => io.observe(h));
})();
