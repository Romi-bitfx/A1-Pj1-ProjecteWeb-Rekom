const mv = document.getElementById('logo3d');

    if (mv) {
      mv.addEventListener('load', () => {
        const model = mv.model;
        const mats = (model && model.materials) ? model.materials : [];
        const color = [20 / 255, 0, 93 / 255, 1];

        mats.forEach(m => {
          const pbr = m.pbrMetallicRoughness;
          if (!pbr) return;
          if (typeof pbr.setBaseColorFactor === 'function') {
            pbr.setBaseColorFactor(color);
          }
          if (typeof pbr.setMetallicFactor === 'function') {
            pbr.setMetallicFactor(1);
          }
          if (typeof pbr.setRoughnessFactor === 'function') {
            pbr.setRoughnessFactor(0);
          }
          if ('metallicRoughnessTexture' in m) {
            m.metallicRoughnessTexture = null;
          }
        });
      });
    }