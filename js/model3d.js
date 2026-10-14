/* ==========================================================
   REKOM™ — LOGO 3D (model-viewer)
   Pinta el logo amb un morat metàl·lic i fa una entrada suau.
   ========================================================== */
const mv = document.getElementById('logo3d');

if (mv) {
  mv.style.opacity = '0';
  mv.style.transition = 'opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1)';

  mv.addEventListener('load', () => {
    const mats = mv.model?.materials ?? [];
    mats.forEach(m => {
      const pbr = m.pbrMetallicRoughness;
      if (!pbr) return;
      pbr.setBaseColorFactor([0.30, 0.0, 1.0, 1]);
      pbr.setMetallicFactor(1);
      pbr.setRoughnessFactor(0.12);
    });
    mv.style.opacity = '1';
  });

  // Si l'usuari interactua, s'atura l'autorotació un moment i després continua
  mv.addEventListener('camera-change', e => {
    if (e.detail.source === 'user-interaction') {
      mv.autoRotateDelay = 2500;
    }
  });
}
